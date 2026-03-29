import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LuxurySectionHeader } from "./LuxurySectionHeader";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { Sparkles } from "lucide-react";
import { ProductGridSection } from "./ProductGridSection";

export const NewArrivals = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewProducts = async () => {
      try {
        setLoading(true);
        // Fetch products and filter for new arrivals (created within last 30 days)
        const allProducts = await fetchProducts(50);

        const now = Date.now();
        const thirtyDaysAgo = 30 * 24 * 60 * 60 * 1000;

        const newProducts = allProducts.filter((product) => {
          const createdAt = (product.node as any).createdAt;
          if (!createdAt) return false;
          const createdTime = new Date(createdAt).getTime();
          return (now - createdTime) < thirtyDaysAgo;
        });

        // Sort by creation date (newest first) and take 8
        const sortedNew = newProducts
          .sort((a, b) => {
            const dateA = new Date((a.node as any).createdAt || 0).getTime();
            const dateB = new Date((b.node as any).createdAt || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 8);

        setProducts(sortedNew);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNewProducts();
  }, []);

  return (
    <ProductGridSection
      header={
        <LuxurySectionHeader
          icon={Sparkles}
          scriptText="Just Launched"
          scriptTextAr="وصل حديثاً"
          title={isArabic ? "وصل حديثاً" : "New"}
          titleHighlight={isArabic ? "أحدث الإطلالات" : "Arrivals"}
          description={isArabic
            ? "اكتشفي أحدث المنتجات التي وصلت إلى مجموعتنا الفاخرة"
            : "Discover the latest additions to our luxury collection"}
          iconSize="md"
        />
      }
      products={products}
      loading={loading}
      viewAll={{
        to: "/collections",
        label: isArabic
          ? "عرض جميع المنتجات الجديدة"
          : "View All New Arrivals",
      }}
      emptyMessage={
        isArabic
          ? "لا توجد منتجات جديدة حالياً"
          : "No new arrivals at the moment"
      }
      sectionClassName="py-20 lg:py-32 bg-white border-y border-gold/10 relative overflow-hidden"
      containerClassName="luxury-container relative"
      topAccent
      bottomAccent={false}
    />
  );
};
