# Serverless Function Specification Guide

This document provides a comprehensive template for specifying and implementing Supabase Edge Functions in the Asper Beauty Shop project.

## Table of Contents
1. [Function Naming](#function-naming)
2. [Function Specification Template](#function-specification-template)
3. [Authentication Models](#authentication-models)
4. [Request/Response Formats](#requestresponse-formats)
5. [Environment Variables](#environment-variables)
6. [Performance Considerations](#performance-considerations)
7. [Implementation Template](#implementation-template)
8. [Examples](#examples)

---

## Function Naming

### URL-Safe Naming Convention
- Use lowercase kebab-case (e.g., `process-webhook`, `beauty-assistant`, `bulk-product-upload`)
- Avoid special characters except hyphens
- Keep names descriptive but concise (2-4 words max)
- Function directory name = URL endpoint name

**Examples:**
- ✅ `beauty-assistant`
- ✅ `bulk-product-upload`
- ✅ `process-webhook`
- ✅ `order-notification`
- ❌ `beautyAssistant` (not kebab-case)
- ❌ `process_webhook` (use hyphens, not underscores)

---

## Function Specification Template

When proposing a new function, provide the following information:

### 1. Function Name
**URL-safe name:** `function-name`

### 2. Purpose & Functionality
**Description:** Brief description of what the function does

**Inputs:**
- Request method(s): GET, POST, PUT, DELETE
- Expected request body structure
- Query parameters (if any)
- Headers required

**Processing:**
- Validations performed
- Database operations (reads/writes)
- External API calls
- Business logic

**Outputs:**
- Success response format
- Error response format
- Status codes used

### 3. Routes
List all routes the function should handle:
- `GET /function-name/health` - Health check endpoint
- `POST /function-name/process` - Main processing endpoint
- etc.

### 4. Authentication Model
Choose one:
- **Public** - No authentication required (verify_jwt = false)
- **Authenticated** - Requires valid user JWT token
- **Service Role** - Requires service role key (admin-only operations)
- **Hybrid** - Public with optional authentication for enhanced features

### 5. Environment Variables
List all required and optional environment variables:

**Required:**
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key
- Custom variables...

**Optional:**
- `CUSTOM_API_KEY` - For external integrations
- etc.

### 6. Response Format
Define the JSON structure for success and error responses:

**Success Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

### 7. Performance Requirements
- **Timeout:** Default is 150 seconds, specify if longer needed
- **Background Work:** Use `EdgeRuntime.waitUntil()` for async tasks
- **Rate Limiting:** Define rate limit requirements
- **Caching:** Specify caching strategy if applicable

---

## Authentication Models

### 1. Public Function (No JWT Verification)
```typescript
// supabase/config.toml
[functions.my-function]
verify_jwt = false
```

Use for:
- Webhooks from external services
- Public APIs that don't require user context
- Health check endpoints

**Implementation:**
```typescript
serve(async (req) => {
  // No authentication check needed
  // Process request directly
});
```

### 2. Authenticated Function (User JWT Required)
```typescript
// supabase/config.toml
[functions.my-function]
verify_jwt = false  // We verify manually for better error handling
```

Use for:
- User-specific operations
- Personal data access
- User-initiated actions

**Implementation:**
```typescript
serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error } = await supabaseClient.auth.getUser();
  if (error || !user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Process authenticated request
});
```

### 3. Admin-Only Function (Service Role + Role Check)
Use for:
- Administrative operations
- Bulk data operations
- System maintenance tasks

**Implementation:**
```typescript
serve(async (req) => {
  // 1. Verify user JWT
  const authHeader = req.headers.get("Authorization");
  const supabaseAuth = createClient(/* ... */);
  const { data: { user }, error } = await supabaseAuth.auth.getUser();
  
  if (error || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 2. Check admin role using service role client
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: roleData } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleData?.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden: Admin required" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Process admin request
});
```

### 4. Hybrid Function (Optional Authentication)
Use for:
- Public features with premium authenticated features
- Analytics endpoints with optional user context

**Implementation:**
```typescript
serve(async (req) => {
  let userId: string | null = null;

  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const supabaseClient = createClient(/* ... */);
    const { data: { user } } = await supabaseClient.auth.getUser();
    userId = user?.id || null;
  }

  // Process with optional user context
  if (userId) {
    // Enhanced features for authenticated users
  } else {
    // Basic features for public access
  }
});
```

---

## Request/Response Formats

### Standard Request Structure
```typescript
// POST request with JSON body
{
  "action": "specific-action",  // For multi-action endpoints
  "data": {
    // Action-specific data
  },
  "options": {
    // Optional parameters
  }
}

// GET request with query parameters
// /function-name?param1=value1&param2=value2
```

### Standard Response Structure

**Success (200):**
```json
{
  "success": true,
  "data": {
    "result": "...",
    "metadata": {}
  },
  "message": "Operation completed successfully"
}
```

**Created (201):**
```json
{
  "success": true,
  "data": {
    "id": "created-resource-id",
    "url": "resource-url"
  }
}
```

**Error (4xx/5xx):**
```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

**Rate Limited (429):**
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60,
  "message": "Please wait 60 seconds before trying again"
}
```

---

## Environment Variables

### Required for All Functions
- `SUPABASE_URL` - Supabase project URL (auto-injected)
- `SUPABASE_ANON_KEY` - Public anon key (auto-injected)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations (auto-injected)

### Project-Specific Variables
Add these to Supabase Dashboard > Edge Functions > Secrets:

```bash
# AI/ML Services
LOVABLE_API_KEY=your_lovable_api_key

# E-commerce Integration
SHOPIFY_ACCESS_TOKEN=your_shopify_token
SHOPIFY_STORE_DOMAIN=lovable-project-milns.myshopify.com
SHOPIFY_API_VERSION=2025-01

# External APIs
EXTERNAL_API_KEY=your_api_key
EXTERNAL_API_URL=https://api.example.com

# Email/Notifications
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Setting Environment Variables

**Local Development:**
```bash
# Create .env file in function directory
echo "CUSTOM_VAR=value" > supabase/functions/my-function/.env
```

**Production:**
```bash
# Using Supabase CLI
supabase secrets set CUSTOM_VAR=value

# Or via Supabase Dashboard
# Project Settings > Edge Functions > Secrets
```

---

## Performance Considerations

### Timeouts
- **Default Timeout:** 150 seconds
- **Maximum Timeout:** 150 seconds (Supabase Edge Functions limit)
- **Long-running tasks:** Use background processing with `EdgeRuntime.waitUntil()`

### Background Processing
```typescript
serve(async (req) => {
  // Immediate response
  const responseData = { status: "processing" };

  // Background work (doesn't block response)
  EdgeRuntime.waitUntil(
    (async () => {
      // Long-running task
      await processLongTask();
    })()
  );

  return new Response(JSON.stringify(responseData), {
    headers: { "Content-Type": "application/json" }
  });
});
```

### Rate Limiting
Implement rate limiting for expensive operations:

```typescript
// Check rate limit from database or cache
const { data: rateLimitData } = await supabase
  .from("rate_limits")
  .select("*")
  .eq("user_id", userId)
  .eq("endpoint", "function-name")
  .single();

const now = Date.now();
const window = 60 * 1000; // 1 minute

if (rateLimitData && now - rateLimitData.timestamp < window) {
  if (rateLimitData.count >= 10) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded", retryAfter: 60 }),
      { status: 429, headers: corsHeaders }
    );
  }
}
```

### Caching
Use Supabase Storage or external cache for frequently accessed data:

```typescript
// Check cache first
const cacheKey = `cache:${userId}:${resourceId}`;
const { data: cachedData } = await supabase
  .from("cache")
  .select("data")
  .eq("key", cacheKey)
  .single();

if (cachedData && isValid(cachedData)) {
  return new Response(JSON.stringify(cachedData.data), {
    headers: { ...corsHeaders, "X-Cache": "HIT" }
  });
}

// Fetch and cache
const data = await fetchExpensiveData();
await supabase.from("cache").upsert({
  key: cacheKey,
  data,
  expires_at: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
});
```

---

## Implementation Template

### Basic Function Template
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Authentication (if required)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // 3. Verify user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Parse request
    const requestData = await req.json();
    
    // 5. Validate input
    if (!requestData.someRequiredField) {
      return new Response(
        JSON.stringify({ error: "Missing required field: someRequiredField" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 6. Process request
    const result = await processRequest(requestData, user.id);

    // 7. Return success response
    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function processRequest(data: any, userId: string) {
  // Your business logic here
  return { processed: true };
}
```

### Configuration Template
```toml
# supabase/config.toml

[functions.function-name]
verify_jwt = false  # Set to true for automatic JWT verification
```

---

## Examples

### Example 1: Webhook Handler (Public)

**Specification:**

**Function Name:** `shopify-webhook`

**Purpose:** Handle incoming webhooks from Shopify (order creation, product updates, etc.)

**Inputs:**
- POST request from Shopify with JSON body
- Headers: `X-Shopify-Hmac-SHA256` for verification

**Processing:**
- Verify webhook signature
- Parse webhook data
- Update database based on webhook type
- Trigger notifications if needed

**Outputs:**
- 200 OK for successful processing
- 401 if signature verification fails
- 500 for processing errors

**Routes:**
- `POST /shopify-webhook` - Main webhook endpoint

**Auth Model:** Public (webhook signature verification)

**Environment Variables:**
- `SHOPIFY_WEBHOOK_SECRET` - Secret for verifying webhook signatures

**Response Format:**
```json
{ "success": true, "message": "Webhook processed" }
```

**Performance:**
- Timeout: 30 seconds (webhook handlers should respond quickly)
- Background processing for long-running tasks

---

### Example 2: Order Notification (Authenticated)

**Specification:**

**Function Name:** `send-order-notification`

**Purpose:** Send order confirmation notifications via email/SMS

**Inputs:**
- POST request with order ID
- Requires authenticated user

**Processing:**
- Verify user owns the order
- Fetch order details from database
- Send email via SendGrid
- Send SMS via Twilio (optional)
- Log notification in database

**Outputs:**
- 200 with notification status
- 404 if order not found
- 403 if user doesn't own order

**Routes:**
- `POST /send-order-notification` - Send notification

**Auth Model:** Authenticated (user must be logged in)

**Environment Variables:**
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`

**Response Format:**
```json
{
  "success": true,
  "data": {
    "emailSent": true,
    "smsSent": true,
    "notificationId": "notif_123"
  }
}
```

**Performance:**
- Timeout: 60 seconds
- Retry logic for failed notifications

---

### Example 3: Admin Report Generator (Service Role)

**Specification:**

**Function Name:** `generate-sales-report`

**Purpose:** Generate comprehensive sales reports for admin users

**Inputs:**
- POST request with date range and report type
- Requires admin authentication

**Processing:**
- Verify user is admin
- Query sales data from database
- Aggregate statistics
- Generate PDF report
- Upload to Supabase Storage
- Return download URL

**Outputs:**
- 200 with report URL
- 403 if user is not admin
- 400 for invalid date range

**Routes:**
- `POST /generate-sales-report` - Generate report

**Auth Model:** Service Role (admin only)

**Environment Variables:**
- `SUPABASE_SERVICE_ROLE_KEY`

**Response Format:**
```json
{
  "success": true,
  "data": {
    "reportUrl": "https://storage.supabase.co/...",
    "reportId": "report_123",
    "generatedAt": "2026-02-17T21:00:00Z"
  }
}
```

**Performance:**
- Timeout: 120 seconds
- Background processing for large reports
- Caching for frequently requested date ranges

---

## Best Practices

1. **Always handle CORS** - Include CORS headers in all responses
2. **Validate input** - Never trust client data
3. **Use environment variables** - Never hardcode secrets
4. **Log appropriately** - Use console.log for debugging, but don't log sensitive data
5. **Handle errors gracefully** - Return meaningful error messages
6. **Set appropriate timeouts** - Don't block user requests
7. **Use background processing** - For long-running tasks
8. **Implement rate limiting** - For expensive operations
9. **Test thoroughly** - Test all error paths
10. **Document your function** - Update this guide with your function specs

---

## Testing Functions

### Local Testing
```bash
# Start Supabase locally
supabase start

# Serve function locally
supabase functions serve function-name --env-file ./supabase/.env.local

# Test with curl
curl -X POST http://localhost:54321/functions/v1/function-name \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Deployment
```bash
# Deploy to Supabase
supabase functions deploy function-name

# View logs
supabase functions logs function-name
```

---

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check Authorization header format
   - Verify token is valid
   - Check verify_jwt setting in config.toml

2. **CORS Errors**
   - Ensure corsHeaders are included in all responses
   - Handle OPTIONS preflight requests

3. **Timeout Errors**
   - Check function execution time
   - Use background processing for long tasks
   - Optimize database queries

4. **Rate Limiting**
   - Implement exponential backoff
   - Add retry logic with delays

5. **Environment Variables Not Found**
   - Verify secrets are set in Supabase Dashboard
   - Check .env.local file for local development

---

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Standard Library](https://deno.land/std)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- Project Custom Instructions (see root README.md)
