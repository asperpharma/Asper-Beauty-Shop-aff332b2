/**
 * Product Category Audit Script
 *
 * Analyzes Shopify products and identifies category mismatches based on keywords.
 * Since Shopify Storefront API is read-only, this generates a report.
 *
 * Run with: npx tsx scripts/audit-categories.ts
 *
 * Prerequisites:
 * - Ensure Shopify credentials are in .env or shopify.ts
 * - This script uses the same Shopify connection as the app
 */

import { fetchProductsPaginated, ShopifyProduct } from "../src/lib/shopify";
import { CATEGORIES, categorizeProduct } from "../src/lib/categoryMapping";
import * as fs from "fs";
import * as path from "path";

// Category rules for auditing (more comprehensive than basic categorization)
const CATEGORY_RULES = {
  "skin-care": [
    "cleanser",
    "toner",
    "serum",
    "moisturizer",
    "cream",
    "face",
    "facial",
    "skin",
    "acne",
    "anti-aging",
    "hydrating",
    "gel",
    "spf",
    "sunscreen",
    "retinol",
    "vitamin c",
    "niacinamide",
    "hyaluronic",
    "eye cream",
    "mask",
    "scrub",
    "peeling",
    "essence",
    "ampoule",
    "normaderm",
    "cetaphil",
    "svr",
    "vichy",
    "bioten",
    "bio balance",
    "eucerin",
    "isdin",
    "avene",
    "la roche",
    "dermaceutic",
  ],
  "hair-care": [
    "shampoo",
    "conditioner",
    "hair",
    "scalp",
    "frizz",
    "mask",
    "keratin",
    "treatment",
    "oil",
    "amino",
    "raghad",
    "cantu",
    "petal fresh",
    "argan",
    "jojoba",
    "leave-in",
    "styling",
    "hair color",
    "henna",
    "dry shampoo",
  ],
  "make-up": [
    "mascara",
    "lipstick",
    "foundation",
    "eyeshadow",
    "blush",
    "concealer",
    "makeup",
    "make-up",
    "lip",
    "eye",
    "eyeliner",
    "eyebrow",
    "powder",
    "primer",
    "palette",
    "bourjois",
    "essence",
    "isadora",
    "lash",
    "note",
    "pastel",
    "anastasia",
    "bb cream",
    "cc cream",
    "highlighter",
    "contour",
  ],
  "body-care": [
    "body",
    "lotion",
    "scrub",
    "wash",
    "soap",
    "hand",
    "foot",
    "sunscreen",
    "sun",
    "spf",
    "bepanthen",
    "eucerin",
    "body wash",
    "shower gel",
    "body lotion",
    "body oil",
    "deodorant",
    "intimate care",
  ],
  "fragrances": [
    "perfume",
    "fragrance",
    "cologne",
    "mist",
    "eau de",
    "scent",
    "aroma",
    "versace",
    "burberry",
    "carolina herrera",
    "lancome",
    "narciso rodriguez",
  ],
  "tools-devices": [
    "tool",
    "device",
    "brush",
    "sponge",
    "applicator",
    "whitening",
    "smilest",
    "mavala",
    "double lash",
    "nail",
    "polish",
    "remover",
    "dental",
    "toothbrush",
  ],
};

interface AuditResult {
  product: {
    id: string;
    title: string;
    handle: string;
    vendor?: string;
    productType?: string;
  };
  currentCategory: string;
  suggestedCategory: string;
  confidence: number;
  keywords: string[];
}

async function auditCategories() {
  console.log("💎 Starting Luxury Product Category Audit...\n");
  console.log("📦 Fetching products from Shopify...\n");

  try {
    // Fetch all products
    const allProducts: ShopifyProduct[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const result = await fetchProductsPaginated(50, cursor);
      if (!result) break;

      allProducts.push(...result.products);
      hasNextPage = result.pageInfo.hasNextPage;
      cursor = result.pageInfo.endCursor || null;

      console.log(`   ✓ Fetched ${allProducts.length} products so far...`);
    }

    console.log(`\n📊 Analyzing ${allProducts.length} products...\n`);

    const auditResults: AuditResult[] = [];
    const categoryStats: Record<
      string,
      { correct: number; incorrect: number }
    > = {};

    // Initialize stats
    Object.keys(CATEGORIES).forEach((cat) => {
      categoryStats[cat] = { correct: 0, incorrect: 0 };
    });

    for (const product of allProducts) {
      const { node } = product;
      const text = `${node.title} ${node.description || ""} ${
        node.vendor || ""
      } ${node.productType || ""}`.toLowerCase();

      // Get current category (from productType or categorizeProduct function)
      const currentCategory = node.productType
        ? Object.keys(CATEGORIES).find((slug) =>
          CATEGORIES[slug].title.toLowerCase() ===
            node.productType?.toLowerCase() ||
          slug === node.productType?.toLowerCase().replace(/\s+/g, "-")
        ) || categorizeProduct(node.title, node.productType, node.vendor)
        : categorizeProduct(node.title, node.productType, node.vendor);

      // Detect category based on keyword matching
      let suggestedCategory = currentCategory;
      let maxMatches = 0;
      let matchedKeywords: string[] = [];

      for (const [categorySlug, keywords] of Object.entries(CATEGORY_RULES)) {
        const matches = keywords.filter((k) => text.includes(k.toLowerCase()));
        if (matches.length > maxMatches) {
          maxMatches = matches.length;
          suggestedCategory = categorySlug;
          matchedKeywords = matches;
        }
      }

      // Calculate confidence (0-100)
      const confidence = Math.min(100, Math.round((maxMatches / 3) * 100));

      // Check if there's a mismatch
      if (suggestedCategory !== currentCategory && confidence > 30) {
        auditResults.push({
          product: {
            id: node.id,
            title: node.title,
            handle: node.handle,
            vendor: node.vendor,
            productType: node.productType,
          },
          currentCategory,
          suggestedCategory,
          confidence,
          keywords: matchedKeywords.slice(0, 5), // Top 5 keywords
        });

        categoryStats[suggestedCategory].incorrect++;
      } else {
        categoryStats[currentCategory].correct++;
      }
    }

    // Generate Report
    console.log("=".repeat(80));
    console.log("📋 AUDIT REPORT");
    console.log("=".repeat(80));
    console.log(
      `\n✅ Correctly Categorized: ${allProducts.length - auditResults.length}`,
    );
    console.log(`⚠️  Needs Review: ${auditResults.length}\n`);

    if (auditResults.length > 0) {
      console.log("⚠️  PRODUCTS THAT MAY NEED CATEGORY UPDATES:\n");

      // Group by suggested category
      const grouped = auditResults.reduce((acc, result) => {
        if (!acc[result.suggestedCategory]) {
          acc[result.suggestedCategory] = [];
        }
        acc[result.suggestedCategory].push(result);
        return acc;
      }, {} as Record<string, AuditResult[]>);

      for (const [category, results] of Object.entries(grouped)) {
        console.log(
          `\n📁 ${
            CATEGORIES[category]?.title || category.toUpperCase()
          } (${results.length} products):`,
        );
        console.log("-".repeat(80));

        results
          .sort((a, b) => b.confidence - a.confidence)
          .forEach((result, idx) => {
            console.log(`\n${idx + 1}. ${result.product.title}`);
            console.log(`   Current: ${result.currentCategory} ❌`);
            console.log(
              `   Suggested: ${result.suggestedCategory} ✅ (${result.confidence}% confidence)`,
            );
            console.log(`   Keywords: ${result.keywords.join(", ")}`);
            console.log(`   Handle: ${result.product.handle}`);
            if (result.product.vendor) {
              console.log(`   Brand: ${result.product.vendor}`);
            }
          });
      }
    }

    // Category Statistics
    console.log("\n\n📊 CATEGORY STATISTICS:\n");
    for (const [category, stats] of Object.entries(categoryStats)) {
      const total = stats.correct + stats.incorrect;
      if (total > 0) {
        const accuracy = Math.round((stats.correct / total) * 100);
        console.log(
          `   ${
            CATEGORIES[category]?.title || category
          }: ${stats.correct} correct, ${stats.incorrect} needs review (${accuracy}% accuracy)`,
        );
      }
    }

    // Save detailed report to file
    const reportPath = path.join(process.cwd(), "category-audit-report.json");
    const report = {
      generatedAt: new Date().toISOString(),
      totalProducts: allProducts.length,
      needsReview: auditResults.length,
      correctlyCategorized: allProducts.length - auditResults.length,
      results: auditResults,
      statistics: categoryStats,
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);

    console.log("\n" + "=".repeat(80));
    console.log("🎉 Audit Complete!");
    console.log("=".repeat(80));
    console.log("\n💡 Next Steps:");
    console.log("   1. Review the products listed above");
    console.log("   2. Update product categories in Shopify Admin");
    console.log("   3. Use the JSON report for bulk updates if needed");
    console.log("\n");
  } catch (error) {
    console.error("❌ Error during audit:", error);
    process.exit(1);
  }
}

// Run the audit
auditCategories();
