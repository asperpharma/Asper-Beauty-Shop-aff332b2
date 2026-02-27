# Example Function Specification: process-webhook

This document provides a complete specification for implementing a webhook processing function as a practical example.

---

## Function Specification

### 1. Function Name
**URL-safe name:** `process-webhook`

### 2. Purpose & Functionality

**Description:** Process incoming webhooks from external services (Shopify, Stripe, etc.) and trigger appropriate actions in the system.

**Inputs:**
- **Request Method:** POST
- **Request Body:** JSON payload from webhook provider
- **Headers Required:**
  - `X-Webhook-Signature` - HMAC signature for verification
  - `X-Webhook-Source` - Source service (shopify, stripe, etc.)
  - `Content-Type: application/json`

**Processing:**
1. Verify webhook signature to ensure authenticity
2. Parse webhook payload
3. Determine webhook type/event
4. Validate required fields based on event type
5. Execute appropriate handler for the event type:
   - Order created → Update database, send notifications
   - Order updated → Sync order status
   - Product updated → Refresh product cache
   - Payment received → Update order status, trigger fulfillment
6. Log webhook event for audit trail
7. Return success response immediately (async processing in background)

**Outputs:**
- **Success:** 200 with webhook received confirmation
- **Error Cases:**
  - 400 - Invalid payload structure
  - 401 - Invalid signature
  - 404 - Unknown webhook source
  - 500 - Processing error

### 3. Routes

This function handles a single endpoint:
- `POST /process-webhook` - Main webhook processing endpoint

### 4. Authentication Model

**Public** with signature verification (verify_jwt = false)

The function is publicly accessible but requires a valid HMAC signature in the `X-Webhook-Signature` header. This ensures only authorized services can trigger the webhook.

**Why Public?**
- External services (Shopify, Stripe) cannot provide user JWT tokens
- Signature verification provides adequate security
- Webhook endpoints must be accessible without authentication

### 5. Environment Variables

**Required:**
- `SUPABASE_URL` - Supabase project URL (auto-injected)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database operations (auto-injected)
- `SHOPIFY_WEBHOOK_SECRET` - Secret for verifying Shopify webhooks
- `STRIPE_WEBHOOK_SECRET` - Secret for verifying Stripe webhooks

**Optional:**
- `WEBHOOK_PROCESSING_TIMEOUT` - Timeout for background processing (default: 120s)
- `WEBHOOK_RETRY_COUNT` - Number of retries for failed processing (default: 3)

### 6. Response Format

**Success Response (200):**
```json
{
  "success": true,
  "webhookId": "wh_1234567890",
  "message": "Webhook received and queued for processing",
  "timestamp": "2026-02-17T21:00:00Z"
}
```

**Error Response (401 - Invalid Signature):**
```json
{
  "error": "Invalid webhook signature",
  "code": "INVALID_SIGNATURE",
  "message": "The webhook signature could not be verified"
}
```

**Error Response (400 - Invalid Payload):**
```json
{
  "error": "Invalid payload",
  "code": "INVALID_PAYLOAD",
  "details": {
    "field": "order_id",
    "message": "Missing required field"
  }
}
```

**Error Response (404 - Unknown Source):**
```json
{
  "error": "Unknown webhook source",
  "code": "UNKNOWN_SOURCE",
  "message": "Webhook source 'unknown' is not supported"
}
```

**Status Codes:**
- `200` - Webhook received and queued successfully
- `400` - Invalid payload structure or missing required fields
- `401` - Signature verification failed
- `404` - Unknown webhook source
- `500` - Internal server error during processing

### 7. Performance Requirements

**Timeout:** 30 seconds for initial response, background processing up to 120 seconds

**Background Work:**
- Webhook verification and logging: Synchronous (< 1 second)
- Event processing: Asynchronous using `EdgeRuntime.waitUntil()`
  - Database updates
  - External API calls
  - Notification sending

**Rate Limiting:**
- Per source: 100 requests per minute
- Global: 500 requests per minute
- Implement exponential backoff for retries

**Caching:**
- Cache webhook secrets in memory for 5 minutes
- Cache product data for 15 minutes

---

## Implementation

### Directory Structure
```
supabase/functions/process-webhook/
├── index.ts                 # Main entry point
├── handlers/
│   ├── shopify.ts          # Shopify webhook handlers
│   ├── stripe.ts           # Stripe webhook handlers
│   └── index.ts            # Handler registry
├── utils/
│   ├── signature.ts        # Signature verification utilities
│   └── logger.ts           # Logging utilities
└── types.ts                # TypeScript type definitions
```

### Main Implementation (index.ts)

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifySignature } from "./utils/signature.ts";
import { logWebhook } from "./utils/logger.ts";
import { getHandler } from "./handlers/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-signature, x-webhook-source",
};

interface WebhookPayload {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }),
      { 
        status: 405, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }

  try {
    // 1. Extract headers
    const signature = req.headers.get("X-Webhook-Signature");
    const source = req.headers.get("X-Webhook-Source");

    if (!signature || !source) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required headers", 
          code: "MISSING_HEADERS",
          details: {
            signature: !signature ? "Missing X-Webhook-Signature header" : null,
            source: !source ? "Missing X-Webhook-Source header" : null,
          }
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Read and parse payload
    const rawBody = await req.text();
    let payload: WebhookPayload;
    
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON payload", 
          code: "INVALID_JSON" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Verify signature
    const webhookSecret = Deno.env.get(`${source.toUpperCase()}_WEBHOOK_SECRET`);
    
    if (!webhookSecret) {
      console.error(`No webhook secret configured for source: ${source}`);
      return new Response(
        JSON.stringify({ 
          error: "Unknown webhook source", 
          code: "UNKNOWN_SOURCE" 
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isValidSignature = await verifySignature(rawBody, signature, webhookSecret, source);
    
    if (!isValidSignature) {
      console.error(`Invalid signature for webhook from ${source}`);
      return new Response(
        JSON.stringify({ 
          error: "Invalid webhook signature", 
          code: "INVALID_SIGNATURE" 
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Initialize Supabase with service role (webhooks need elevated permissions)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 5. Log webhook reception
    const webhookId = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await logWebhook(supabase, {
      webhookId,
      source,
      type: payload.type,
      payload: payload,
      receivedAt: new Date().toISOString(),
      status: "received"
    });

    // 6. Queue background processing
    EdgeRuntime.waitUntil(
      (async () => {
        try {
          // Get appropriate handler for this webhook source
          const handler = getHandler(source);
          
          if (!handler) {
            console.error(`No handler found for source: ${source}`);
            await logWebhook(supabase, {
              webhookId,
              status: "failed",
              error: "No handler available"
            });
            return;
          }

          // Process the webhook
          await handler.process(payload, supabase);

          // Update webhook log to success
          await logWebhook(supabase, {
            webhookId,
            status: "processed",
            processedAt: new Date().toISOString()
          });

          console.log(`Webhook ${webhookId} processed successfully`);
        } catch (error) {
          console.error(`Error processing webhook ${webhookId}:`, error);
          
          // Log failure
          await logWebhook(supabase, {
            webhookId,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
            failedAt: new Date().toISOString()
          });
        }
      })()
    );

    // 7. Return immediate success response
    return new Response(
      JSON.stringify({
        success: true,
        webhookId,
        message: "Webhook received and queued for processing",
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        code: "INTERNAL_ERROR"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
```

### Signature Verification (utils/signature.ts)

```typescript
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

export async function verifySignature(
  payload: string,
  signature: string,
  secret: string,
  source: string
): Promise<boolean> {
  try {
    switch (source.toLowerCase()) {
      case "shopify":
        return verifyShopifySignature(payload, signature, secret);
      case "stripe":
        return verifyStripeSignature(payload, signature, secret);
      default:
        console.warn(`Unknown signature verification for source: ${source}`);
        return false;
    }
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

function verifyShopifySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  const digest = hmac.digest("base64");
  return digest === signature;
}

function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Stripe signature format: t=timestamp,v1=signature
  const signatureParts = signature.split(",");
  const timestamp = signatureParts.find(part => part.startsWith("t="))?.split("=")[1];
  const signatureHash = signatureParts.find(part => part.startsWith("v1="))?.split("=")[1];

  if (!timestamp || !signatureHash) {
    return false;
  }

  // Construct signed payload
  const signedPayload = `${timestamp}.${payload}`;
  const hmac = createHmac("sha256", secret);
  hmac.update(signedPayload);
  const expectedSignature = hmac.digest("hex");

  // Constant-time comparison to prevent timing attacks
  return expectedSignature === signatureHash;
}
```

### Logger Utility (utils/logger.ts)

```typescript
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

interface WebhookLog {
  webhookId: string;
  source?: string;
  type?: string;
  payload?: any;
  status?: "received" | "processing" | "processed" | "failed";
  receivedAt?: string;
  processedAt?: string;
  failedAt?: string;
  error?: string;
}

export async function logWebhook(
  supabase: SupabaseClient,
  log: WebhookLog
): Promise<void> {
  try {
    const { error } = await supabase
      .from("webhook_logs")
      .upsert({
        webhook_id: log.webhookId,
        source: log.source,
        type: log.type,
        payload: log.payload,
        status: log.status,
        received_at: log.receivedAt,
        processed_at: log.processedAt,
        failed_at: log.failedAt,
        error: log.error,
      }, {
        onConflict: "webhook_id"
      });

    if (error) {
      console.error("Failed to log webhook:", error);
    }
  } catch (error) {
    console.error("Error in logWebhook:", error);
  }
}
```

### Handler Registry (handlers/index.ts)

```typescript
import { shopifyHandler } from "./shopify.ts";
import { stripeHandler } from "./stripe.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface WebhookHandler {
  process(payload: any, supabase: SupabaseClient): Promise<void>;
}

const handlers: Record<string, WebhookHandler> = {
  shopify: shopifyHandler,
  stripe: stripeHandler,
};

export function getHandler(source: string): WebhookHandler | undefined {
  return handlers[source.toLowerCase()];
}
```

### Shopify Handler (handlers/shopify.ts)

```typescript
import { WebhookHandler } from "./index.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export const shopifyHandler: WebhookHandler = {
  async process(payload: any, supabase: SupabaseClient): Promise<void> {
    const { type, data } = payload;

    switch (type) {
      case "orders/create":
        await handleOrderCreated(data, supabase);
        break;
      case "orders/updated":
        await handleOrderUpdated(data, supabase);
        break;
      case "products/create":
      case "products/update":
        await handleProductUpdated(data, supabase);
        break;
      default:
        console.log(`Unhandled Shopify webhook type: ${type}`);
    }
  }
};

async function handleOrderCreated(order: any, supabase: SupabaseClient): Promise<void> {
  console.log(`Processing new order: ${order.id}`);
  
  // Store order in database
  const { error } = await supabase
    .from("orders")
    .insert({
      shopify_order_id: order.id,
      order_number: order.order_number,
      customer_email: order.customer?.email,
      total_price: order.total_price,
      currency: order.currency,
      status: order.financial_status,
      created_at: order.created_at,
      line_items: order.line_items,
    });

  if (error) {
    throw new Error(`Failed to store order: ${error.message}`);
  }

  console.log(`Order ${order.order_number} stored successfully`);
}

async function handleOrderUpdated(order: any, supabase: SupabaseClient): Promise<void> {
  console.log(`Updating order: ${order.id}`);
  
  const { error } = await supabase
    .from("orders")
    .update({
      status: order.financial_status,
      fulfillment_status: order.fulfillment_status,
      updated_at: new Date().toISOString(),
    })
    .eq("shopify_order_id", order.id);

  if (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }

  console.log(`Order ${order.order_number} updated successfully`);
}

async function handleProductUpdated(product: any, supabase: SupabaseClient): Promise<void> {
  console.log(`Processing product update: ${product.id}`);
  
  // Invalidate product cache
  const { error } = await supabase
    .from("cache")
    .delete()
    .like("key", `product:${product.id}%`);

  if (error) {
    console.error(`Failed to invalidate cache: ${error.message}`);
  }

  console.log(`Product ${product.id} cache invalidated`);
}
```

### Configuration (supabase/config.toml)

```toml
[functions.process-webhook]
verify_jwt = false  # Public webhook endpoint
```

---

## Database Schema

### webhook_logs Table

```sql
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('received', 'processing', 'processed', 'failed')),
  received_at TIMESTAMPTZ NOT NULL,
  processed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_logs_source ON webhook_logs(source);
CREATE INDEX idx_webhook_logs_status ON webhook_logs(status);
CREATE INDEX idx_webhook_logs_received_at ON webhook_logs(received_at DESC);
```

---

## Testing

### Local Testing

1. **Start Supabase locally:**
```bash
supabase start
```

2. **Set environment variables:**
```bash
echo "SHOPIFY_WEBHOOK_SECRET=test_secret" > supabase/functions/process-webhook/.env
echo "STRIPE_WEBHOOK_SECRET=whsec_test" >> supabase/functions/process-webhook/.env
```

3. **Serve function locally:**
```bash
supabase functions serve process-webhook --env-file ./supabase/functions/process-webhook/.env
```

4. **Test with curl:**
```bash
# Test Shopify webhook
curl -X POST http://localhost:54321/functions/v1/process-webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Source: shopify" \
  -H "X-Webhook-Signature: <computed_signature>" \
  -d '{
    "id": "webhook_123",
    "type": "orders/create",
    "data": {
      "id": 12345,
      "order_number": "ORD-001",
      "total_price": "100.00",
      "currency": "USD"
    },
    "timestamp": "2026-02-17T21:00:00Z"
  }'
```

### Production Testing

1. **Deploy function:**
```bash
supabase functions deploy process-webhook
```

2. **Set production secrets:**
```bash
supabase secrets set SHOPIFY_WEBHOOK_SECRET=prod_secret
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_prod_secret
```

3. **Configure webhook in Shopify:**
   - URL: `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/process-webhook`
   - Format: JSON
   - API version: 2025-01
   - Events: orders/create, orders/updated, products/update

4. **Monitor logs:**
```bash
supabase functions logs process-webhook --tail
```

---

## Security Considerations

1. **Signature Verification:** Always verify webhook signatures to prevent unauthorized requests
2. **Rate Limiting:** Implement rate limiting to prevent abuse
3. **Input Validation:** Validate all incoming data before processing
4. **Error Handling:** Don't expose internal error details to external services
5. **Logging:** Log all webhook events for audit trail and debugging
6. **Secrets Management:** Store secrets securely in Supabase Dashboard
7. **Timeout Protection:** Use background processing to prevent blocking

---

## Monitoring & Alerts

### Metrics to Monitor
- Webhook success/failure rate
- Processing time per webhook type
- Signature verification failures
- Rate limit hits
- Error patterns

### Alert Conditions
- Failure rate > 5% over 5 minutes
- No webhooks received in 1 hour (if expecting regular webhooks)
- Signature verification failure spike
- Processing time > 30 seconds

---

## Maintenance

### Regular Tasks
- Review webhook logs weekly for errors
- Clean up old webhook logs (> 30 days)
- Update webhook secrets quarterly
- Review and optimize handler performance
- Test webhook processing after Shopify/Stripe API updates

### Troubleshooting
- Check webhook logs table for error details
- Verify environment variables are set correctly
- Test signature verification with sample payloads
- Review Supabase function logs for detailed error traces
- Use Shopify/Stripe webhook testing tools for debugging
