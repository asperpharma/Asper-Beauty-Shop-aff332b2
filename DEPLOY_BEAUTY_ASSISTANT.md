# Beauty Assistant Function Deployment Guide

This guide provides step-by-step instructions for deploying the beauty-assistant Supabase Edge Function with proper CORS configuration.

## Prerequisites

- Supabase CLI installed (`npm install -g supabase`)
- Logged in to Supabase CLI (`npx supabase login` or `SUPABASE_ACCESS_TOKEN` set)
- Project reference: `rgehleqcubtmcwyipyvi`

## 1. Set Environment Secrets

The beauty-assistant function requires the `ALLOWED_ORIGIN` secret to be set for proper CORS configuration.

### Command Syntax

```bash
npx supabase secrets set ALLOWED_ORIGIN="https://https-www-asperbeautyshop-com.lovable.app" --project-ref rgehleqcubtmcwyipyvi
```

### For Windows Users

If you're running this from PowerShell or Command Prompt, use the same command:

```powershell
npx supabase secrets set ALLOWED_ORIGIN="https://https-www-asperbeautyshop-com.lovable.app" --project-ref rgehleqcubtmcwyipyvi
```

### Alternative: Set Multiple Secrets

If you need to set additional secrets in the future:

```bash
npx supabase secrets set SECRET_NAME="value" --project-ref rgehleqcubtmcwyipyvi
```

## 2. Deploy the Function

After setting the secrets, deploy the beauty-assistant function:

```bash
npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
```

This command will:
- Package the function code
- Upload it to Supabase
- Make it available at: `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant`

## 3. Verification

After deployment, verify that the function is working correctly and CORS is properly configured.

### Method 1: Browser Console

1. Open your storefront: `https://https-www-asperbeautyshop-com.lovable.app`
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Run the following commands:

#### Test OPTIONS Request (CORS Preflight)

```javascript
fetch('https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant', { 
  method: 'OPTIONS' 
})
.then(r => console.log('OPTIONS', r.status, r.headers.get('Access-Control-Allow-Origin')));
```

**Expected Output:**
```
OPTIONS 200 https://https-www-asperbeautyshop-com.lovable.app
```

#### Test POST Request (Ping Test)

```javascript
fetch('https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ping: true })
})
.then(r => r.json())
.then(console.log);
```

**Expected Output:**
```json
{
  "error": "Unauthorized"
}
```

This is expected since the function requires authentication. The important part is that you get a JSON response without CORS errors.

### Method 2: PowerShell (Windows)

For Windows users who prefer PowerShell, use these commands:

#### Test OPTIONS Request

```powershell
$response = Invoke-WebRequest -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" -Method OPTIONS -UseBasicParsing
Write-Host "Status:" $response.StatusCode
Write-Host "CORS Header:" $response.Headers['Access-Control-Allow-Origin']
```

**Expected Output:**
```
Status: 200
CORS Header: https://https-www-asperbeautyshop-com.lovable.app
```

#### Test POST Request

```powershell
$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    ping = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant" -Method POST -Headers $headers -Body $body
    Write-Host "Response:" ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "Error:" $_.Exception.Message
    Write-Host "Response:" $_.Exception.Response
}
```

**Expected Output:**
```json
Response: {
  "error": "Unauthorized"
}
```

### Method 3: Curl (Linux/Mac/Windows Git Bash)

#### Test OPTIONS Request

```bash
curl -i -X OPTIONS https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant
```

#### Test POST Request

```bash
curl -X POST \
  https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant \
  -H "Content-Type: application/json" \
  -d '{"ping": true}'
```

## 4. Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. **Verify the secret is set correctly:**
   ```bash
   npx supabase secrets list --project-ref rgehleqcubtmcwyipyvi
   ```

2. **Redeploy the function:**
   ```bash
   npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
   ```

3. **Check the function logs:**
   ```bash
   npx supabase functions logs beauty-assistant --project-ref rgehleqcubtmcwyipyvi
   ```

### Function Not Found

If you get a 404 error:

1. Verify the function deployed successfully
2. Check the function URL is correct
3. Ensure the project reference matches your Supabase project

### Authentication Errors

The function requires a valid Supabase authentication token. To test with authentication:

1. Log in to your application
2. Get the session token from localStorage or your auth state
3. Include it in the Authorization header:
   ```javascript
   fetch('https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${yourAuthToken}`
     },
     body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] })
   })
   ```

## 5. Environment Variables

The beauty-assistant function uses the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `ALLOWED_ORIGIN` | The origin(s) allowed to access the function | Yes |
| `SUPABASE_URL` | Supabase project URL (auto-provided) | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key (auto-provided) | Yes |
| `LOVABLE_API_KEY` | API key for Lovable AI Gateway | Yes |

### Viewing Current Secrets

```bash
npx supabase secrets list --project-ref rgehleqcubtmcwyipyvi
```

### Updating Secrets

To update the `ALLOWED_ORIGIN` or any other secret:

```bash
npx supabase secrets set ALLOWED_ORIGIN="new-value" --project-ref rgehleqcubtmcwyipyvi
```

Remember to redeploy the function after updating secrets:

```bash
npx supabase functions deploy beauty-assistant --project-ref rgehleqcubtmcwyipyvi
```

## 6. Production Checklist

Before deploying to production:

- [ ] Set `ALLOWED_ORIGIN` to production domain
- [ ] Verify `LOVABLE_API_KEY` is set
- [ ] Test CORS from production domain
- [ ] Test authentication flow
- [ ] Monitor function logs for errors
- [ ] Set up error alerting (optional)
- [ ] Document any environment-specific configuration

## 7. Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Support

For issues or questions:
- Check Supabase function logs: `npx supabase functions logs beauty-assistant --project-ref rgehleqcubtmcwyipyvi`
- Review this repository's issues
- Contact: asperpharma@gmail.com
