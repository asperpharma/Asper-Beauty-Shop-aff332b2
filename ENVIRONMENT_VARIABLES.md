# Environment Variables Reference

This document provides a complete reference for all environment variables used in the Asper Beauty Shop project.

## Overview

The project uses environment variables for configuration in two contexts:
1. **Frontend (Vite/React)** - Browser-side configuration
2. **Backend (Supabase Edge Functions)** - Server-side configuration

## Frontend Environment Variables

### Location
- Development: `.env`
- Production: `.env.production`
- Example template: `.env.example` (if exists)

### Required Variables

#### VITE_SUPABASE_URL
- **Description:** Supabase project URL
- **Example:** `https://rgehleqcubtmcwyipyvi.supabase.co`
- **Used by:** Supabase client initialization
- **Required:** Yes

#### VITE_SUPABASE_PUBLISHABLE_KEY
- **Description:** Supabase anonymous (public) API key
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Used by:** Supabase client authentication
- **Required:** Yes
- **Security:** Safe to expose in client-side code (read-only access with RLS)

#### VITE_SUPABASE_PROJECT_ID
- **Description:** Supabase project identifier
- **Example:** `rgehleqcubtmcwyipyvi`
- **Used by:** Project identification
- **Required:** Yes

### Usage in Code

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Important Notes
- All frontend environment variables must be prefixed with `VITE_`
- Variables are embedded at build time (not runtime)
- Do NOT store sensitive secrets in frontend env vars
- Never commit `.env` or `.env.production` to version control

## Backend Environment Variables (Edge Functions)

### Auto-Injected by Supabase

These variables are **automatically provided** by Supabase in both local and hosted environments. You do NOT need to set them manually.

#### SUPABASE_URL
- **Description:** Supabase project URL
- **Auto-Injected:** Yes ✅
- **Example:** `https://rgehleqcubtmcwyipyvi.supabase.co`
- **Access:** `Deno.env.get('SUPABASE_URL')`

#### SUPABASE_ANON_KEY
- **Description:** Anonymous (public) API key
- **Auto-Injected:** Yes ✅
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Access:** `Deno.env.get('SUPABASE_ANON_KEY')`
- **Use Case:** Client authentication, public operations

#### SUPABASE_SERVICE_ROLE_KEY
- **Description:** Service role key with full database access
- **Auto-Injected:** Yes ✅
- **Security:** ⚠️ Never expose to client-side code
- **Access:** `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')`
- **Use Case:** Admin operations, bypassing RLS

#### SUPABASE_DB_URL
- **Description:** Direct PostgreSQL connection string
- **Auto-Injected:** Yes ✅
- **Access:** `Deno.env.get('SUPABASE_DB_URL')`
- **Use Case:** Direct database queries (rare, prefer Supabase client)

### Custom Secrets (Manual Configuration Required)

These are app-specific secrets that must be configured manually.

#### LOVABLE_API_KEY
- **Description:** API key for Lovable AI Gateway
- **Auto-Injected:** No ❌ (must be set manually)
- **Used by:** 
  - `beauty-assistant` function (AI chat)
  - `bulk-product-upload` function (image generation, AI categorization)
- **Required:** Yes
- **How to set:**
  ```bash
  supabase secrets set LOVABLE_API_KEY=your_api_key_here
  ```

#### SHOPIFY_ACCESS_TOKEN
- **Description:** Shopify Admin API access token
- **Auto-Injected:** No ❌ (must be set manually)
- **Used by:** `bulk-product-upload` function (create products in Shopify)
- **Required:** Only if using Shopify product creation
- **How to set:**
  ```bash
  supabase secrets set SHOPIFY_ACCESS_TOKEN=your_token_here
  ```

### Setting Custom Secrets

#### Option 1: Individual Secrets
```bash
supabase secrets set LOVABLE_API_KEY=your_key_here
supabase secrets set SHOPIFY_ACCESS_TOKEN=your_token_here
```

#### Option 2: From .env File
```bash
# Create a secrets file (DO NOT commit to git)
cat > .env.secrets << EOF
LOVABLE_API_KEY=your_key_here
SHOPIFY_ACCESS_TOKEN=your_token_here
EOF

# Upload all secrets at once
supabase secrets set --env-file .env.secrets

# Clean up the file
rm .env.secrets
```

#### Option 3: Via Supabase Dashboard
1. Go to your project dashboard
2. Navigate to **Project Settings** → **Edge Functions**
3. Click **Manage secrets**
4. Add your custom secrets

### Managing Secrets

#### List all secrets
```bash
supabase secrets list
```

#### Delete a secret
```bash
supabase secrets unset SECRET_NAME
```

#### Update a secret
```bash
# Just set it again with the new value
supabase secrets set SECRET_NAME=new_value
```

### Usage in Edge Functions

```typescript
// supabase/functions/example/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2'

// Auto-injected variables (no configuration needed)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Custom secrets (must be configured manually)
const apiKey = Deno.env.get('LOVABLE_API_KEY')
if (!apiKey) {
  throw new Error('LOVABLE_API_KEY is not configured')
}
```

## Local Development

### Frontend (.env)

```env
VITE_SUPABASE_URL=https://rgehleqcubtmcwyipyvi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=rgehleqcubtmcwyipyvi
```

### Backend (Edge Functions)

For local development, create `.env.local` in the function directory:

```bash
# supabase/functions/.env.local or supabase/functions/function-name/.env.local
LOVABLE_API_KEY=your_local_dev_key
SHOPIFY_ACCESS_TOKEN=your_local_dev_token
```

Then serve with:
```bash
supabase functions serve function-name --env-file .env.local
```

**Note:** Auto-injected variables (SUPABASE_URL, etc.) are provided automatically by `supabase start` and don't need to be in `.env.local`.

## Production Deployment

### Frontend
1. Set variables in `.env.production`
2. Build the app: `npm run build`
3. Deploy (Lovable platform handles this automatically)

### Backend (Edge Functions)
1. Set secrets in Supabase:
   ```bash
   supabase secrets set LOVABLE_API_KEY=production_key
   supabase secrets set SHOPIFY_ACCESS_TOKEN=production_token
   ```

2. Deploy functions:
   ```bash
   supabase functions deploy
   ```

3. Verify secrets:
   ```bash
   supabase secrets list
   ```

## Security Best Practices

### ✅ DO
- Use `VITE_` prefix for all frontend environment variables
- Store sensitive secrets as Supabase Edge Function secrets
- Rotate API keys and tokens periodically
- Use different keys for development and production
- Add `.env*` files to `.gitignore` (except `.env.example`)
- Use environment-specific values (dev vs production)
- Document all required environment variables

### ❌ DON'T
- Commit `.env` or `.env.production` files to git
- Expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code
- Hardcode API keys or secrets in source code
- Share production credentials in development
- Store sensitive data in frontend environment variables
- Use the same keys across multiple projects
- Share secrets via unsecured channels (email, Slack, etc.)

## Troubleshooting

### Frontend Issues

#### "Cannot read env variable"
- Ensure variable starts with `VITE_` prefix
- Restart dev server after changing `.env`
- Check that `.env` file exists and is in project root
- Verify syntax: `VARIABLE_NAME=value` (no spaces around `=`)

#### Build fails with missing variables
- Check `.env.production` exists and has all required variables
- Verify variables are accessed as `import.meta.env.VITE_*`

### Backend Issues

#### "LOVABLE_API_KEY is not configured"
```bash
# Set the secret
supabase secrets set LOVABLE_API_KEY=your_key

# Verify it's set
supabase secrets list

# Redeploy the function
supabase functions deploy function-name
```

#### Auto-injected variables are undefined
- For local development: ensure `supabase start` is running
- For production: variables are automatically provided by Supabase
- These should never be undefined in a proper Supabase environment

#### Local function can't access secrets
- Use `--env-file` flag: `supabase functions serve function-name --env-file .env.local`
- Or create function-specific `.env.local`: `supabase/functions/function-name/.env.local`

## Environment Variable Checklist

### Before Starting Development
- [ ] `.env` file exists with all `VITE_*` variables
- [ ] Supabase project is initialized (`supabase init`)
- [ ] Local Supabase is running (`supabase start`)

### Before Deploying Edge Functions
- [ ] All custom secrets are set: `supabase secrets list`
- [ ] Functions tested locally with correct secrets
- [ ] Production secrets are different from development
- [ ] No secrets hardcoded in function code

### Before Building for Production
- [ ] `.env.production` exists with production values
- [ ] No development-only values in production env
- [ ] All required `VITE_*` variables are set

## Reference Links

- [Supabase Environment Variables](https://supabase.com/docs/guides/functions/secrets)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Deno Environment Variables](https://deno.land/manual/runtime/environment_variables)

## Quick Reference Table

| Variable | Context | Auto-Injected | Required | Security Level |
|----------|---------|---------------|----------|----------------|
| `VITE_SUPABASE_URL` | Frontend | No | Yes | Public |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Frontend | No | Yes | Public (RLS protected) |
| `VITE_SUPABASE_PROJECT_ID` | Frontend | No | Yes | Public |
| `SUPABASE_URL` | Backend | Yes ✅ | Yes | Internal |
| `SUPABASE_ANON_KEY` | Backend | Yes ✅ | Yes | Internal |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend | Yes ✅ | Yes | Secret (admin access) |
| `SUPABASE_DB_URL` | Backend | Yes ✅ | No | Secret (direct DB access) |
| `LOVABLE_API_KEY` | Backend | No ❌ | Yes | Secret |
| `SHOPIFY_ACCESS_TOKEN` | Backend | No ❌ | Conditional | Secret |

## Support

For issues with environment variables:
1. Check this document first
2. Review function logs in Supabase dashboard
3. Verify secrets are set: `supabase secrets list`
4. Check `.gitignore` includes `.env*` files
5. Contact asperpharma@gmail.com for production access issues
