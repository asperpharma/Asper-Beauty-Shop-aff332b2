# Supabase Edge Functions

This directory contains serverless functions (Deno-based Edge Functions) for the Asper Beauty Shop.

## 📁 Current Functions

### 1. `beauty-assistant/`
**Purpose**: AI-powered beauty consultation chatbot

- **Model**: Gemini 2.5 Flash via Lovable AI Gateway
- **Auth**: Authenticated users only
- **Response**: Server-Sent Events (streaming)
- **Use Case**: Customer beauty recommendations and skincare advice

### 2. `bulk-product-upload/`
**Purpose**: Admin tool for bulk product imports

- **Features**: 
  - Product categorization
  - AI image generation
  - Shopify product creation
  - Brand extraction
- **Auth**: Admin only (RBAC)
- **Use Case**: Importing products from Excel to Shopify

## 🚀 Quick Start

See [QUICK_START.md](./QUICK_START.md) for a quick reference guide.

## 📖 Creating New Functions

### 1. Use the Template

```bash
# Copy template
cp supabase/functions/TEMPLATE.ts supabase/functions/my-function/index.ts

# Edit the new function
# nano supabase/functions/my-function/index.ts
```

### 2. Add to Configuration

Edit `supabase/config.toml`:

```toml
[functions.my-function]
verify_jwt = false  # Set to true if authentication required
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
# Local
supabase functions serve my-function

# Remote
curl -X POST https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/my-function \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 📝 Function Specification

When creating a new function, document:

1. **Function Name** (URL-safe)
2. **Purpose & Business Logic**
3. **Input Schema**
4. **Output Schema**
5. **HTTP Routes & Methods**
6. **Authentication Model**
7. **Environment Variables**
8. **Response Codes**
9. **Performance Considerations**

See [SERVERLESS_FUNCTION_SPEC.md](../../SERVERLESS_FUNCTION_SPEC.md) for complete details.

## 🔐 Authentication Patterns

### Public (No Auth)
```typescript
// config.toml: verify_jwt = false
// No auth check in code
```

### Authenticated Users
```typescript
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

### Admin Only
```typescript
// After user auth...
const { data: roleData } = await supabaseAdmin
  .from("user_roles")
  .select("role")
  .eq("user_id", user.id)
  .single();

if (roleData?.role !== "admin") {
  return new Response(JSON.stringify({ error: "Forbidden" }), {
    status: 403,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

## 🌍 Environment Variables

### Auto-Provided
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Custom Secrets

Set via CLI:
```bash
supabase secrets set MY_SECRET=value
```

Or via Supabase Dashboard:
**Project Settings > Edge Functions > Manage secrets**

### Current Custom Secrets
- `LOVABLE_API_KEY` - AI Gateway access
- `SHOPIFY_ACCESS_TOKEN` - Shopify Admin API

## 📊 Response Standards

### Success (200)
```json
{
  "success": true,
  "data": { }
}
```

### Error (4xx/5xx)
```json
{
  "error": "Error message",
  "details": { }
}
```

## 🧪 Testing Checklist

- [ ] Function handles CORS preflight (OPTIONS)
- [ ] Authentication works correctly
- [ ] Input validation catches bad data
- [ ] Error responses include proper status codes
- [ ] Success responses match schema
- [ ] Function completes within timeout (60s default)
- [ ] Environment variables are set
- [ ] Added to `config.toml`

## 📦 Dependencies

Functions use Deno imports from:
- `https://deno.land/std@0.168.0/` - Deno standard library
- `https://esm.sh/@supabase/supabase-js@2` - Supabase client

Always use versioned imports for stability.

## 🚨 Common Issues

### Function Not Found
- Check function is deployed: `supabase functions list`
- Verify function name matches URL path

### CORS Errors
- Ensure CORS headers are set on all responses
- Handle OPTIONS preflight requests

### Authentication Failures
- Check `verify_jwt` setting in config.toml
- Verify Authorization header format: `Bearer <token>`
- Check token is valid and not expired

### Timeout Errors
- Functions timeout after 60s by default
- Use background jobs for long operations
- Implement streaming for real-time updates

## 📚 Resources

- [Complete Specification](../../SERVERLESS_FUNCTION_SPEC.md)
- [Quick Start Guide](./QUICK_START.md)
- [Function Template](./TEMPLATE.ts)
- [Supabase Docs](https://supabase.com/docs/guides/functions)
- [Deno Manual](https://deno.land/manual)

---

**Need Help?** Check existing functions for examples or see the documentation above.

*Last Updated: 2026-02-17*
