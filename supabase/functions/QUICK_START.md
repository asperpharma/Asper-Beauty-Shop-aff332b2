# Quick Start: Creating a New Supabase Edge Function

This is a quick reference for creating serverless functions in the Asper Beauty Shop project.

## 📋 Quick Checklist

When creating a new function, provide:

- [ ] **Function name** (URL-safe: lowercase-with-hyphens)
- [ ] **Purpose** (what it does in 1-2 sentences)
- [ ] **Inputs** (request body schema)
- [ ] **Outputs** (response schema)
- [ ] **Routes** (HTTP methods and paths)
- [ ] **Auth model** (public/authenticated/admin)
- [ ] **Environment variables** (secrets needed)
- [ ] **Response codes** (200, 400, 401, 403, 500, etc.)
- [ ] **Performance** (expected duration, timeouts)

## 🚀 Quick Start Commands

```bash
# Create new function
mkdir supabase/functions/my-function
touch supabase/functions/my-function/index.ts

# Add to config
echo '[functions.my-function]
verify_jwt = false' >> supabase/config.toml

# Deploy
supabase functions deploy my-function

# Test locally
supabase functions serve my-function

# Test remote
curl -X POST https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/my-function \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 📝 Minimal Function Template

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Your logic here
    const data = await req.json();
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
```

## 🔐 Authentication Patterns

### Public Function (No Auth)

```typescript
// config.toml
[functions.my-function]
verify_jwt = false

// No auth check needed in code
```

### Authenticated Users

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const authHeader = req.headers.get("Authorization");
if (!authHeader?.startsWith("Bearer ")) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
  { global: { headers: { Authorization: authHeader } } }
);

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
// After authenticating user...
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
```

## 🌍 Environment Variables

### Auto-Provided by Supabase
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (when needed)

### Custom Secrets

Set via CLI:
```bash
supabase secrets set MY_API_KEY=value
```

Or via Dashboard: **Project Settings > Edge Functions > Manage secrets**

Access in code:
```typescript
const apiKey = Deno.env.get("MY_API_KEY");
if (!apiKey) {
  throw new Error("MY_API_KEY not configured");
}
```

## 📊 Response Format Standards

### Success (200)
```json
{
  "success": true,
  "data": { /* result */ }
}
```

### Error (4xx/5xx)
```json
{
  "error": "Error message",
  "details": { /* optional */ }
}
```

### Common Status Codes
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (auth required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Rate Limited
- `500` - Server Error

## 🧪 Testing

### Local Development
```bash
# Start local Supabase
supabase start

# Serve function locally
supabase functions serve my-function

# Test with curl
curl -X POST http://localhost:54321/functions/v1/my-function \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Production Testing
```bash
curl -X POST https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/my-function \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 📚 Examples

See existing functions for reference:
- `beauty-assistant/` - Authenticated, streaming response, AI integration
- `bulk-product-upload/` - Admin-only, multiple actions, external API calls

## 📖 Full Documentation

For complete details, see [SERVERLESS_FUNCTION_SPEC.md](../../SERVERLESS_FUNCTION_SPEC.md)

---

*Last Updated: 2026-02-17*
