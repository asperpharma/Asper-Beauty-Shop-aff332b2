import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuxurySectionHeader } from "./LuxurySectionHeader";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { TrendingUp } from "lucide-react";
import { ProductGridSection } from "./ProductGridSection";

export const TrendingProducts = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrendingProducts = async () => {
      try {
        setLoading(true);
        // Fetch products and look for bestseller tags or high-demand items
        const allProducts = await fetchProducts(50);

        // Filter for products with bestseller tags or trending indicators
        const trendingProducts = allProducts.filter((product) => {
          const tags = (product.node as any).tags || [];
          if (Array.isArray(tags)) {
            return tags.some((tag: string) =>
              tag.toLowerCase().includes("bestseller") ||
              tag.toLowerCase().includes("trending") ||
              tag.toLowerCase().includes("popular")
            );
          }
          return false;
        });

        // If not enough tagged products, take popular ones (first 8)
        const displayProducts = trendingProducts.length >= 8
          ? trendingProducts.slice(0, 8)
          : allProducts.slice(0, 8);

        setProducts(displayProducts);
      } catch (error) {
        console.error("Failed to fetch trending products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingProducts();
  }, []);

  return (
    <ProductGridSection
      header={
        <LuxurySectionHeader
          icon={TrendingUp}
          scriptText="Trending Now"
          scriptTextAr="الأكثر طلباً"
          title={isArabic ? "المنتجات" : "What's"}
          titleHighlight={isArabic ? "المميزة" : "Trending"}
          description={isArabic
            ? "اكتشفي المنتجات الأكثر طلباً من عملائنا"
            : "Discover what our customers are loving right now"}
          iconSize="md"
        />
      }
      products={products}
      loading={loading}
      viewAll={{
        to: "/best-sellers",
        label: isArabic ? "عرض جميع المميزات" : "View All Trending Products",
      }}
      emptyMessage={
        isArabic
          ? "لا توجد منتجات متاحة حالياً"
          : "No trending products available at the moment"
      }
      sectionClassName="py-20 lg:py-32 bg-cream border-y border-gold/10 relative overflow-hidden"
      containerClassName="luxury-container relative"
      topAccent
      bottomAccent={false}
    />
  );
};
