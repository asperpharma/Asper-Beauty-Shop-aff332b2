# Product Reference Guide - Beauty Box & iHerb

This document provides reference information from Beauty Box (beautyboxjo.com) and iHerb Jordan (jo.iherb.com) to help format products that don't have images and to use as a reference for product information, pricing, and styling.

## Reference Websites

1. **Beauty Box Jordan**: https://beautyboxjo.com/
   - Premium beauty and skincare products
   - Same product types as Asper Beauty Shop
   - Similar pricing structure (Jordanian Dinars - JOD)
   - Professional product layout and formatting

2. **iHerb Jordan**: https://jo.iherb.com/
   - Health, beauty, and wellness products
   - Comprehensive product information
   - Detailed product descriptions
   - Similar product categories

## Product Information Reference Structure

### From Beauty Box Style:

**Product Card Format:**
```
- Product Image (or elegant placeholder)
- Brand Name (uppercase, tracking-widest)
- Product Title (2 lines max, line-clamp-2)
- Price Display:
  - Original Price (if on sale, line-through)
  - Current Price (bold, larger font)
  - Currency: JOD (Jordanian Dinars)
- Badges: Sale %, Bestseller, New
- Rating: 4.X / 5.0 (X reviews)
```

**Product Detail Page Format:**
```
- Large Product Image Gallery (sticky left column)
- Product Title (h1, large)
- Brand Name
- Price (large, bold)
- Rating & Reviews
- Short Description
- Variant Selection (Size, Color, etc.)
- Quantity Selector
- Add to Cart Button
- Full Product Description
- Related Products
```

### Key Product Fields to Reference:

1. **Product Title Format**
   - Full product name including brand and type
   - Example: "Eucerin Sun Hydro Protect Ultra-Light Fluid SPF50+ 50ml"
   - Keep technical specifications in title

2. **Brand/Vendor**
   - Display prominently above product title
   - Uppercase, small font, tracking-widest
   - Examples: Eucerin, Vichy, La Roche-Posay, Cetaphil

3. **Product Categories**
   - Skin Care: Cleansers, Moisturizers, Serums, Sunscreen, Creams, Eye Cream, Toner, Mask, Scrub, Peeling
   - Make Up: Face, Eye, Lip, Cheek
   - Hair Care: Shampoo, Conditioner, Hair Mask, Leave-in, Styling
   - Body Care: Body Wash, Body Lotion, Hand Care, Foot Care
   - Fragrances: Perfume For Her, Perfume For Him, Perfume Sets

4. **Price Formatting**
   - Currency: JOD (Jordanian Dinars)
   - Format: "XX.XXX JD" (3 decimal places)
   - Sale prices: Show original (line-through) + current price
   - Discount badge: "-XX%" in red/burgundy

5. **Product Images**
   - White background for product photos
   - Clean, professional product shots
   - Multiple angles/views available
   - High quality, optimized for web

## Product Without Image Formatting

When products don't have images, use elegant placeholders matching Beauty Box/iHerb style:

### Placeholder Design Elements:

1. **Brand/Product Initials Circle**
   - Large circular badge with brand initials (e.g., "LR" for La Roche-Posay)
   - Gold accent border
   - Gradient background (cream to gold)
   - Shadow with gold tint

2. **Category Indicator**
   - Small badge showing product category
   - Uppercase, tracking-widest
   - Gold accent colors

3. **Decorative Elements**
   - Sparkles icons for elegance
   - Subtle pattern overlay
   - Corner accent decorations
   - Gold glow effects

### Implementation:

The `ProductImagePlaceholder` component is already created and automatically:
- Extracts brand initials from product title or vendor
- Shows category badge when available
- Applies luxury gold-accented styling
- Matches Beauty Box/iHerb elegant aesthetic

## Product Data Structure Reference

### Common Product Information Fields:

```typescript
{
  title: string;              // Full product name
  vendor: string;             // Brand name (e.g., "Eucerin", "Vichy")
  productType: string;        // Category (e.g., "Serum", "Moisturizer")
  description: string;        // Product description
  price: {
    amount: string;           // Price in JOD
    currencyCode: string;     // "JOD"
  };
  compareAtPrice?: {          // Original price if on sale
    amount: string;
    currencyCode: string;
  };
  tags: string[];             // ["bestseller", "new-arrival", etc.]
  variants: Array<{
    title: string;            // Variant name
    price: {...};
    compareAtPrice?: {...};
    selectedOptions: Array<{
      name: string;           // "Color", "Size", etc.
      value: string;          // Option value
    }>;
  }>;
  images: Array<{
    url: string;
    altText?: string;
  }>;
}
```

## Pricing Reference

### Typical Price Ranges (from Beauty Box):

- **Basic Products**: 3-8 JOD (Essence, Note brands)
- **Mid-Range Products**: 8-20 JOD (Bourjois, Isadora, Bioten)
- **Premium Products**: 20-40 JOD (Eucerin, Vichy, Cetaphil)
- **Luxury Products**: 40+ JOD (Higher-end skincare, perfumes)

### Sale Price Formatting:

- Original price: `22.900 JD` (line-through, muted color)
- Sale price: `16.000 JD` (bold, burgundy/gold color)
- Discount: `-30% OFF` badge

## Image Placeholder Specifications

### When Product Has No Image:

1. **Show Brand Initials Circle**
   - Extract from vendor or first letters of title
   - Example: "LR" for "La Roche-Posay"
   - Example: "EU" for "Eucerin"

2. **Display Category Badge**
   - Show product category (Serum, Moisturizer, etc.)
   - Helps identify product type visually

3. **Apply Luxury Styling**
   - Cream gradient background
   - Gold accent borders and decorations
   - Subtle pattern overlay
   - Matching website color palette

### Placeholder Styling Features:

- **Background**: Gradient cream tones matching site
- **Border**: Gold accent (border-gold/10)
- **Initials Circle**: Gold border with shadow
- **Decorative Elements**: Sparkles, lines, corner accents
- **Category Badge**: Gold-tinted with rounded corners

## Product Listing Format

### Grid Layout (Like Beauty Box):

```
[Product Card]
├─ Image/Placeholder (aspect-square)
├─ Brand Name (small, uppercase)
├─ Product Title (2 lines max)
├─ Price Display
│  ├─ Original Price (if sale)
│  └─ Current Price (bold)
└─ Action Buttons (on hover)
```

### Card Styling:

- White background
- Rounded corners
- Gold border on hover
- Shadow with gold tint
- Smooth transitions

## Missing Information Fallback

If product information is missing, reference these sites:

1. **Product Descriptions**: Copy from Beauty Box or iHerb
2. **Product Specifications**: Reference size, ingredients from sites
3. **Product Categories**: Match categorization from Beauty Box
4. **Product Images**: Reference image URLs or use elegant placeholder

## Quick Reference Links

- **Beauty Box Home**: https://beautyboxjo.com/
- **iHerb Jordan**: https://jo.iherb.com/
- **Search**: Use site search to find specific products
- **Product Pages**: Check product detail pages for full information

## Integration Notes

The product display system automatically:
- ✅ Formats products without images using elegant placeholders
- ✅ Shows brand names and categories
- ✅ Displays prices in JOD format
- ✅ Handles sale prices with discount badges
- ✅ Matches Beauty Box/iHerb styling aesthetic

All products are displayed consistently, whether they have images or not.
