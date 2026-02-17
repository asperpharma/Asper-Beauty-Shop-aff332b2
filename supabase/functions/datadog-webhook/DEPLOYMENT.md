# Datadog Webhook Deployment Guide

This guide walks you through deploying the Datadog webhook handler to Supabase and configuring it in Datadog.

## Prerequisites

- Supabase CLI installed (`npm install -g supabase`)
- Supabase account and project access
- Datadog account with monitor configuration access
- A secure webhook secret (generate with: `openssl rand -hex 32`)

## Step 1: Generate Webhook Secret

Generate a secure random secret for webhook signing:

```bash
openssl rand -hex 32
```

Save this secret - you'll need it for both Supabase and Datadog configuration.

## Step 2: Configure Supabase Environment

Set the webhook secret as an environment variable in Supabase:

```bash
# Login to Supabase (if not already logged in)
supabase login

# Link to your project
supabase link --project-ref rgehleqcubtmcwyipyvi

# Set the webhook secret
supabase secrets set DATADOG_WEBHOOK_SECRET=your_generated_secret_here
```

## Step 3: Deploy the Function

Deploy the Datadog webhook function to Supabase:

```bash
# From the project root directory
cd /path/to/Asper-Beauty-Shop-aff332b2

# Deploy the function
supabase functions deploy datadog-webhook

# Verify deployment
supabase functions list
```

Expected output:
```
┌─────────────────────┬──────────┬───────────┐
│ NAME                │ VERSION  │ STATUS    │
├─────────────────────┼──────────┼───────────┤
│ datadog-webhook     │ v1       │ deployed  │
└─────────────────────┴──────────┴───────────┘
```

## Step 4: Get the Function URL

The webhook endpoint URL will be:
```
https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/datadog-webhook
```

## Step 5: Configure Datadog Webhook Integration

### 5.1 Add Webhook Integration

1. Log in to Datadog
2. Navigate to **Integrations** → **Integrations**
3. Search for "Webhooks"
4. Click on the Webhooks tile
5. Click **New** (or **Add New Webhook** button)

### 5.2 Configure Webhook Settings

Fill in the webhook configuration:

**Name:**
```
asper-beauty-shop-alerts
```

**URL:**
```
https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/datadog-webhook
```

**Custom Headers:**
Add the DD-Signature header:
- Header Name: `DD-Signature`
- Header Value: `sha256=$HMAC_SHA256`

**Authentication:**
- If available, enter your webhook secret in the "Secret" field
- This is the same secret you set in Supabase (DATADOG_WEBHOOK_SECRET)

**Payload:**
Use the default Datadog webhook payload (or customize as needed):
```json
{
  "title": "$EVENT_TITLE",
  "body": "$EVENT_MSG",
  "alert_type": "$ALERT_TYPE",
  "priority": "$PRIORITY",
  "date_happened": "$DATE",
  "tags": "$TAGS",
  "aggregation_key": "$AGGREGATION_KEY",
  "alert_transition": "$ALERT_TRANSITION",
  "org": {
    "id": "$ORG_ID",
    "name": "$ORG_NAME"
  }
}
```

**Save** the webhook configuration.

## Step 6: Attach Webhook to Monitors

Now you can add the webhook to any Datadog monitor:

1. Create or edit a monitor in Datadog
2. In the **"Notify your team"** section, add the webhook mention:
   ```
   @webhook-asper-beauty-shop-alerts
   ```
3. Customize the message if needed
4. Save the monitor

### Example Monitor Message:
```
{{#is_alert}}
High CPU usage detected on {{host.name}}!
CPU: {{value}}%
@webhook-asper-beauty-shop-alerts
{{/is_alert}}

{{#is_recovery}}
CPU usage back to normal on {{host.name}}.
@webhook-asper-beauty-shop-alerts
{{/is_recovery}}
```

## Step 7: Test the Webhook

### Method 1: Test from Datadog

1. Go to your monitor
2. Click **"Test Notifications"**
3. Select the webhook
4. Click **"Run Test"**
5. Check Supabase logs to verify receipt

### Method 2: Manual Test with curl

Use the demo script to generate a test request:

```bash
cd supabase/functions/datadog-webhook
node demo-signature-verification.cjs
```

Copy the generated curl command and run it.

### Method 3: Check Supabase Logs

Monitor the function logs in Supabase:

```bash
supabase functions logs datadog-webhook --tail
```

Or view logs in Supabase Dashboard:
1. Go to https://app.supabase.com
2. Select your project
3. Navigate to **Edge Functions** → **datadog-webhook**
4. Click on **Logs** tab

## Troubleshooting

### Webhook Returns 401 "Invalid signature"

**Possible causes:**
1. Secret mismatch between Datadog and Supabase
2. Signature format incorrect in Datadog

**Solutions:**
- Verify `DATADOG_WEBHOOK_SECRET` in Supabase matches Datadog secret
- Ensure DD-Signature header is set to `sha256=$HMAC_SHA256` in Datadog
- Check Supabase logs for detailed error messages

### Webhook Returns 500 "Webhook not configured"

**Cause:** DATADOG_WEBHOOK_SECRET environment variable not set

**Solution:**
```bash
supabase secrets set DATADOG_WEBHOOK_SECRET=your_secret_here
```

### Webhook Not Receiving Alerts

**Check:**
1. Monitor has `@webhook-asper-beauty-shop-alerts` in notification message
2. Monitor condition is actually triggering
3. Webhook integration is enabled in Datadog
4. Function is deployed and active in Supabase

### View Function Status

```bash
# Check if function is deployed
supabase functions list

# View recent logs
supabase functions logs datadog-webhook --tail
```

## Security Best Practices

1. **Keep Secret Secure**
   - Never commit secrets to git
   - Use strong, randomly-generated secrets (32+ bytes)
   - Rotate secrets periodically

2. **Monitor Access Logs**
   - Regularly check Supabase function logs
   - Alert on unusual patterns or high failure rates

3. **Restrict Access**
   - Webhook is public but requires valid signature
   - Consider adding IP allowlisting if Datadog provides static IPs

4. **Test Regularly**
   - Periodically test webhook to ensure it's functioning
   - Update secrets if compromised

## Monitoring the Webhook

### Set up Alerts for Webhook Failures

Create a Datadog monitor to alert if webhooks fail:

1. Create a new **Logs Monitor** in Datadog
2. Set query to detect webhook errors:
   ```
   source:datadog service:webhooks status:error
   ```
3. Add notification to your team channel

### Dashboard Widgets

Add webhook metrics to your dashboard:
- Success rate
- Response times
- Error counts
- Volume trends

## Next Steps

After successful deployment:

1. **Customize Handler Logic**
   - Edit `supabase/functions/datadog-webhook/index.ts`
   - Add custom alert handling (notifications, database updates, etc.)
   - Redeploy: `supabase functions deploy datadog-webhook`

2. **Add More Integrations**
   - Send alerts to Slack/Discord
   - Store alerts in Supabase database
   - Trigger automated remediation workflows

3. **Monitor Performance**
   - Track webhook delivery success rate
   - Monitor function execution times
   - Set up alerts for webhook failures

## Support

For issues or questions:
- Check the [README.md](./README.md) for detailed function documentation
- Review Supabase Edge Functions docs: https://supabase.com/docs/guides/functions
- Review Datadog Webhooks docs: https://docs.datadoghq.com/integrations/webhooks/

## Rollback

If you need to remove or disable the webhook:

```bash
# Delete the function
supabase functions delete datadog-webhook

# Or disable in Datadog
# Go to Integrations → Webhooks → Edit → Toggle "Enabled" off
```
