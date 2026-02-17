# Beauty Assistant Deployment Guide

This guide provides step-by-step instructions for deploying the `beauty-assistant` Supabase Edge Function with proper CORS configuration.

## Overview

The `beauty-assistant` function now uses dynamic CORS headers:
- When `ALLOWED_ORIGIN` secret is set, CORS is restricted to that specific origin
- Without the secret, it falls back to the request's `Origin` header, or `*` if missing
- This ensures secure production deployment while maintaining flexibility for development

## Prerequisites

- Node.js and npm installed
- Supabase CLI installed (`npm install -g supabase`)
- Access to the Supabase project (`rgehleqcubtmcwyipyvi`)

## Deployment Steps

### 1. Login to Supabase (One-time)

```bash
npx supabase login
```

This will open a browser window to authenticate with your Supabase account. After successful authentication, you can proceed with deployment commands.

**Alternative**: Use an access token if you prefer not to use interactive login:

```bash
# Set the access token environment variable
export SUPABASE_ACCESS_TOKEN="your-supabase-access-token"
```

You can generate an access token from your Supabase dashboard: https://supabase.com/dashboard/account/tokens

### 2. Set the CORS Secret

Configure the allowed origin for CORS to restrict access to your production storefront:

```bash
npx supabase secrets set ALLOWED_ORIGIN="https://https-www-asperbeautyshop-com.lovable.app" --project-ref rgehleqcubtmcwyipyvi
```

**Important Notes:**
- Replace the URL with your actual storefront origin if different
- The origin should match exactly (including protocol and subdomain)
- Once set, CORS will only allow requests from this origin
- For multiple origins, you'll need to modify the function logic

### 3. Deploy the Function

Deploy the updated `beauty-assistant` function to Supabase:

```bash
npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
```

This command will:
- Upload the function code to Supabase
- Use the latest CORS configuration with `getCorsHeaders` helper
- Apply the `ALLOWED_ORIGIN` secret if set
- Make the function available at your Supabase project URL

### 4. Verify the Deployment

After deployment, verify that the function works correctly with CORS.

#### Browser Console Verification (from your storefront)

Open your browser's developer console on `https://https-www-asperbeautyshop-com.lovable.app` and run:

**Test OPTIONS (preflight) request:**
```javascript
fetch('https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://https-www-asperbeautyshop-com.lovable.app'
  }
})
.then(response => {
  console.log('OPTIONS Status:', response.status);
  console.log('CORS Headers:', {
    'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
    'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
  });
});
```

Expected output:
- Status: `200`
- `Access-Control-Allow-Origin`: Should match your storefront origin

**Test POST request (with authentication):**
```javascript
// Note: This requires a valid Supabase auth token
const authToken = 'your-supabase-auth-token'; // Get from Supabase client

fetch('https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    'Origin': 'https://https-www-asperbeautyshop-com.lovable.app'
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello, can you help me with skincare?' }]
  })
})
.then(response => {
  console.log('POST Status:', response.status);
  console.log('CORS Headers:', {
    'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin')
  });
  return response.text();
})
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));
```

#### PowerShell Verification (from local machine)

**Test OPTIONS request:**
```powershell
curl.exe -X OPTIONS `
  -H "Origin: https://https-www-asperbeautyshop-com.lovable.app" `
  -i `
  https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant
```

**Test health POST request:**
```powershell
curl.exe -X POST `
  -H "Content-Type: application/json" `
  -H "Origin: https://https-www-asperbeautyshop-com.lovable.app" `
  -H "Authorization: Bearer your-supabase-auth-token" `
  -d '{"messages":[{"role":"user","content":"Hello"}]}' `
  -i `
  https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant
```

**Expected Response Headers:**
```
HTTP/2 200
access-control-allow-origin: https://https-www-asperbeautyshop-com.lovable.app
access-control-allow-headers: authorization, x-client-info, apikey, content-type
content-type: application/json
```

## Troubleshooting

### CORS Errors in Browser

If you see CORS errors like "Access to fetch has been blocked by CORS policy":

1. **Verify the origin matches exactly:**
   - Check that `ALLOWED_ORIGIN` secret matches your storefront URL exactly
   - Include protocol (`https://`), subdomain, and domain
   - No trailing slash

2. **Check the secret is set:**
   ```bash
   npx supabase secrets list --project-ref rgehleqcubtmcwyipyvi
   ```
   You should see `ALLOWED_ORIGIN` in the list

3. **Re-deploy after setting secret:**
   ```bash
   npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
   ```

### Authentication Errors

If you get 401 Unauthorized errors:

1. Ensure you're passing a valid Supabase auth token in the `Authorization` header
2. Check that the user is authenticated in your application
3. Verify the token hasn't expired

### Function Not Found (404)

If the function returns 404:

1. Verify the function name is correct: `beauty-assistant`
2. Check deployment was successful
3. Confirm project reference is correct: `rgehleqcubtmcwyipyvi`

### Deployment Failures

If deployment fails:

1. **Check Supabase CLI version:**
   ```bash
   npx supabase --version
   ```
   Update if needed: `npm install -g supabase@latest`

2. **Verify authentication:**
   ```bash
   npx supabase projects list
   ```
   Should show your projects if authenticated correctly

3. **Check function syntax:**
   - Ensure TypeScript/Deno syntax is valid
   - Run local Deno lint: `deno lint supabase/functions/beauty-assistant/index.ts`

## Security Considerations

- **Production**: Always set `ALLOWED_ORIGIN` to your specific production URL
- **Development**: You can omit the secret to allow any origin (useful for local dev)
- **API Keys**: Never expose `LOVABLE_API_KEY` or other secrets in client-side code
- **Authentication**: The function requires valid Supabase authentication tokens

## Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
- [CORS Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Support

For issues specific to this deployment:
- Check the main [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Contact: asperpharma@gmail.com
- Supabase Support: Via [Supabase Dashboard](https://supabase.com/dashboard)
