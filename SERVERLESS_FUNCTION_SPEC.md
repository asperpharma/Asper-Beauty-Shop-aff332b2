# Serverless Function Specification Template

This document provides a comprehensive template for creating new Supabase Edge Functions in the Asper Beauty Shop project.

---

## Overview

When proposing a new serverless function, provide the following information:

## 1. Function Name (URL-Safe)

**Format**: `lowercase-with-hyphens`

**Example**: `process-webhook`, `beauty-assistant`, `bulk-product-upload`

**Requirements**:
- Use lowercase letters
- Separate words with hyphens
- No spaces or special characters
- Should be descriptive of the function's purpose
- Must be URL-safe

---

## 2. Function Purpose & Logic

### Description
Brief description of what the function does and why it's needed.

### Inputs
List all expected input parameters:

```typescript
interface FunctionInput {
  // Define input structure
  param1: string;
  param2?: number; // optional
  // ... more parameters
}
```

### Validations
- List all input validations required
- Specify validation rules for each parameter
- Define error messages for validation failures

### Database Operations
- **Reads**: What tables/data need to be read?
- **Writes**: What tables/data need to be written?
- **RLS Requirements**: What Row-Level Security policies apply?

### External API Calls
- List any external APIs that will be called
- Specify API endpoints, methods, and authentication requirements
- Document rate limits and retry strategies

### Business Logic
- Describe the core processing logic
- Document any calculations, transformations, or decision trees
- Specify error handling and edge cases

---

## 3. Routes & HTTP Methods

Define all HTTP endpoints and methods:

```
GET  /function-name/health        # Health check endpoint
POST /function-name/process       # Main processing endpoint
GET  /function-name/status/:id    # Status check endpoint
PUT  /function-name/update/:id    # Update endpoint
```

### Endpoint Details

#### Route: `POST /function-name/process`
- **Purpose**: Main processing endpoint
- **Request Body**: JSON with required fields
- **Content-Type**: `application/json`

---

## 4. Authentication & Authorization

Specify the security model for the function:

### Authentication Options:

1. **Public (No Auth)**
   - `verify_jwt = false` in `config.toml`
   - No authentication required
   - Use for: webhooks, public APIs, health checks

2. **Authenticated Users Only**
   - `verify_jwt = true` (default)
   - Requires valid Supabase auth token in `Authorization: Bearer <token>` header
   - Validates user session
   - Use for: user-specific operations

3. **Service Role Required**
   - Requires Supabase service role key
   - For internal/admin operations only
   - Use for: admin dashboards, system operations

4. **Role-Based Access Control (RBAC)**
   - Authenticated + check user role in `user_roles` table
   - Roles: `admin`, `user`, `moderator`, etc.
   - Use for: admin functions, privileged operations

### Example: Admin-Only Function

```typescript
// 1. Verify authentication
const { data: { user }, error } = await supabaseAuth.auth.getUser();
if (error || !user) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// 2. Check admin role
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const { data: roleData } = await supabaseAdmin
  .from("user_roles")
  .select("role")
  .eq("user_id", user.id)
  .single();

if (roleData?.role !== "admin") {
  return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
    status: 403,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

---

## 5. Environment Variables & Secrets

List all environment variables the function requires:

### Required Variables:

| Variable Name              | Type     | Purpose                          | Where to Set          |
| -------------------------- | -------- | -------------------------------- | --------------------- |
| `SUPABASE_URL`             | Built-in | Supabase project URL             | Auto-provided         |
| `SUPABASE_ANON_KEY`        | Built-in | Public anon key                  | Auto-provided         |
| `SUPABASE_SERVICE_ROLE_KEY`| Secret   | Admin service role key           | Supabase Dashboard    |
| `LOVABLE_API_KEY`          | Secret   | Lovable AI Gateway key           | Supabase Dashboard    |
| `SHOPIFY_ACCESS_TOKEN`     | Secret   | Shopify Admin API token          | Supabase Dashboard    |
| `CUSTOM_API_KEY`           | Secret   | Custom third-party API key       | Supabase Dashboard    |

### Setting Secrets:

```bash
# Set via Supabase CLI
supabase secrets set CUSTOM_API_KEY=your_key_here

# Or via Supabase Dashboard:
# Project Settings > Edge Functions > Manage secrets
```

---

## 6. Response Format

Define the expected response structure for all status codes:

### Success Response (200)

```json
{
  "success": true,
  "data": {
    // Response data structure
  },
  "message": "Operation completed successfully"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Invalid input parameters",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

#### 401 Unauthorized
```json
{
  "error": "Unauthorized: Missing or invalid token"
}
```

#### 403 Forbidden
```json
{
  "error": "Forbidden: Admin access required"
}
```

#### 404 Not Found
```json
{
  "error": "Resource not found",
  "resourceId": "123"
}
```

#### 429 Rate Limited
```json
{
  "error": "Rate limited. Please wait before retrying.",
  "retryAfter": 60
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

### Status Codes

| Code | Meaning                    | Use Case                             |
| ---- | -------------------------- | ------------------------------------ |
| 200  | OK                         | Successful request                   |
| 201  | Created                    | Resource created successfully        |
| 400  | Bad Request                | Invalid input                        |
| 401  | Unauthorized               | Missing/invalid authentication       |
| 403  | Forbidden                  | Insufficient permissions             |
| 404  | Not Found                  | Resource doesn't exist               |
| 429  | Too Many Requests          | Rate limit exceeded                  |
| 500  | Internal Server Error      | Unexpected error                     |
| 502  | Bad Gateway                | External service error               |
| 503  | Service Unavailable        | Temporary outage                     |

---

## 7. Performance Considerations

### Timeouts

Supabase Edge Functions have built-in timeouts:
- Default timeout: **60 seconds**
- Maximum timeout: **150 seconds** (configurable)

For long-running operations:
- Use background processing
- Implement job queuing
- Return early with status tracking endpoint

### Background Work (EdgeRuntime.waitUntil)

For operations that don't need to block the response:

```typescript
serve(async (req) => {
  // Process request
  const result = await quickOperation();
  
  // Schedule background work
  // Note: Deno Deploy doesn't support waitUntil yet
  // Use alternative: job queue, webhook callback, or separate function
  
  // Return response immediately
  return new Response(JSON.stringify({ success: true, jobId: result.id }), {
    headers: { "Content-Type": "application/json" }
  });
});
```

### Rate Limiting

Implement rate limiting for:
- External API calls (respect their limits)
- Database operations (avoid overwhelming DB)
- AI/ML operations (expensive operations)

**Example**: Shopify Admin API has 40 requests/second limit

### Optimization Strategies

1. **Batch Operations**: Group multiple operations when possible
2. **Caching**: Cache frequently accessed data
3. **Parallel Processing**: Use `Promise.all()` for independent operations
4. **Lazy Loading**: Only fetch data when needed
5. **Connection Pooling**: Reuse database connections
6. **Streaming**: Use streaming for large responses

---

## 8. CORS Configuration

Always include CORS headers for web client access:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Or specific domain
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

// Handle preflight
if (req.method === "OPTIONS") {
  return new Response(null, { headers: corsHeaders });
}
```

---

## 9. Error Handling Best Practices

```typescript
serve(async (req) => {
  try {
    // Function logic here
    
  } catch (error) {
    console.error("Function error:", error);
    
    // Log error details for debugging
    console.error("Error stack:", error instanceof Error ? error.stack : "N/A");
    
    // Return user-friendly error
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
```

---

## 10. Testing Checklist

Before deploying a function, test:

- [ ] Authentication works correctly
- [ ] Authorization checks are enforced
- [ ] Input validation catches invalid data
- [ ] Success responses have correct format
- [ ] Error responses have correct status codes
- [ ] CORS headers allow web client access
- [ ] External API calls handle failures gracefully
- [ ] Database operations respect RLS policies
- [ ] Rate limiting is implemented where needed
- [ ] Function completes within timeout limits
- [ ] Environment variables are properly set
- [ ] Function is added to `supabase/config.toml`

---

## Example Function Specifications

### Example 1: Beauty Assistant (Existing)

**Function Name**: `beauty-assistant`

**Purpose**: AI-powered beauty consultation chatbot using Gemini 2.5 Flash

**Inputs**:
```typescript
{
  messages: Array<{ role: string, content: string }>
}
```

**Routes**:
- `POST /beauty-assistant` - Main chat endpoint

**Auth**: Authenticated users only (verify_jwt = false but manual validation)

**Environment Variables**:
- `LOVABLE_API_KEY` - Lovable AI Gateway access
- `SUPABASE_URL` - Auto-provided
- `SUPABASE_ANON_KEY` - Auto-provided

**Response**: Server-Sent Events stream (text/event-stream)

**Performance**: Streaming response, ~2-5 seconds for first token

---

### Example 2: Bulk Product Upload (Existing)

**Function Name**: `bulk-product-upload`

**Purpose**: Admin tool for bulk importing products to Shopify with AI-generated images

**Inputs**:
```typescript
{
  action: "categorize" | "generate-image" | "create-shopify-product" | "ai-categorize",
  products?: Array<ProductData>,
  productName?: string,
  category?: string,
  imagePrompt?: string,
  product?: ShopifyProduct
}
```

**Routes**:
- `POST /bulk-product-upload` - All actions via single endpoint

**Auth**: Admin only (RBAC with user_roles table)

**Environment Variables**:
- `LOVABLE_API_KEY` - AI image generation
- `SHOPIFY_ACCESS_TOKEN` - Shopify Admin API
- `SUPABASE_SERVICE_ROLE_KEY` - Admin DB access

**Response**: JSON with success/error and relevant data

**Performance**: Image generation ~10-30s, product creation ~1-2s

---

## Deployment

### 1. Create Function

```bash
# Create function directory
mkdir supabase/functions/my-function

# Create index.ts
touch supabase/functions/my-function/index.ts
```

### 2. Add to config.toml

```toml
[functions.my-function]
verify_jwt = false  # or true for auth required
```

### 3. Deploy

```bash
# Deploy single function
supabase functions deploy my-function

# Deploy all functions
supabase functions deploy
```

### 4. Test

```bash
# Local test
supabase functions serve my-function

# Remote test
curl -X POST https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/my-function \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

---

## Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)
- [Project Custom Instructions](.github/copilot-instructions.md)
- [Security Guidelines](SECURITY.md)

---

## Questions to Answer Before Implementation

1. **What problem does this function solve?**
2. **Who will call this function?** (Web app, admin, webhook, scheduled job)
3. **What data does it need access to?**
4. **What external services does it depend on?**
5. **What happens if it fails?** (Retry logic, fallback behavior)
6. **How will you monitor it?** (Logging, alerts, metrics)
7. **What are the security implications?** (Data access, permissions)
8. **What is the expected load?** (Requests per second, concurrent users)

---

*Last Updated: 2026-02-17*
