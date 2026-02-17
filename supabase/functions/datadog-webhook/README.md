# Datadog Webhook Handler

This Supabase Edge Function handles incoming webhook alerts from Datadog monitors and verifies their HMAC SHA-256 signatures for security.

## Features

- **HMAC SHA-256 Signature Verification**: Validates webhook authenticity using Datadog's `DD-Signature` header
- **Timing-Safe Comparison**: Prevents timing attacks when comparing signatures
- **CORS Support**: Handles preflight requests for cross-origin requests
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Setup

### 1. Configure the Webhook Secret

Set the `DATADOG_WEBHOOK_SECRET` environment variable in your Supabase project:

```bash
supabase secrets set DATADOG_WEBHOOK_SECRET=your_secret_key_here
```

### 2. Deploy the Function

```bash
supabase functions deploy datadog-webhook
```

### 3. Get the Function URL

After deployment, the function will be available at:
```
https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/datadog-webhook
```

## Datadog Configuration

### Creating a Webhook in Datadog

1. Go to **Integrations** → **Integrations** in Datadog
2. Search for and select **Webhooks**
3. Click **New** to create a new webhook
4. Configure the webhook:
   - **Name**: Asper Beauty Shop Alerts
   - **URL**: `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/datadog-webhook`
   - **Custom Headers**: Add `DD-Signature: sha256=$HMAC_SHA256`
   - **Payload**: Use the default Datadog payload format
   - **Secret**: Enter your webhook secret (same as `DATADOG_WEBHOOK_SECRET`)

### Attaching Webhook to Monitors

1. Create or edit a monitor in Datadog
2. In the **Notify your team** section, add:
   ```
   @webhook-asper-beauty-shop-alerts
   ```
3. Save the monitor

## Webhook Payload Format

Datadog sends webhooks with the following structure:

```json
{
  "title": "Monitor Alert Title",
  "body": "Detailed alert message",
  "alert_type": "error|warning|info|success",
  "priority": "normal|low",
  "date_happened": 1234567890,
  "tags": ["tag1:value1", "tag2:value2"],
  "aggregation_key": "unique_key",
  "alert_transition": "Triggered|Recovered|Re-alerted",
  "org": {
    "id": 12345,
    "name": "Organization Name"
  }
}
```

## Signature Verification

The function verifies signatures using the following process:

1. Extracts the `DD-Signature` header (format: `sha256=<hex_string>`)
2. Computes HMAC-SHA256 of the raw request body using the webhook secret
3. Compares the computed signature with the received signature using timing-safe comparison
4. Returns 401 Unauthorized if signatures don't match

### Signature Format

Datadog uses HMAC-SHA256 to sign the webhook payload:
- **Algorithm**: HMAC-SHA256
- **Header**: `DD-Signature`
- **Format**: `sha256=<hex_encoded_signature>`
- **Signing Input**: Raw request body (JSON string)
- **Key**: Webhook secret configured in Datadog

## Response Codes

- **200 OK**: Webhook received and signature verified successfully
- **400 Bad Request**: Invalid JSON payload
- **401 Unauthorized**: Missing or invalid signature
- **405 Method Not Allowed**: Non-POST request
- **500 Internal Server Error**: Server configuration error

## Testing

### Manual Test with curl

```bash
# Generate a test signature
SECRET="your_secret_key"
PAYLOAD='{"title":"Test Alert","body":"This is a test","alert_type":"info"}'
SIGNATURE="sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -binary | xxd -p -c 256)"

# Send the request
curl -X POST \
  https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/datadog-webhook \
  -H "Content-Type: application/json" \
  -H "DD-Signature: $SIGNATURE" \
  -d "$PAYLOAD"
```

### Expected Success Response

```json
{
  "status": "success",
  "message": "Webhook received and verified"
}
```

## Security Considerations

1. **Keep Secret Secure**: Never commit the webhook secret to version control
2. **Use Environment Variables**: Always store secrets in Supabase secrets
3. **HTTPS Only**: The webhook endpoint uses HTTPS by default
4. **Timing-Safe Comparison**: Prevents timing attacks on signature verification
5. **Signature Required**: All requests without valid signatures are rejected

## Customization

To add custom handling logic for Datadog alerts, modify the success handler in `index.ts`:

```typescript
// After signature verification succeeds, add your custom logic here
console.log("Received valid Datadog alert:", payload);

// Examples:
// - Send notifications to Slack/Discord
// - Store alerts in database
// - Trigger automated responses
// - Update monitoring dashboard
```

## Troubleshooting

### "Missing signature" Error
- Ensure the `DD-Signature` header is included in webhook configuration
- Verify Datadog webhook is configured to sign requests

### "Invalid signature" Error
- Check that `DATADOG_WEBHOOK_SECRET` matches the secret in Datadog
- Verify the signature format is `sha256=<hex_string>`
- Ensure the webhook payload hasn't been modified in transit

### "Webhook not configured" Error
- Set the `DATADOG_WEBHOOK_SECRET` environment variable in Supabase

## References

- [Datadog Webhook Integration](https://docs.datadoghq.com/integrations/webhooks/)
- [Datadog Monitor Notifications](https://docs.datadoghq.com/monitors/notify/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
