# Process Webhook Edge Function

A unified webhook processing endpoint for Asper Beauty Shop that handles incoming webhooks from multiple channels (Gorgias, ManyChat, and generic webhooks).

## Overview

This Edge Function provides a single entry point for all webhook integrations, with built-in:
- Request validation (method, JSON, size limits)
- Optional signature verification
- Rate limiting
- Database audit logging
- Conversation context management
- AI-powered responses via beauty-assistant
- Idempotency support

## Endpoints

### GET / (Health Check)

Returns service health status.

**Response:**
```json
{
  "status": "ok",
  "service": "process-webhook",
  "timestamp": "2026-02-17T21:00:00.000Z"
}
```

### POST / (Process Webhook)

Processes incoming webhook requests.

**Request:**
- **Method:** POST
- **Content-Type:** application/json
- **Max Body Size:** 256 KB

**Headers (Optional):**
- `x-webhook-route`: Route identifier (`gorgias`, `manychat`, `generic`)
- `x-webhook-signature`: Signature for verification (if WEBHOOK_SECRET configured)
- `x-idempotency-key`: Unique key to prevent duplicate processing

**Query Parameters (Optional):**
- `route`: Route identifier (alternative to header)
- `health`: Set to `true` for health check

**Response:**
```json
{
  "reply": "AI-generated response",
  "concern_slug": "skin-care",
  "logged": true,
  "conversationId": "uuid"
}
```

### OPTIONS / (CORS Preflight)

Handles CORS preflight requests.

## Routes

The function supports three webhook routes:

### 1. Gorgias
Route identifier: `gorgias`

Expected body structure:
```json
{
  "customer": {
    "id": "12345"
  },
  "message": {
    "body_text": "User message here"
  }
}
```

### 2. ManyChat
Route identifier: `manychat`

Expected body structure:
```json
{
  "user_id": "12345",
  "message": {
    "text": "User message here"
  }
}
```

### 3. Generic
Route identifier: `generic` (default)

Expected body structure:
```json
{
  "customer_id": "12345",
  "message": "User message here"
}
```

## Authentication

### Optional Webhook Secret

If `WEBHOOK_SECRET` environment variable is configured, the function validates incoming requests using the signature provided in:
- `x-webhook-signature` header, or
- `authorization` header

### Database Access

The function uses `SUPABASE_SERVICE_ROLE_KEY` to bypass Row Level Security (RLS) for database operations.

## Environment Variables

Required:
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for DB access
- `SUPABASE_ANON_KEY`: Anon key for calling beauty-assistant

Optional:
- `WEBHOOK_SECRET`: Secret for signature verification
- `BEAUTY_ASSISTANT_URL`: Custom URL for beauty-assistant (defaults to `/functions/v1/beauty-assistant`)
- `ALLOWED_ORIGIN`: CORS origin restriction (defaults to `*`)

## Features

### Rate Limiting
- 60 requests per minute per IP address
- Returns 429 status with `Retry-After` header when exceeded

### Idempotency
- Supports `event_id` in body or `x-idempotency-key` header
- Prevents duplicate processing and returns cached response

### Conversation Context
- Stores conversation history per customer and channel
- Maintains last 20 messages for context
- Automatically creates/updates conversation records

### Database Logging
- All webhook events are logged to `webhook_events` table
- Includes request metadata, processing time, and response
- Supports admin monitoring via RLS policies

### Error Handling
- Returns 200 with fallback message on errors (prevents channel retries)
- Logs all errors to database for debugging
- Graceful degradation if AI service unavailable

## Performance

- Target response time: <25 seconds (for channel timeouts)
- Background logging after response sent
- Streaming response support from AI service

## Database Schema

### Tables Created

#### conversations
Stores customer conversation context.

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  customer_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  context JSONB,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(customer_id, channel)
);
```

#### webhook_events
Logs all webhook requests.

```sql
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY,
  event_id TEXT,
  route TEXT NOT NULL,
  source_ip TEXT,
  headers JSONB,
  body JSONB NOT NULL,
  signature_valid BOOLEAN,
  conversation_id UUID,
  ai_reply TEXT,
  concern_slug TEXT,
  status TEXT,
  error_message TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP,
  UNIQUE(event_id, route)
);
```

## Usage Examples

### Send webhook from Gorgias

```bash
curl -X POST https://your-project.supabase.co/functions/v1/process-webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-route: gorgias" \
  -d '{
    "customer": {
      "id": "12345"
    },
    "message": {
      "body_text": "I need help with my dry skin"
    }
  }'
```

### Send webhook from ManyChat

```bash
curl -X POST https://your-project.supabase.co/functions/v1/process-webhook?route=manychat \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "67890",
    "message": {
      "text": "What products do you recommend for oily skin?"
    }
  }'
```

### Health check

```bash
curl https://your-project.supabase.co/functions/v1/process-webhook
```

## Security Considerations

1. **Signature Verification**: Always configure `WEBHOOK_SECRET` in production
2. **Rate Limiting**: Built-in per-IP rate limiting (60 req/min)
3. **Size Limits**: Maximum 256 KB body size
4. **Service Role**: Uses service role key for database operations (keep secret)
5. **Input Validation**: All inputs are validated and sanitized
6. **CORS**: Configure `ALLOWED_ORIGIN` to restrict access

## Monitoring

Admins can query the `webhook_events` table to monitor:
- Request volume by route
- Processing times
- Error rates
- AI response quality

```sql
-- Recent webhook events
SELECT route, status, processing_time_ms, created_at
FROM webhook_events
ORDER BY created_at DESC
LIMIT 100;

-- Error rate by route
SELECT route, 
       COUNT(*) as total,
       SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as errors
FROM webhook_events
GROUP BY route;
```

## When to Use process-webhook vs beauty-assistant

**Use process-webhook when:**
- Need a single webhook entry point for multiple channels
- Need database audit logging of all requests
- Need signature verification and rate limiting
- Need conversation context across multiple messages
- Integrating with external chat platforms (Gorgias, ManyChat)

**Use beauty-assistant directly when:**
- Building custom UI in the frontend
- Need streaming responses in real-time
- User authentication required (JWT)
- Don't need webhook-specific features

## Troubleshooting

### 401 Unauthorized
- Check `WEBHOOK_SECRET` configuration
- Verify signature in request header

### 429 Rate Limited
- Wait for `Retry-After` seconds
- Reduce request frequency

### 500 Internal Server Error
- Check function logs: `supabase functions logs process-webhook`
- Verify environment variables are set
- Check database connectivity

### AI responses not working
- Verify `BEAUTY_ASSISTANT_URL` or `SUPABASE_ANON_KEY`
- Check beauty-assistant function is deployed
- Review beauty-assistant logs

## Deployment

Deploy the function using Supabase CLI:

```bash
supabase functions deploy process-webhook
```

Set environment variables:

```bash
supabase secrets set WEBHOOK_SECRET=your-secret-here
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## License

Part of Asper Beauty Shop project.
