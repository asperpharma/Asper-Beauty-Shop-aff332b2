# Datadog Webhook Handler

This Supabase Edge Function handles incoming webhook alerts from Datadog
monitoring service with HMAC SHA-256 signature verification.

## Overview

Datadog webhooks send monitor alerts to this endpoint. Each webhook includes a
`DD-Signature` header containing an HMAC SHA-256 signature of the request body,
which is verified to ensure the webhook is authentic.

## Features

- ✅ HMAC SHA-256 signature verification
- ✅ Secure webhook validation using `DD-Signature` header
- ✅ CORS support for cross-origin requests
- ✅ Structured error handling
- ✅ Optional payload storage in Supabase database

## Setup

### 1. Configure Environment Variable

Set the webhook secret in your Supabase project:

```bash
# Using Supabase CLI
supabase secrets set DATADOG_WEBHOOK_SECRET=your-secret-key-here

# Or via Supabase Dashboard:
# Project Settings > Edge Functions > Secrets
```

### 2. Deploy the Function

```bash
supabase functions deploy datadog-webhook
```

### 3. Configure Datadog Webhook

In your Datadog dashboard:

1. Go to **Integrations** > **Webhooks**
2. Add a new webhook with:
   - **Name**: Your webhook name
   - **URL**:
     `https://[your-project-ref].supabase.co/functions/v1/datadog-webhook`
   - **Custom Headers**: Not required (signature is automatic)
   - **Secret**: The same secret you configured in step 1

## API

### Endpoint

```
POST https://[your-project-ref].supabase.co/functions/v1/datadog-webhook
```

### Headers

- `DD-Signature` (required): HMAC SHA-256 signature of the request body
- `Content-Type`: `application/json`

### Request Body

The request body varies based on the Datadog alert type. Common fields include:

```json
{
  "alert_type": "error|warning|info|success",
  "title": "Alert title",
  "body": "Alert description",
  "date": 1234567890,
  "priority": "normal|low",
  "tags": ["tag1", "tag2"],
  "aggregation_key": "unique-key",
  "alert_transition": "triggered|recovered"
}
```

### Response

**Success (200)**

```json
{
  "success": true,
  "message": "Webhook received and verified",
  "alert_type": "error"
}
```

**Invalid Signature (401)**

```json
{
  "error": "Invalid signature"
}
```

**Missing Signature (401)**

```json
{
  "error": "Missing DD-Signature header"
}
```

**Server Error (500)**

```json
{
  "error": "Error message"
}
```

## Signature Verification

The function verifies webhooks using HMAC SHA-256:

1. Extracts the `DD-Signature` header from the request
2. Reads the raw request body
3. Computes HMAC-SHA256 hash: `HMAC-SHA256(secret, body)`
4. Compares computed signature with provided signature (case-insensitive)
5. Rejects the request if signatures don't match

### How Datadog Generates the Signature

Datadog generates the signature as:

```
DD-Signature = HMAC-SHA256(webhook_secret, request_body)
```

The signature is sent as a lowercase hexadecimal string.

## Testing

### Unit Tests

Run the Deno test suite:

```bash
deno run --allow-net supabase/functions/datadog-webhook/test.ts
```

Or run the Node.js equivalent:

```bash
node supabase/functions/datadog-webhook/test-node.cjs
```

The test files include:

- Valid signature verification
- Invalid signature rejection
- Wrong secret detection
- Case-insensitive comparison
- Modified payload detection

### Integration Testing

To test the deployed webhook endpoint:

```bash
# Set your webhook URL and secret
export WEBHOOK_URL="https://[your-project-ref].supabase.co/functions/v1/datadog-webhook"
export DATADOG_WEBHOOK_SECRET="your-secret-key"

# Run the integration test
node supabase/functions/datadog-webhook/send-test-webhook.cjs
```

This will:

1. Send a test webhook with a valid signature
2. Send a test webhook with an invalid signature
3. Verify both scenarios work as expected

## Security Best Practices

1. **Keep your webhook secret secure**: Never commit it to version control
2. **Use environment variables**: Store the secret in Supabase secrets
3. **Validate signatures**: Always verify the `DD-Signature` header
4. **Use HTTPS**: Ensure your webhook endpoint uses HTTPS (automatic with
   Supabase)
5. **Log failures**: Monitor failed verification attempts for security issues

## Optional: Store Webhook Events

To persist webhook events in your database, create a table:

```sql
CREATE TABLE datadog_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT,
  title TEXT,
  body TEXT,
  raw_payload JSONB,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies as needed
ALTER TABLE datadog_webhooks ENABLE ROW LEVEL SECURITY;
```

Then uncomment the storage code in `index.ts` (lines 137-144).

## Customization

Add your custom alert processing logic in the function after signature
verification (around line 150 in `index.ts`). Examples:

- Send notifications to team members
- Create issues in your issue tracker
- Update application status
- Trigger automated responses

## Troubleshooting

### Signature Verification Fails

1. Verify the webhook secret matches in both Datadog and Supabase
2. Check that the request body is not being modified before verification
3. Ensure you're reading the raw request body (not parsed JSON)
4. Verify the signature is sent in the `DD-Signature` header

### Function Not Receiving Webhooks

1. Check the webhook URL is correct
2. Verify the function is deployed: `supabase functions list`
3. Check function logs: `supabase functions logs datadog-webhook`
4. Test with a sample webhook from Datadog

## Learn More

- [Datadog Webhooks Documentation](https://docs.datadoghq.com/integrations/webhooks/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [HMAC Authentication](https://en.wikipedia.org/wiki/HMAC)
