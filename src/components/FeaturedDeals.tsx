import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuxurySectionHeader } from "./LuxurySectionHeader";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Tag } from "lucide-react";
import { ProductGridSection } from "./ProductGridSection";

export const FeaturedDeals = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSaleProducts = async () => {
      try {
        setLoading(true);
        // Fetch products and filter for those on sale
        const allProducts = await fetchProducts(50);

        const saleProducts = allProducts.filter((product) => {
          const firstVariant = product.node.variants.edges[0]?.node;
          const compareAtPrice = firstVariant?.compareAtPrice;
          const currentPrice = parseFloat(
            firstVariant?.price?.amount ||
              product.node.priceRange.minVariantPrice.amount,
          );
          const originalPrice = compareAtPrice
            ? parseFloat(compareAtPrice.amount)
            : null;

          return originalPrice && originalPrice > currentPrice;
        });

        // Sort by discount percentage and take 8
        const sortedSale = saleProducts
          .map((product) => {
            const firstVariant = product.node.variants.edges[0]?.node;
            const compareAtPrice = firstVariant?.compareAtPrice;
            const currentPrice = parseFloat(
              firstVariant?.price?.amount ||
                product.node.priceRange.minVariantPrice.amount,
            );
            const originalPrice = compareAtPrice
              ? parseFloat(compareAtPrice.amount)
              : null;
            const discount = originalPrice
              ? ((originalPrice - currentPrice) / originalPrice) * 100
              : 0;
            return { product, discount };
          })
          .sort((a, b) => b.discount - a.discount)
          .slice(0, 8)
          .map(({ product }) => product);

        setProducts(sortedSale);
      } catch (error) {
        console.error("Failed to fetch sale products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSaleProducts();
  }, []);

  return (
    <ProductGridSection
      header={
        <LuxurySectionHeader
          icon={Tag}
          scriptText="Featured Deals"
          scriptTextAr="عروض مميزة"
          title={isArabic ? "خصومات" : "Today's"}
          titleHighlight={isArabic ? "حصريّة" : "Deals"}
          description={isArabic
            ? "استفيدي من أفضل العروض والتخفيضات على منتجاتنا المميزة"
            : "Don't miss out on our best offers and discounts on premium products"}
          iconSize="md"
        />
      }
      products={products}
      loading={loading}
      viewAll={{
        to: "/collections?filter=sale",
        label: isArabic ? "عرض جميع العروض" : "View All Deals",
      }}
      emptyMessage={undefined}
      sectionClassName="py-20 lg:py-32 bg-cream border-y border-gold/10 relative overflow-hidden"
      containerClassName="luxury-container relative"
      topAccent
      bottomAccent
      hideOnEmpty
    />
  );
};
