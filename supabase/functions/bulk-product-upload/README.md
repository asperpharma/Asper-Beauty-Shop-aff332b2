# Bulk Product Upload Edge Function

Admin-only function for bulk product operations including categorization, image generation, and Shopify product creation.

## Overview

This Edge Function provides powerful admin tools for managing large product catalogs:
- Automatic product categorization using keyword matching or AI
- AI-powered product image generation via Lovable AI Gateway
- Shopify product creation via Admin API
- Batch processing support

## Endpoint

**Production:** `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload`

**Local:** `http://localhost:54321/functions/v1/bulk-product-upload`

## Authentication & Authorization

### Requirements
1. Valid user JWT token in `Authorization` header
2. User must have `admin` role in the `user_roles` table

```sql
-- Check if user has admin role
SELECT role FROM user_roles WHERE user_id = 'user-uuid-here';
```

### Response Codes
- `401 Unauthorized` - Missing or invalid JWT token
- `403 Forbidden` - User is not an admin
- `200 OK` - Request processed successfully

## Environment Variables

### Auto-Injected (No Configuration Needed)
- `SUPABASE_URL` - Automatically provided by Supabase
- `SUPABASE_ANON_KEY` - Automatically provided by Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Automatically provided by Supabase (for admin operations)

### Required Custom Secrets

#### LOVABLE_API_KEY
For AI-powered image generation and categorization:
```bash
supabase secrets set LOVABLE_API_KEY=your_api_key_here
```

#### SHOPIFY_ACCESS_TOKEN
For creating products in Shopify (optional, only if using Shopify integration):
```bash
supabase secrets set SHOPIFY_ACCESS_TOKEN=your_shopify_admin_token
```

**Note:** If `SHOPIFY_ACCESS_TOKEN` is not set, the `create-shopify-product` action will fail, but other actions will work fine.

## Available Actions

### 1. Categorize Products

Automatically categorize products using keyword matching.

**Request:**
```json
{
  "action": "categorize",
  "products": [
    {
      "sku": "PROD-001",
      "name": "Eucerin Advanced Repair Cream",
      "costPrice": 15.50,
      "sellingPrice": 24.99
    },
    {
      "sku": "PROD-002", 
      "name": "Vichy Mineral 89 Serum",
      "costPrice": 22.00,
      "sellingPrice": 35.99
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "sku": "PROD-001",
      "name": "Eucerin Advanced Repair Cream",
      "category": "Skin Care",
      "brand": "Eucerin",
      "price": 24.99,
      "costPrice": 15.50,
      "imagePrompt": "Ultra high resolution product photography of Eucerin Advanced Repair Cream. Elegant skincare product bottle/jar on minimalist marble surface with soft natural lighting...",
      "status": "pending"
    }
  ],
  "summary": {
    "total": 2,
    "categories": {
      "Skin Care": 2
    },
    "brands": {
      "Eucerin": 1,
      "Vichy": 1
    }
  }
}
```

**Categories:**
- Skin Care
- Hair Care
- Body Care
- Make Up
- Fragrances
- Health & Supplements
- Medical Supplies
- Personal Care
- Uncategorized (fallback)

### 2. Generate Product Image

Generate AI-powered product images using Gemini 2.5 Flash Image Preview.

**Request:**
```json
{
  "action": "generate-image",
  "productName": "Eucerin Advanced Repair Cream",
  "category": "Skin Care",
  "imagePrompt": "Ultra high resolution product photography of Eucerin Advanced Repair Cream. Elegant skincare product bottle/jar on minimalist marble surface with soft natural lighting, premium cosmetic packaging, clean white background with subtle shadows. Professional beauty product photography."
}
```

**Response (Success):**
```json
{
  "success": true,
  "imageUrl": "https://rgehleqcubtmcwyipyvi.supabase.co/storage/v1/object/public/product-images/products/1234567890-Eucerin-Advanced-Repair-Cream.png"
}
```

**Response (Rate Limited):**
```json
{
  "error": "Rate limited. Please wait before generating more images.",
  "retryAfter": 60
}
```

**Notes:**
- Images are stored in Supabase Storage bucket `product-images`
- Base64 fallback provided if storage upload fails
- Rate limits apply based on Lovable API key tier

### 3. Create Shopify Product

Create a product in Shopify using the Admin API.

**Request:**
```json
{
  "action": "create-shopify-product",
  "product": {
    "title": "Eucerin Advanced Repair Cream",
    "body": "Intensive moisturizing cream for dry skin",
    "vendor": "Eucerin",
    "product_type": "Skin Care",
    "tags": "moisturizer,dry-skin,face-care",
    "sku": "PROD-001",
    "price": "24.99",
    "imageUrl": "https://example.com/image.png"
  }
}
```

**Response:**
```json
{
  "success": true,
  "productId": 8234567890,
  "handle": "eucerin-advanced-repair-cream"
}
```

**Error Response (Rate Limited):**
```json
{
  "error": "Rate limited by Shopify. Please wait.",
  "retryAfter": 60
}
```

**Shopify Configuration:**
- Store: `lovable-project-milns.myshopify.com`
- API Version: `2025-01`
- Requires: `SHOPIFY_ACCESS_TOKEN` secret

### 4. AI Categorize (Advanced)

Use AI for smarter product categorization (experimental).

**Request:**
```json
{
  "action": "ai-categorize",
  "productNames": [
    "Palmer's Cocoa Butter Formula",
    "Vichy Liftactiv Serum",
    "Maybelline Mascara"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "name": "Palmer's Cocoa Butter Formula",
      "category": "Body Care",
      "brand": "Palmer's"
    },
    {
      "name": "Vichy Liftactiv Serum",
      "category": "Skin Care",
      "brand": "Vichy"
    },
    {
      "name": "Maybelline Mascara",
      "category": "Make Up",
      "brand": "Maybelline"
    }
  ]
}
```

**Notes:**
- Uses Gemini 3 Flash Preview model
- More accurate than keyword matching
- Higher API cost than simple categorization

## Usage Examples

### cURL - Categorize Products

```bash
curl -i --location --request POST \
  'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload' \
  --header 'Authorization: Bearer YOUR_ADMIN_JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "action": "categorize",
    "products": [
      {
        "sku": "TEST-001",
        "name": "Test Moisturizer",
        "costPrice": 10.00,
        "sellingPrice": 15.99
      }
    ]
  }'
```

### TypeScript - Generate Image

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function generateProductImage(
  productName: string,
  category: string,
  imagePrompt: string
) {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(
    'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generate-image',
        productName,
        category,
        imagePrompt
      })
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return response.json()
}
```

### JavaScript - Create Shopify Product

```javascript
async function createShopifyProduct(productData, authToken) {
  const response = await fetch(
    'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create-shopify-product',
        product: productData
      })
    }
  )

  const result = await response.json()
  
  if (result.success) {
    console.log(`Product created with ID: ${result.productId}`)
    console.log(`Handle: ${result.handle}`)
  } else {
    console.error('Failed to create product:', result.error)
  }

  return result
}
```

## Local Development

### Setup

1. **Start Supabase:**
   ```bash
   supabase start
   ```

2. **Create local secrets file:**
   ```bash
   cat > .env.local << EOF
   LOVABLE_API_KEY=your_local_key
   SHOPIFY_ACCESS_TOKEN=your_local_token
   EOF
   ```

3. **Serve function:**
   ```bash
   supabase functions serve bulk-product-upload --no-verify-jwt --env-file .env.local
   ```

### Test Locally

```bash
# Get admin JWT token from your local Supabase
# Then test categorization:
curl -i --location --request POST \
  'http://localhost:54321/functions/v1/bulk-product-upload' \
  --header 'Authorization: Bearer YOUR_LOCAL_ADMIN_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{
    "action": "categorize",
    "products": [
      {
        "sku": "TEST-001",
        "name": "Test Product",
        "costPrice": 10,
        "sellingPrice": 15
      }
    ]
  }'
```

## Deployment

```bash
# Set production secrets first
supabase secrets set LOVABLE_API_KEY=your_production_key
supabase secrets set SHOPIFY_ACCESS_TOKEN=your_production_token

# Deploy the function
supabase functions deploy bulk-product-upload

# Verify secrets are set
supabase secrets list
```

## Security

### Admin Access Control
- Function verifies user authentication via JWT
- Checks `user_roles` table for admin role
- Uses service role key to bypass RLS for role checking
- Returns 403 Forbidden if user is not admin

### Data Access
- Service role client used for storage operations
- Bypasses Row Level Security policies
- Should only be accessible by verified admins

### API Keys
- All custom secrets encrypted at rest
- Never logged or exposed in responses
- Accessed only via `Deno.env.get()`

### Best Practices
- Never commit secrets to git
- Rotate API keys periodically
- Monitor function logs for unauthorized access attempts
- Implement rate limiting in client applications

## Error Handling

### Common Errors

#### 401 Unauthorized
```json
{
  "error": "Unauthorized: Missing or invalid token"
}
```
**Solution:** Provide valid JWT token in Authorization header

#### 403 Forbidden
```json
{
  "error": "Forbidden: Admin access required for bulk operations"
}
```
**Solution:** Ensure user has admin role in `user_roles` table

#### 400 Bad Request
```json
{
  "error": "Invalid action"
}
```
**Solution:** Use valid action: categorize, generate-image, create-shopify-product, or ai-categorize

#### 429 Rate Limited
```json
{
  "error": "Rate limited. Please wait before generating more images.",
  "retryAfter": 60
}
```
**Solution:** Implement exponential backoff and retry logic

#### 500 Internal Server Error
```json
{
  "error": "Specific error message"
}
```
**Solution:** Check function logs in Supabase dashboard

## Rate Limits

### Lovable AI Gateway
- Varies by API key tier
- Image generation typically more expensive than text
- Monitor usage in Lovable dashboard

### Shopify Admin API
- 2 requests per second by default
- 40 requests per second burst
- Returns 429 with Retry-After header

### Recommended Practices
- Batch operations when possible
- Implement client-side rate limiting
- Use exponential backoff for retries
- Cache results when appropriate

## Storage

### Product Images Bucket

**Bucket name:** `product-images`

**Path structure:** `products/{timestamp}-{sanitized-product-name}.png`

**Public access:** Enabled (images are publicly accessible via URL)

**Setup:**
```sql
-- Create bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT DO NOTHING;

-- Set public access policy
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

## Monitoring

### Key Metrics
- Authentication failures (401/403 errors)
- Rate limit hits (429 errors)
- Image generation success rate
- Shopify API errors
- Average processing time per action

### Logs Location
Supabase Dashboard → Edge Functions → bulk-product-upload → Logs

### Alerting
Consider setting up alerts for:
- High error rates (>5%)
- Rate limit hits
- Authorization failures
- Shopify API errors

## Troubleshooting

### "LOVABLE_API_KEY is not configured"
```bash
# Set the secret
supabase secrets set LOVABLE_API_KEY=your_key

# Verify
supabase secrets list

# Redeploy
supabase functions deploy bulk-product-upload
```

### "SHOPIFY_ACCESS_TOKEN is not configured"
- Only needed for `create-shopify-product` action
- Other actions will work without it
- Set via: `supabase secrets set SHOPIFY_ACCESS_TOKEN=your_token`

### Admin Role Not Working
```sql
-- Verify user role
SELECT * FROM user_roles WHERE user_id = 'your-user-id';

-- Add admin role if missing
INSERT INTO user_roles (user_id, role) 
VALUES ('your-user-id', 'admin');
```

### Image Upload Fails
- Check that `product-images` bucket exists
- Verify bucket is public
- Check storage quotas in Supabase dashboard
- Function returns base64 image as fallback

## Configuration

Function settings in `supabase/config.toml`:

```toml
[functions.bulk-product-upload]
verify_jwt = false  # Custom verification in code
```

## Future Enhancements

- Batch image generation with progress tracking
- Product description generation via AI
- Multi-language product data support
- Integration with additional e-commerce platforms
- Advanced image editing options
- Product SEO optimization
- Inventory sync with Shopify
- Automated pricing suggestions
