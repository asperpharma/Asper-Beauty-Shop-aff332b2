import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, dd-signature",
};

/**
 * Verifies the HMAC SHA-256 signature from Datadog webhook
 * @param signature The signature from DD-Signature header
 * @param body The raw request body
 * @param secret The webhook secret
 * @returns true if signature is valid, false otherwise
 */
async function verifyDatadogSignature(
  signature: string,
  body: string,
  secret: string,
): Promise<boolean> {
  try {
    // Datadog sends the signature in the format: "sha256=<hex_string>"
    if (!signature.startsWith("sha256=")) {
      console.error("Invalid signature format - must start with 'sha256='");
      return false;
    }

    const receivedSignature = signature.replace("sha256=", "");
    
    // Create HMAC SHA-256 signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body),
    );

    // Convert to hex string
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Timing-safe comparison to prevent timing attacks
    if (receivedSignature.length !== computedSignature.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < receivedSignature.length; i++) {
      result |= receivedSignature.charCodeAt(i) ^ computedSignature.charCodeAt(i);
    }

    return result === 0;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get the webhook secret from environment
    const webhookSecret = Deno.env.get("DATADOG_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("DATADOG_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Webhook not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get the signature from the header
    const signature = req.headers.get("DD-Signature");
    if (!signature) {
      console.error("Missing DD-Signature header");
      return new Response(
        JSON.stringify({ error: "Missing signature" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Read the raw body
    const rawBody = await req.text();
    
    // Verify the signature
    const isValid = await verifyDatadogSignature(
      signature,
      rawBody,
      webhookSecret,
    );

    if (!isValid) {
      console.error("Invalid signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Parse the validated webhook payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      console.error("Invalid JSON payload:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Log the alert details
    console.log("Received valid Datadog alert:", {
      title: payload.title,
      body: payload.body,
      alert_type: payload.alert_type,
      priority: payload.priority,
      date_happened: payload.date_happened,
      tags: payload.tags,
    });

    // Here you can add your custom logic to handle the alert
    // For example: send notifications, update database, trigger actions, etc.

    // Return success response
    return new Response(
      JSON.stringify({ 
        status: "success",
        message: "Webhook received and verified"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Datadog webhook error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
