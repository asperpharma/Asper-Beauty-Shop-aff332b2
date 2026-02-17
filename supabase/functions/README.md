# Supabase Edge Functions

This directory contains Deno-based Edge Functions for the Asper Beauty Shop.

## Available Functions

### 1. `beauty-assistant`
AI-powered beauty consultation chatbot using Gemini 2.5 Flash via Lovable AI Gateway.

**Endpoint:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant`

**Authentication:** Requires user JWT token in `Authorization: Bearer <token>` header

**Custom Secrets Required:**
- `LOVABLE_API_KEY` - API key for Lovable AI Gateway

### 2. `bulk-product-upload`
Admin-only function for bulk product operations including categorization, image generation, and Shopify product creation.

**Endpoint:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload`

**Authentication:** Requires admin user JWT token

**Custom Secrets Required:**
- `LOVABLE_API_KEY` - API key for Lovable AI Gateway (image generation & AI categorization)
- `SHOPIFY_ACCESS_TOKEN` - Shopify Admin API access token for product creation

## Environment Variables

### Auto-Injected Variables (No Configuration Needed)

Supabase automatically injects these environment variables in **both local and hosted environments**:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Anonymous (public) API key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role (admin) API key with full database access
- `SUPABASE_DB_URL` - Direct PostgreSQL connection string

**You do NOT need to set these manually.** They are available via `Deno.env.get()` in all Edge Functions.

### Custom Secrets (Manual Configuration Required)

For app-specific secrets, you must configure them manually:

#### Setting Secrets

**Option 1: Individual secret**
```bash
supabase secrets set LOVABLE_API_KEY=your_key_here
supabase secrets set SHOPIFY_ACCESS_TOKEN=your_token_here
```

**Option 2: From .env file**
```bash
# Create a .env file with your secrets
echo "LOVABLE_API_KEY=your_key_here" > .env.secrets
echo "SHOPIFY_ACCESS_TOKEN=your_token_here" >> .env.secrets

# Upload all secrets at once
supabase secrets set --env-file .env.secrets
```

**Option 3: Via Supabase Dashboard**
1. Go to Project Settings > Edge Functions
2. Click on "Manage secrets"
3. Add your custom secrets

#### Listing Current Secrets
```bash
supabase secrets list
```

#### Deleting a Secret
```bash
supabase secrets unset SECRET_NAME
```

## Accessing Environment Variables in Code

### Using Supabase Client

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

// Auto-injected variables - available automatically
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)
```

### Using Custom Secrets

```typescript
// Custom app-specific secrets
const apiKey = Deno.env.get('LOVABLE_API_KEY')
const shopifyToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN')

if (!apiKey) {
  throw new Error('LOVABLE_API_KEY is not configured')
}
```

## Development

### Local Development

1. **Start Supabase locally:**
   ```bash
   supabase start
   ```

2. **Serve a function locally:**
   ```bash
   supabase functions serve beauty-assistant --no-verify-jwt
   ```

3. **Set local secrets:**
   ```bash
   # Create .env.local for local development
   echo "LOVABLE_API_KEY=your_local_key" > .env.local
   
   # Functions will read from .env.local automatically
   ```

### Deployment

**Deploy all functions:**
```bash
supabase functions deploy
```

**Deploy specific function:**
```bash
supabase functions deploy beauty-assistant
supabase functions deploy bulk-product-upload
```

**Important:** Make sure to set production secrets before deploying:
```bash
supabase secrets set LOVABLE_API_KEY=your_production_key
supabase secrets set SHOPIFY_ACCESS_TOKEN=your_production_token
```

## Testing

### Test beauty-assistant locally:
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/beauty-assistant' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{"messages":[{"role":"user","content":"What products do you recommend for dry skin?"}]}'
```

### Test bulk-product-upload locally:
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/bulk-product-upload' \
  --header 'Authorization: Bearer YOUR_ADMIN_JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{"action":"categorize","products":[{"sku":"TEST-001","name":"Test Product","costPrice":10,"sellingPrice":15}]}'
```

## Security Notes

- **Never commit secrets** to version control (.env files are in .gitignore)
- Auto-injected Supabase variables are managed securely by the platform
- Use `SUPABASE_SERVICE_ROLE_KEY` only in Edge Functions, never expose to client-side code
- Custom secrets are encrypted at rest in Supabase
- JWT verification is disabled (`verify_jwt = false`) in `config.toml` for these functions as they handle auth verification internally

## Configuration

Function-specific settings are in `supabase/config.toml`:

```toml
[functions.beauty-assistant]
verify_jwt = false

[functions.bulk-product-upload]
verify_jwt = false
```

Both functions implement custom JWT verification logic for enhanced security and flexibility.

## Troubleshooting

### Function returns "Unauthorized"
- Check that you're passing a valid JWT token in the `Authorization` header
- For bulk-product-upload, ensure the user has admin role in the `user_roles` table

### "LOVABLE_API_KEY is not configured"
- Set the secret: `supabase secrets set LOVABLE_API_KEY=your_key`
- Verify it's set: `supabase secrets list`

### "SHOPIFY_ACCESS_TOKEN is not configured"
- Set the secret: `supabase secrets set SHOPIFY_ACCESS_TOKEN=your_token`
- This is only needed for the `create-shopify-product` action

### Cannot access SUPABASE_URL or other auto-injected vars
- These should work automatically - no configuration needed
- If missing, check you're running in a Supabase environment (local via `supabase functions serve` or deployed)

## Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/)
- [Lovable AI Gateway](https://docs.lovable.dev/api-reference/ai-gateway)
