# Serverless Function Quick Reference

Quick reference guide for creating Supabase Edge Functions in the Asper Beauty Shop project.

---

## 🚀 Quick Start Checklist

When creating a new function:

- [ ] Choose URL-safe kebab-case name (e.g., `my-function`)
- [ ] Create function directory: `supabase/functions/my-function/`
- [ ] Create `index.ts` with function implementation
- [ ] Add configuration to `supabase/config.toml`
- [ ] Set environment variables (if needed)
- [ ] Test locally with `supabase functions serve`
- [ ] Deploy with `supabase functions deploy my-function`
- [ ] Update this documentation

---

## 📋 Function Specification Template (Copy & Fill)

```markdown
## Function Specification: [function-name]

### 1. Function Name
**URL-safe name:** `function-name`

### 2. Purpose
[Brief description of what the function does]

### 3. Inputs
- **Method:** GET | POST | PUT | DELETE
- **Body:** [JSON structure]
- **Headers:** [Required headers]
- **Query Params:** [If any]

### 4. Processing
1. [Step 1]
2. [Step 2]
3. [Step 3]

### 5. Outputs
- **Success (200):** [Response structure]
- **Error (4xx/5xx):** [Error response structure]

### 6. Routes
- `POST /function-name` - [Description]

### 7. Authentication
- [ ] Public (no auth)
- [ ] Authenticated (user JWT)
- [ ] Service Role (admin only)
- [ ] Hybrid (optional auth)

### 8. Environment Variables
**Required:**
- `VAR_NAME` - Description

**Optional:**
- `VAR_NAME` - Description

### 9. Performance
- **Timeout:** [seconds]
- **Background Work:** Yes/No
- **Rate Limit:** [requests per minute]
```

---

## 🔐 Authentication Patterns

### Pattern 1: Public (No Auth)
```typescript
// supabase/config.toml
[functions.my-function]
verify_jwt = false

// No auth check in code
serve(async (req) => {
  // Process directly
});
```

### Pattern 2: Authenticated User
```typescript
const authHeader = req.headers.get("Authorization");
if (!authHeader?.startsWith("Bearer ")) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
  { global: { headers: { Authorization: authHeader } } }
);

const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
  return new Response(JSON.stringify({ error: "Invalid token" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

// Use user.id for user-specific operations
```

### Pattern 3: Admin Only
```typescript
// After authenticating user (Pattern 2)...

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
  return new Response(JSON.stringify({ error: "Forbidden" }), {
    status: 403,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
```

---

## 📦 Standard Response Formats

### Success Response
```typescript
return new Response(
  JSON.stringify({
    success: true,
    data: { /* your data */ },
    message: "Optional message"
  }),
  { 
    status: 200, 
    headers: { ...corsHeaders, "Content-Type": "application/json" } 
  }
);
```

### Error Response
```typescript
return new Response(
  JSON.stringify({
    error: "Human-readable error message",
    code: "ERROR_CODE",
    details: { /* optional details */ }
  }),
  { 
    status: 400, // or 401, 403, 404, 500
    headers: { ...corsHeaders, "Content-Type": "application/json" } 
  }
);
```

### Rate Limited Response
```typescript
return new Response(
  JSON.stringify({
    error: "Rate limit exceeded",
    retryAfter: 60
  }),
  { 
    status: 429, 
    headers: { ...corsHeaders, "Content-Type": "application/json" } 
  }
);
```

---

## ⚡ Performance Patterns

### Background Processing
```typescript
serve(async (req) => {
  // Immediate response
  const responseData = { status: "processing", id: "123" };

  // Background work
  EdgeRuntime.waitUntil(
    (async () => {
      await longRunningTask();
    })()
  );

  return new Response(JSON.stringify(responseData), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});
```

### Rate Limiting
```typescript
const rateLimit = await checkRateLimit(userId, "endpoint-name");
if (rateLimit.exceeded) {
  return new Response(
    JSON.stringify({ 
      error: "Rate limit exceeded", 
      retryAfter: rateLimit.resetIn 
    }),
    { status: 429, headers: corsHeaders }
  );
}
```

### Caching
```typescript
// Check cache
const cached = await getFromCache(cacheKey);
if (cached) {
  return new Response(JSON.stringify(cached), {
    headers: { ...corsHeaders, "X-Cache": "HIT" }
  });
}

// Compute and cache
const data = await computeExpensiveData();
await setCache(cacheKey, data, 300); // 5 minutes

return new Response(JSON.stringify(data), {
  headers: { ...corsHeaders, "X-Cache": "MISS" }
});
```

---

## 🛠️ Common Code Snippets

### CORS Headers
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle OPTIONS
if (req.method === "OPTIONS") {
  return new Response(null, { headers: corsHeaders });
}
```

### Method Validation
```typescript
if (req.method !== "POST") {
  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { status: 405, headers: corsHeaders }
  );
}
```

### JSON Parsing with Error Handling
```typescript
let requestData;
try {
  requestData = await req.json();
} catch (error) {
  return new Response(
    JSON.stringify({ error: "Invalid JSON" }),
    { status: 400, headers: corsHeaders }
  );
}
```

### Input Validation
```typescript
if (!requestData.requiredField) {
  return new Response(
    JSON.stringify({ 
      error: "Missing required field: requiredField",
      code: "VALIDATION_ERROR" 
    }),
    { status: 400, headers: corsHeaders }
  );
}
```

### Error Wrapper
```typescript
try {
  // Your logic here
} catch (error) {
  console.error("Function error:", error);
  return new Response(
    JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error"
    }),
    { status: 500, headers: corsHeaders }
  );
}
```

---

## 🧪 Testing Commands

### Local Development
```bash
# Start Supabase locally
supabase start

# Serve function with environment variables
supabase functions serve my-function --env-file ./supabase/functions/my-function/.env

# Watch for changes (auto-reload)
supabase functions serve my-function --env-file ./supabase/functions/my-function/.env --watch
```

### Test Requests
```bash
# Public endpoint
curl -X POST http://localhost:54321/functions/v1/my-function \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# Authenticated endpoint
curl -X POST http://localhost:54321/functions/v1/my-function \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"test": "data"}'
```

### Deployment
```bash
# Deploy single function
supabase functions deploy my-function

# Deploy all functions
supabase functions deploy

# View logs
supabase functions logs my-function --tail

# Set environment variable
supabase secrets set MY_SECRET=value
```

---

## 📊 Status Code Reference

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Temporary service issue |

---

## 🔍 Debugging Tips

### View Function Logs
```bash
# Real-time logs
supabase functions logs my-function --tail

# Recent logs
supabase functions logs my-function

# Filter by time
supabase functions logs my-function --since 1h
```

### Common Issues

**Issue:** 401 Unauthorized
- ✅ Check Authorization header format: `Bearer <token>`
- ✅ Verify token is valid and not expired
- ✅ Check `verify_jwt` setting in config.toml

**Issue:** CORS Error
- ✅ Include corsHeaders in ALL responses
- ✅ Handle OPTIONS preflight requests
- ✅ Check allowed headers in corsHeaders

**Issue:** Timeout
- ✅ Check function execution time
- ✅ Use background processing for long tasks
- ✅ Optimize database queries
- ✅ Add appropriate indexes

**Issue:** Environment Variable Not Found
- ✅ Set secret in Supabase Dashboard
- ✅ Check .env file for local development
- ✅ Use correct variable name (case-sensitive)

---

## 📚 Additional Resources

### Documentation
- [Full Specification Guide](./SERVERLESS_FUNCTION_SPEC.md) - Complete guide with examples
- [Example: process-webhook](./FUNCTION_EXAMPLE_process-webhook.md) - Full implementation example
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions) - Official docs

### Project Resources
- Existing functions: `supabase/functions/`
- Configuration: `supabase/config.toml`
- Custom instructions: Root `README.md`

### External APIs Used
- Shopify Storefront API (v2025-07)
- Lovable AI Gateway (ai.gateway.lovable.dev)
- Supabase (Auth, Storage, Database)

---

## 💡 Best Practices Summary

1. ✅ **Always** handle CORS (OPTIONS + headers)
2. ✅ **Always** validate input before processing
3. ✅ **Always** use environment variables for secrets
4. ✅ **Never** log sensitive data (tokens, passwords)
5. ✅ Return meaningful error messages
6. ✅ Use appropriate status codes
7. ✅ Implement background processing for long tasks
8. ✅ Add rate limiting for expensive operations
9. ✅ Log important events for debugging
10. ✅ Test thoroughly before deploying

---

## 🎯 Next Steps

After reading this guide:

1. **Review** the [Full Specification Guide](./SERVERLESS_FUNCTION_SPEC.md)
2. **Study** the [process-webhook example](./FUNCTION_EXAMPLE_process-webhook.md)
3. **Examine** existing functions in `supabase/functions/`
4. **Create** your function specification
5. **Implement** following the patterns
6. **Test** locally before deploying
7. **Deploy** and monitor logs
8. **Document** your function

---

## 📝 Function Checklist

Use this checklist when creating a new function:

**Planning:**
- [ ] Function name chosen (kebab-case)
- [ ] Specification documented
- [ ] Authentication model decided
- [ ] Environment variables identified
- [ ] Performance requirements defined

**Implementation:**
- [ ] Function directory created
- [ ] index.ts implemented
- [ ] CORS handling added
- [ ] Authentication implemented (if needed)
- [ ] Input validation added
- [ ] Error handling implemented
- [ ] Logging added
- [ ] Background processing added (if needed)

**Configuration:**
- [ ] Added to supabase/config.toml
- [ ] Environment variables set locally
- [ ] Environment variables set in production

**Testing:**
- [ ] Tested locally with curl
- [ ] Tested authentication flow
- [ ] Tested error cases
- [ ] Tested with invalid input
- [ ] Verified CORS works

**Deployment:**
- [ ] Deployed to Supabase
- [ ] Verified logs show no errors
- [ ] Tested production endpoint
- [ ] Documented in project docs
- [ ] Shared with team

---

**Need Help?**
- Review existing functions: `supabase/functions/beauty-assistant` and `supabase/functions/bulk-product-upload`
- Check Supabase documentation: https://supabase.com/docs
- Contact: asperpharma@gmail.com
