# TRAY API Documentation

## Overview

The TRAY API (Bulk Product Upload) is a Supabase Edge Function that enables bulk product management operations for the Asper Beauty Shop. It provides functionality for categorizing products, generating AI product images, and creating products in Shopify.

**Base URL**: `https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload`

## Authentication

The function accepts two authentication methods. Authentication is handled by Supabase at the gateway level.

### Method 1: Authorization Bearer Token (Recommended)

Use a valid Supabase user access token obtained through authentication:

```bash
Authorization: Bearer <USER_ACCESS_TOKEN>
```

### Method 2: API Key

Use the Supabase anonymous key:

```bash
apikey: <SUPABASE_ANON_KEY>
```

**Note**: Both methods require the authenticated user to have **admin role** in the `user_roles` table. Non-admin users will receive a `403 Forbidden` error.

## API Endpoints

The TRAY API uses a single endpoint with different `action` parameters to perform various operations.

### 1. Categorize Products

Automatically categorize products from Excel/CSV data based on product names and keywords.

#### Request

**Action**: `categorize`

**Body Parameters**:
- `action` (string): Must be `"categorize"`
- `products` (array): Array of product objects with:
  - `sku` (string): Product SKU
  - `name` (string): Product name
  - `costPrice` (number): Cost price
  - `sellingPrice` (number): Selling price

#### cURL Example

```bash
curl -X POST 'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "categorize",
    "products": [
      {
        "sku": "VICHY-001",
        "name": "Vichy Mineral 89 Hyaluronic Acid Face Moisturizer",
        "costPrice": 15.50,
        "sellingPrice": 25.99
      },
      {
        "sku": "EUCE-002",
        "name": "Eucerin Advanced Repair Hand Cream",
        "costPrice": 8.00,
        "sellingPrice": 12.99
      }
    ]
  }'
```

#### Node.js Example

```javascript
const supabase = createClient(
  'https://rgehleqcubtmcwyipyvi.supabase.co',
  'YOUR_ANON_KEY'
);

// Get user session token
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(
  'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'categorize',
      products: [
        {
          sku: 'VICHY-001',
          name: 'Vichy Mineral 89 Hyaluronic Acid Face Moisturizer',
          costPrice: 15.50,
          sellingPrice: 25.99
        },
        {
          sku: 'EUCE-002',
          name: 'Eucerin Advanced Repair Hand Cream',
          costPrice: 8.00,
          sellingPrice: 12.99
        }
      ]
    })
  }
);

const data = await response.json();
console.log(data);
```

#### Response

```json
{
  "success": true,
  "products": [
    {
      "sku": "VICHY-001",
      "name": "Vichy Mineral 89 Hyaluronic Acid Face Moisturizer",
      "category": "Skin Care",
      "brand": "Vichy",
      "price": 25.99,
      "costPrice": 15.50,
      "imagePrompt": "Ultra high resolution product photography of Vichy Mineral 89...",
      "status": "pending"
    },
    {
      "sku": "EUCE-002",
      "name": "Eucerin Advanced Repair Hand Cream",
      "category": "Body Care",
      "brand": "Eucerin",
      "price": 12.99,
      "costPrice": 8.00,
      "imagePrompt": "Ultra high resolution product photography of Eucerin...",
      "status": "pending"
    }
  ],
  "summary": {
    "total": 2,
    "categories": {
      "Skin Care": 1,
      "Body Care": 1
    },
    "brands": {
      "Vichy": 1,
      "Eucerin": 1
    }
  }
}
```

---

### 2. Generate Product Image

Generate a high-quality product image using AI based on product details.

#### Request

**Action**: `generate-image`

**Body Parameters**:
- `action` (string): Must be `"generate-image"`
- `productName` (string): Product name
- `category` (string): Product category
- `imagePrompt` (string): AI image generation prompt

#### cURL Example

```bash
curl -X POST 'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "generate-image",
    "productName": "Vichy Mineral 89 Hyaluronic Acid Face Moisturizer",
    "category": "Skin Care",
    "imagePrompt": "Ultra high resolution product photography of Vichy Mineral 89 Hyaluronic Acid Face Moisturizer. Elegant skincare product bottle on minimalist marble surface with soft natural lighting, premium cosmetic packaging, clean white background with subtle shadows. Professional beauty product photography."
  }'
```

#### Node.js Example (with API Key)

```javascript
const response = await fetch(
  'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload',
  {
    method: 'POST',
    headers: {
      'apikey': 'YOUR_SUPABASE_ANON_KEY',
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'generate-image',
      productName: 'Vichy Mineral 89 Hyaluronic Acid Face Moisturizer',
      category: 'Skin Care',
      imagePrompt: 'Ultra high resolution product photography of Vichy Mineral 89...'
    })
  }
);

const data = await response.json();
console.log(data.imageUrl);
```

#### Response

```json
{
  "success": true,
  "imageUrl": "https://rgehleqcubtmcwyipyvi.supabase.co/storage/v1/object/public/product-images/products/1234567890-Vichy-Mineral-89.png"
}
```

**Rate Limiting**: If rate limited (429 status), wait 60 seconds before retrying.

---

### 3. Create Shopify Product

Create a new product in Shopify with all details and images.

#### Request

**Action**: `create-shopify-product`

**Body Parameters**:
- `action` (string): Must be `"create-shopify-product"`
- `product` (object): Product details
  - `title` (string): Product title
  - `body` (string): Product description
  - `vendor` (string): Brand/vendor name
  - `product_type` (string): Product type/category
  - `tags` (string): Comma-separated tags
  - `price` (number): Selling price
  - `sku` (string): Product SKU
  - `imageUrl` (string, optional): Product image URL

#### cURL Example

```bash
curl -X POST 'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "create-shopify-product",
    "product": {
      "title": "Vichy Mineral 89 Hyaluronic Acid Face Moisturizer",
      "body": "Intensive hydrating serum with 89% mineralizing thermal water and hyaluronic acid. Strengthens skin barrier and boosts radiance.",
      "vendor": "Vichy",
      "product_type": "Skin Care",
      "tags": "moisturizer, hyaluronic acid, serum, hydrating",
      "price": 25.99,
      "sku": "VICHY-001",
      "imageUrl": "https://example.com/vichy-mineral-89.png"
    }
  }'
```

#### Node.js Example

```javascript
const { data: { session } } = await supabase.auth.getSession();

const response = await fetch(
  'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'create-shopify-product',
      product: {
        title: 'Vichy Mineral 89 Hyaluronic Acid Face Moisturizer',
        body: 'Intensive hydrating serum with 89% mineralizing thermal water...',
        vendor: 'Vichy',
        product_type: 'Skin Care',
        tags: 'moisturizer, hyaluronic acid, serum',
        price: 25.99,
        sku: 'VICHY-001',
        imageUrl: 'https://example.com/vichy-mineral-89.png'
      }
    })
  }
);

const data = await response.json();
console.log(`Created product with ID: ${data.productId}`);
```

#### Response

```json
{
  "success": true,
  "productId": 7234567890123,
  "handle": "vichy-mineral-89-hyaluronic-acid-face-moisturizer"
}
```

---

### 4. AI-Powered Categorization

Use advanced AI to categorize products with higher accuracy.

#### Request

**Action**: `ai-categorize`

**Body Parameters**:
- `action` (string): Must be `"ai-categorize"`
- `productNames` (array): Array of product name strings

#### cURL Example

```bash
curl -X POST 'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "ai-categorize",
    "productNames": [
      "Vichy Mineral 89 Hyaluronic Acid Face Moisturizer",
      "Eucerin Advanced Repair Hand Cream",
      "Bourjois Rouge Edition Velvet Lipstick"
    ]
  }'
```

#### Node.js Example

```javascript
const response = await fetch(
  'https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/bulk-product-upload',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'ai-categorize',
      productNames: [
        'Vichy Mineral 89 Hyaluronic Acid Face Moisturizer',
        'Eucerin Advanced Repair Hand Cream',
        'Bourjois Rouge Edition Velvet Lipstick'
      ]
    })
  }
);

const data = await response.json();
```

#### Response

```json
{
  "success": true,
  "products": [
    {
      "name": "Vichy Mineral 89 Hyaluronic Acid Face Moisturizer",
      "category": "Skin Care",
      "brand": "Vichy"
    },
    {
      "name": "Eucerin Advanced Repair Hand Cream",
      "category": "Body Care",
      "brand": "Eucerin"
    },
    {
      "name": "Bourjois Rouge Edition Velvet Lipstick",
      "category": "Make Up",
      "brand": "Bourjois"
    }
  ]
}
```

---

## Categories

The API automatically categorizes products into the following categories:

- **Skin Care**: Creams, lotions, serums, moisturizers, cleansers, toners, masks, scrubs, sunscreen
- **Hair Care**: Shampoos, conditioners, treatments, oils, sprays
- **Body Care**: Body lotions, body wash, soaps, hand creams, foot care, deodorants
- **Make Up**: Mascara, lipstick, foundation, blush, eyeshadow, liners, nail polish
- **Fragrances**: Perfumes, colognes, eau de toilette, eau de parfum
- **Health & Supplements**: Vitamins, supplements, capsules, tablets, minerals
- **Medical Supplies**: Cannulas, syringes, gloves, bandages, gauze, medical devices
- **Personal Care**: Toothbrushes, toothpaste, brushes, combs, razors, cotton
- **Uncategorized**: Products that don't match any category

## Error Responses

### 401 Unauthorized

Missing or invalid authentication token:

```json
{
  "error": "Unauthorized: Missing or invalid token"
}
```

### 403 Forbidden

User is not an admin:

```json
{
  "error": "Forbidden: Admin access required for bulk operations"
}
```

### 400 Bad Request

Invalid action or missing parameters:

```json
{
  "error": "Invalid action"
}
```

### 429 Rate Limited

Too many requests:

```json
{
  "error": "Rate limited. Please wait before generating more images.",
  "retryAfter": 60
}
```

### 500 Internal Server Error

Server error:

```json
{
  "error": "Error message describing what went wrong"
}
```

## CORS

The API includes CORS headers to allow cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type
```

## Best Practices

1. **Authentication**: Always use the Authorization Bearer token method for better security
2. **Admin Role**: Ensure the authenticated user has the admin role before making requests
3. **Rate Limiting**: Implement exponential backoff for rate-limited requests (especially for image generation)
4. **Batch Processing**: For large product uploads, process in batches of 10-20 products at a time
5. **Error Handling**: Always check the response status and handle errors appropriately
6. **Image Generation**: Generate images during off-peak hours to avoid rate limits
7. **Shopify Integration**: Verify product data before creating in Shopify to avoid duplicate SKUs

## Support

For issues or questions about the TRAY API, contact:
- Email: asperpharma@gmail.com
- Phone: +962 79 065 6666

## Version History

- **v1.0.0** (2026-02): Initial API release with categorization, image generation, and Shopify integration
