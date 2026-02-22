# Security Notice for Deployment

## Public API Keys in Workflows

The GitHub Actions workflows reference the following API keys and tokens:

### ✅ These are PUBLIC keys (safe for client-side use):

1. **Supabase Publishable Key** (`VITE_SUPABASE_PUBLISHABLE_KEY`)
   - This is the "anon" public key intended for browser/client use
   - It's safe to expose in client-side code and workflows
   - Protected by Row Level Security (RLS) policies in Supabase

2. **Shopify Storefront Token** (`VITE_SHOPIFY_STOREFRONT_TOKEN`)
   - This is the public Storefront API access token
   - Designed for client-side use (read-only access)
   - Cannot modify products or access sensitive store data

### 📋 Environment Variables Configuration

The workflow uses fallback values with the `||` operator:
```yaml
VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY || 'default-value' }}
```

This means:
- **If GitHub Secrets are set**: Uses the secret values (recommended)
- **If GitHub Secrets are not set**: Uses the fallback default values (will work)

### 🔒 To Use GitHub Secrets (Optional but Recommended):

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each environment variable:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SITE_URL`
   - `VITE_SHOPIFY_STORE_DOMAIN`
   - `VITE_SHOPIFY_STOREFRONT_TOKEN`
   - `VITE_SHOPIFY_API_VERSION`

### ⚠️ Important: These are NOT Secrets:

**DO NOT store these in GitHub Secrets**:
- Supabase Service Role Key (not used in this project)
- Shopify Admin API Token (not used in this project)
- Private API keys

If you ever need to use private keys, they should:
1. Never be committed to the repository
2. Always be stored as GitHub Secrets
3. Never be exposed to client-side code

### 🔐 Current Security Posture

✅ **Secure**: All sensitive operations happen via:
- Supabase RLS policies (database security)
- Shopify Admin API (server-side only, not in this repo)
- Row-level permissions

✅ **Client-Side Keys**: The keys in workflows are designed for public use
✅ **No Risk**: These keys cannot be used to modify data or access sensitive information

### 📚 References

- [Supabase Client Keys](https://supabase.com/docs/guides/api#api-keys)
- [Shopify Storefront API](https://shopify.dev/api/storefront)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Last Updated**: 2026-02-22  
**Status**: ✅ Secure Configuration
