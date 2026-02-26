import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, dd-signature",
};

/**
 * Verify HMAC SHA-256 signature from Datadog webhook
 * @param payload - The raw request body
 * @param signature - The DD-Signature header value
 * @param secret - The webhook secret key
 * @returns boolean indicating if signature is valid
 */
async function verifyDatadogSignature(
  payload: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    // Create HMAC-SHA256 hash of the payload
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);

    // Import the secret key for HMAC
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    // Generate the HMAC signature
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      messageData,
    );

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const computedSignature = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Compare signatures (case-insensitive)
    return computedSignature.toLowerCase() === signature.toLowerCase();
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

    // Get the signature from headers
    const ddSignature = req.headers.get("DD-Signature");

    if (!ddSignature) {
      console.error("Missing DD-Signature header");
      return new Response(
        JSON.stringify({ error: "Missing DD-Signature header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get the webhook secret from environment
    const webhookSecret = Deno.env.get("DATADOG_WEBHOOK_SECRET");

    if (!webhookSecret) {
      console.error("DATADOG_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Read the raw body for signature verification
    const rawBody = await req.text();

    // Verify the signature
    const isValid = await verifyDatadogSignature(
      rawBody,
      ddSignature,
      webhookSecret,
    );

    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Parse the verified payload
    const payload = JSON.parse(rawBody);

    console.log("Received valid Datadog webhook:", {
      alertType: payload.alert_type,
      title: payload.title,
      timestamp: payload.date,
    });

    // Initialize Supabase client for storing webhook data
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Store the webhook event (optional - requires a table to be created)
      // You can enable this by creating a `datadog_webhooks` table
      // await supabase.from("datadog_webhooks").insert({
      //   alert_type: payload.alert_type,
      //   title: payload.title,
      //   body: payload.body,
      //   raw_payload: payload,
      //   received_at: new Date().toISOString(),
      // });
    }

    // Process the webhook payload based on alert type
    // Add your custom logic here

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook received and verified",
        alert_type: payload.alert_type,
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
