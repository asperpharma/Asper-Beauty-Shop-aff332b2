import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-route, x-webhook-signature",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Maximum request body size (256 KB)
const MAX_BODY_SIZE = 256 * 1024;

// Rate limiting map (in-memory, per instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute per IP

interface WebhookEvent {
  route: string;
  sourceIp: string | null;
  headers: Record<string, string>;
  body: unknown;
  eventId?: string;
}

interface ProcessResult {
  reply?: string;
  concern_slug?: string;
  logged: boolean;
  conversationId?: string;
}

/**
 * Check rate limit for a given IP address
 */
function checkRateLimit(ip: string): { limited: boolean; retryAfter?: number } {
  const now = Date.now();
  const existing = rateLimitMap.get(ip);

  if (existing) {
    if (now < existing.resetAt) {
      if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
        const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
        return { limited: true, retryAfter };
      }
      existing.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  }

  return { limited: false };
}

/**
 * Validate webhook signature (if WEBHOOK_SECRET is configured)
 */
function validateSignature(
  body: string,
  signature: string | null,
  secret: string | null,
): boolean {
  if (!secret) {
    return true; // No secret configured, skip validation
  }

  if (!signature) {
    return false; // Secret configured but no signature provided
  }

  // Simple HMAC validation (can be extended for specific services)
  // For production, implement proper HMAC-SHA256 validation
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(body);
    const keyData = encoder.encode(secret);

    // This is a simplified check - in production, use proper crypto.subtle.sign
    const expectedPrefix = secret.substring(0, 8);
    return signature.includes(expectedPrefix);
  } catch {
    return false;
  }
}

/**
 * Determine the route from query params or headers
 */
function determineRoute(req: Request): string {
  const url = new URL(req.url);
  const routeParam = url.searchParams.get("route");
  const routeHeader = req.headers.get("x-webhook-route");

  const route = routeParam || routeHeader || "generic";

  // Validate route
  const validRoutes = ["gorgias", "manychat", "generic"];
  if (!validRoutes.includes(route)) {
    return "generic";
  }

  return route;
}

/**
 * Extract customer ID from webhook body based on route
 */
function extractCustomerId(body: any, route: string): string | null {
  try {
    if (route === "gorgias") {
      return body?.customer?.id?.toString() || body?.ticket?.customer?.id?.toString() || null;
    } else if (route === "manychat") {
      return body?.user_id?.toString() || body?.subscriber?.id?.toString() || null;
    } else {
      // Generic: try common fields
      return body?.customer_id?.toString() || body?.user_id?.toString() || null;
    }
  } catch {
    return null;
  }
}

/**
 * Extract message from webhook body based on route
 */
function extractMessage(body: any, route: string): string | null {
  try {
    if (route === "gorgias") {
      return body?.message?.body_text || body?.text || null;
    } else if (route === "manychat") {
      return body?.message?.text || body?.text || null;
    } else {
      return body?.message || body?.text || null;
    }
  } catch {
    return null;
  }
}

/**
 * Log webhook event to database
 */
async function logWebhookEvent(
  supabase: any,
  event: WebhookEvent,
  result: Partial<ProcessResult>,
  error: string | null,
  processingTimeMs: number,
): Promise<void> {
  try {
    const { error: insertError } = await supabase
      .from("webhook_events")
      .insert({
        event_id: event.eventId,
        route: event.route,
        source_ip: event.sourceIp,
        headers: event.headers,
        body: event.body,
        signature_valid: true, // Assume valid if we got this far
        conversation_id: result.conversationId || null,
        ai_reply: result.reply || null,
        concern_slug: result.concern_slug || null,
        status: error ? "error" : "processed",
        error_message: error,
        processing_time_ms: processingTimeMs,
      });

    if (insertError) {
      console.error("Failed to log webhook event:", insertError);
    }
  } catch (logError) {
    console.error("Exception logging webhook event:", logError);
  }
}

/**
 * Get or create conversation context
 */
async function getOrCreateConversation(
  supabase: any,
  customerId: string,
  channel: string,
): Promise<{ id: string; context: any } | null> {
  try {
    // Try to get existing conversation
    const { data: existing, error: fetchError } = await supabase
      .from("conversations")
      .select("*")
      .eq("customer_id", customerId)
      .eq("channel", channel)
      .single();

    if (existing && !fetchError) {
      return { id: existing.id, context: existing.context };
    }

    // Create new conversation
    const { data: created, error: createError } = await supabase
      .from("conversations")
      .insert({
        customer_id: customerId,
        channel,
        context: {},
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error("Failed to create conversation:", createError);
      return null;
    }

    return { id: created.id, context: created.context };
  } catch (error) {
    console.error("Exception getting/creating conversation:", error);
    return null;
  }
}

/**
 * Update conversation with new message
 */
async function updateConversation(
  supabase: any,
  conversationId: string,
  message: string,
  reply: string | null,
): Promise<void> {
  try {
    // Get current context
    const { data: conv } = await supabase
      .from("conversations")
      .select("context")
      .eq("id", conversationId)
      .single();

    const context = conv?.context || {};
    const messages = context.messages || [];

    // Add new message and reply to context
    messages.push({
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    });

    if (reply) {
      messages.push({
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      });
    }

    // Keep only last 20 messages to prevent unbounded growth
    const recentMessages = messages.slice(-20);

    await supabase
      .from("conversations")
      .update({
        context: { ...context, messages: recentMessages },
        last_message_at: new Date().toISOString(),
      })
      .eq("id", conversationId);
  } catch (error) {
    console.error("Failed to update conversation:", error);
  }
}

/**
 * Get AI response from beauty-assistant
 */
async function getAIResponse(
  message: string,
  conversationContext: any,
): Promise<{ reply: string; concern_slug?: string } | null> {
  try {
    const BEAUTY_ASSISTANT_URL = Deno.env.get("BEAUTY_ASSISTANT_URL") ||
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/beauty-assistant`;

    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

    if (!SUPABASE_ANON_KEY) {
      console.error("SUPABASE_ANON_KEY not configured");
      return null;
    }

    // Build messages array from context
    const messages = conversationContext?.messages || [];
    messages.push({ role: "user", content: message });

    // Call beauty-assistant (needs proper auth token in production)
    const response = await fetch(BEAUTY_ASSISTANT_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      console.error(
        "Beauty assistant returned error:",
        response.status,
        await response.text(),
      );
      return null;
    }

    // For streaming responses, we need to collect the full response
    // In production, might want to handle streaming differently
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("text/event-stream")) {
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) return null;

      let fullReply = "";
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullReply += content;
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return { reply: fullReply.trim() };
    } else {
      // Handle JSON response
      const data = await response.json();
      return { reply: data.reply || data.message || "I'm here to help!" };
    }
  } catch (error) {
    console.error("Failed to get AI response:", error);
    return null;
  }
}

/**
 * Process webhook request
 */
async function processWebhook(
  req: Request,
  supabase: any,
): Promise<Response> {
  const startTime = Date.now();
  let webhookEvent: WebhookEvent | null = null;

  try {
    // Get source IP
    const sourceIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") || "unknown";

    // Check rate limit
    const rateLimitResult = checkRateLimit(sourceIp);
    if (rateLimitResult.limited) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded" }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Retry-After": rateLimitResult.retryAfter?.toString() || "60",
          },
        },
      );
    }

    // Read and validate body size
    const bodyText = await req.text();
    if (bodyText.length > MAX_BODY_SIZE) {
      return new Response(
        JSON.stringify({ error: "Request body too large (max 256 KB)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Parse JSON body
    let body: any;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Determine route
    const route = determineRoute(req);

    // Validate signature if WEBHOOK_SECRET is configured
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
    const signature = req.headers.get("x-webhook-signature") ||
      req.headers.get("authorization");

    if (webhookSecret && !validateSignature(bodyText, signature, webhookSecret)) {
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Extract idempotency key
    const eventId = body.event_id || body.id || req.headers.get("x-idempotency-key");

    // Check for duplicate event (if idempotency key provided)
    if (eventId) {
      const { data: existing } = await supabase
        .from("webhook_events")
        .select("id, ai_reply, concern_slug")
        .eq("event_id", eventId)
        .eq("route", route)
        .single();

      if (existing) {
        // Return cached response
        return new Response(
          JSON.stringify({
            reply: existing.ai_reply || "Request already processed",
            concern_slug: existing.concern_slug,
            logged: true,
            cached: true,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Build webhook event object
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    webhookEvent = {
      route,
      sourceIp,
      headers,
      body,
      eventId,
    };

    // Extract customer ID and message
    const customerId = extractCustomerId(body, route);
    const message = extractMessage(body, route);

    if (!message) {
      // No message to process, just log the event
      await logWebhookEvent(
        supabase,
        webhookEvent,
        {},
        "No message found in webhook body",
        Date.now() - startTime,
      );

      return new Response(
        JSON.stringify({
          reply: "No message to process",
          logged: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get or create conversation context (if customer ID available)
    let conversationId: string | undefined;
    let conversationContext: any = null;

    if (customerId) {
      const conversation = await getOrCreateConversation(
        supabase,
        customerId,
        route,
      );
      if (conversation) {
        conversationId = conversation.id;
        conversationContext = conversation.context;
      }
    }

    // Get AI response
    const aiResult = await getAIResponse(message, conversationContext);

    const result: ProcessResult = {
      reply: aiResult?.reply ||
        "Thank you for your message! Our beauty consultant will assist you shortly.",
      concern_slug: aiResult?.concern_slug,
      logged: false,
      conversationId,
    };

    // Update conversation with message and reply
    if (conversationId) {
      await updateConversation(
        supabase,
        conversationId,
        message,
        result.reply,
      );
    }

    // Log webhook event to database (background task)
    const processingTime = Date.now() - startTime;
    
    // Use try-catch to ensure logging doesn't fail the request
    try {
      await logWebhookEvent(
        supabase,
        webhookEvent,
        result,
        null,
        processingTime,
      );
      result.logged = true;
    } catch (logError) {
      console.error("Failed to log event:", logError);
    }

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Webhook processing error:", error);

    // Try to log the error
    if (webhookEvent) {
      try {
        await logWebhookEvent(
          supabase,
          webhookEvent,
          {},
          error instanceof Error ? error.message : "Unknown error",
          Date.now() - startTime,
        );
      } catch {
        // Ignore logging errors
      }
    }

    // Return fallback response
    return new Response(
      JSON.stringify({
        reply:
          "Thank you for your message! Our beauty consultant will assist you shortly.",
        logged: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 200, // Return 200 even on error to avoid channel retries
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
}

/**
 * Health check endpoint
 */
function healthCheck(): Response {
  return new Response(
    JSON.stringify({
      status: "ok",
      service: "process-webhook",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

/**
 * Main handler
 */
serve(async (req) => {
  // Handle OPTIONS for CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check
  const url = new URL(req.url);
  if (req.method === "GET" || url.searchParams.get("health") === "true") {
    return healthCheck();
  }

  // Only POST allowed for webhook processing
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Create Supabase client with service role for DB operations
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return new Response(
      JSON.stringify({ error: "Service configuration error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  return await processWebhook(req, supabase);
});
