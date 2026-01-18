# Product Category Audit Script

## Overview

The `audit-categories.ts` script analyzes all products in your Shopify store and identifies category mismatches based on keyword analysis. It generates a comprehensive report to help you organize your product catalog.

## Prerequisites

1. **Install tsx** (if not already installed):
   ```bash
   npm install -D tsx
   ```

2. **Shopify Configuration**: Ensure your Shopify credentials are properly configured in `src/lib/shopify.ts`

## Usage

Run the audit script:

```bash
npx tsx scripts/audit-categories.ts
```

## What It Does

1. **Fetches All Products**: Connects to your Shopify store and retrieves all products
2. **Analyzes Categories**: Uses keyword matching to detect the correct category for each product
3. **Identifies Mismatches**: Compares detected category with current category
4. **Generates Report**: Creates a detailed report showing:
   - Products that may need category updates
   - Confidence scores for each suggestion
   - Keywords that matched
   - Category statistics

## Output

The script generates:

1. **Console Report**: Real-time output showing:
   - Total products analyzed
   - Products needing review
   - Detailed breakdown by category
   - Statistics per category

2. **JSON Report**: Saved to `category-audit-report.json` with:
   - Timestamp
   - Complete product list with suggestions
   - Confidence scores
   - Category statistics

## Category Rules

The script uses comprehensive keyword matching for:

- **Skin Care**: cleanser, serum, moisturizer, acne, retinol, SPF, etc.
- **Hair Care**: shampoo, conditioner, scalp, treatment, etc.
- **Make Up**: mascara, lipstick, foundation, eyeshadow, etc.
- **Body Care**: body lotion, body wash, hand cream, etc.
- **Fragrances**: perfume, cologne, eau de, scent, etc.
- **Tools & Devices**: brush, tool, device, whitening, etc.

## Next Steps

After running the audit:

1. Review the console output and JSON report
2. Update product categories in Shopify Admin for products with high confidence scores (>70%)
3. Manually review products with lower confidence scores
4. Re-run the script periodically to maintain category accuracy

## Notes

- The script is **read-only** - it doesn't modify your Shopify store
- Updates must be made manually in Shopify Admin
- Confidence scores help prioritize which products to review first
- The script respects Shopify API rate limits
