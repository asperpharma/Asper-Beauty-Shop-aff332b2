# Beauty Assistant Edge Function

AI-powered beauty consultation chatbot for Asper Beauty Shop.

## Overview

This Edge Function provides an intelligent beauty assistant that helps customers find the perfect products based on their skin type, concerns, and preferences. It uses Google's Gemini 2.5 Flash model via the Lovable AI Gateway.

## Endpoint

**Production:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant`

**Local:** `http://localhost:54321/functions/v1/beauty-assistant`

## Authentication

Requires a valid user JWT token in the `Authorization` header:

```
Authorization: Bearer <user_jwt_token>
```

The function validates the token and extracts the user ID before processing requests.

## Environment Variables

### Auto-Injected (No Configuration Needed)
- `SUPABASE_URL` - Automatically provided by Supabase
- `SUPABASE_ANON_KEY` - Automatically provided by Supabase

### Required Custom Secrets
- `LOVABLE_API_KEY` - API key for accessing Lovable AI Gateway

### Setting the Custom Secret

```bash
# Set the secret
supabase secrets set LOVABLE_API_KEY=your_api_key_here

# Verify it's set
supabase secrets list
```

## Request Format

```json
{
  "messages": [
    {
      "role": "user",
      "content": "What products do you recommend for oily skin?"
    }
  ]
}
```

The `messages` array follows the standard chat completion format and can include conversation history.

## Response Format

The function returns a **streaming response** (Server-Sent Events) containing the AI's response in real-time:

```
Content-Type: text/event-stream
```

## Features

### Consultation Capabilities
- Identifies skin type (oily, dry, combination, sensitive, normal)
- Addresses specific concerns (acne, aging, dark spots, dullness, dehydration, sensitivity, sun protection)
- Recommends products from available categories
- Provides personalized skincare routine advice
- Maintains conversational context

### Product Categories Covered
- **Skin Care**: cleansers, toners, serums, moisturizers, masks, eye care
- **Body Care**: lotions, creams, scrubs
- **Hair Care**: shampoos, conditioners, treatments, oils
- **Make-up**: foundations, lipsticks, mascaras, eyeshadows
- **Fragrances**: perfumes, body mists
- **Tools & Devices**: brushes, applicators, devices

### Brands Available
Vichy, Eucerin, Cetaphil, SVR, Bourjois, IsaDora, Essence, Bioten, Mavala

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```
**Cause:** Missing, invalid, or expired JWT token

### 429 Rate Limit Exceeded
```json
{
  "error": "Rate limit exceeded. Please try again in a moment."
}
```
**Cause:** Too many requests to the AI Gateway

### 402 Service Unavailable
```json
{
  "error": "Service temporarily unavailable."
}
```
**Cause:** AI service quota exceeded or payment required

### 500 Internal Server Error
```json
{
  "error": "Error message details"
}
```
**Cause:** Various internal errors (check function logs)

## Usage Example

### cURL

```bash
curl -i --location --request POST \
  'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "messages": [
      {
        "role": "user",
        "content": "I have oily skin with acne. What cleanser would you recommend?"
      }
    ]
  }'
```

### JavaScript/TypeScript (Client)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function askBeautyAssistant(message: string) {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('User not authenticated')
  }

  const response = await fetch(
    'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', content: message }
        ]
      })
    }
  )

  // Handle streaming response
  const reader = response.body?.getReader()
  if (!reader) return

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    const text = new TextDecoder().decode(value)
    console.log(text) // Process streaming chunks
  }
}
```

## Local Development

### Start Function Locally

```bash
# Make sure Supabase is running
supabase start

# Serve the function
supabase functions serve beauty-assistant --no-verify-jwt

# In another terminal, test it
curl -i --location --request POST 'http://localhost:54321/functions/v1/beauty-assistant' \
  --header 'Authorization: Bearer eyJhbGc...' \
  --header 'Content-Type: application/json' \
  --data '{"messages":[{"role":"user","content":"Hello!"}]}'
```

### Local Environment Variables

Create a `.env.local` file in the function directory (already in .gitignore):

```bash
LOVABLE_API_KEY=your_local_api_key
```

## Deployment

```bash
# Deploy just this function
supabase functions deploy beauty-assistant

# Make sure secrets are set in production
supabase secrets set LOVABLE_API_KEY=your_production_key
```

## Security

- JWT verification is handled manually within the function for flexibility
- User authentication is validated on every request
- CORS headers allow all origins (adjust if needed for production)
- API key is stored as an encrypted secret, never in code
- All errors are logged for monitoring

## Configuration

Function settings in `supabase/config.toml`:

```toml
[functions.beauty-assistant]
verify_jwt = false  # Custom JWT verification implemented in code
```

## System Prompt

The AI assistant is configured with a comprehensive system prompt that defines its:
- Role as a beauty consultant for Asper Beauty
- Available product categories and brands
- Consultation methodology (ask about skin type, concerns, etc.)
- Response style (concise, warm, professional, encouraging)

The system prompt is hardcoded in the function for consistency and can be updated by modifying the `systemPrompt` constant.

## Monitoring

Function logs are available in the Supabase dashboard:
1. Go to **Edge Functions** section
2. Select `beauty-assistant`
3. View **Logs** tab

Key metrics to monitor:
- Authentication failures (401 errors)
- Rate limit hits (429 errors)
- AI Gateway errors
- Response times

## Troubleshooting

### "Unauthorized" Error
- Verify JWT token is valid and not expired
- Check user exists in Supabase Auth
- Ensure `Authorization` header format is correct: `Bearer <token>`

### "LOVABLE_API_KEY is not configured"
- Set the secret: `supabase secrets set LOVABLE_API_KEY=your_key`
- Redeploy the function after setting secrets

### Rate Limiting
- The AI Gateway has rate limits per API key
- Implement client-side rate limiting/caching
- Consider upgrading your Lovable plan if needed

### No Streaming Response
- Ensure client supports Server-Sent Events
- Check that response body is being read as a stream
- Verify network doesn't buffer the response

## Future Enhancements

Potential improvements:
- Add conversation history persistence in database
- Implement product recommendations with actual product IDs
- Add support for image analysis (customer skin photos)
- Multi-language support (Arabic translations)
- Integration with inventory for real-time availability
- Customer satisfaction feedback collection
