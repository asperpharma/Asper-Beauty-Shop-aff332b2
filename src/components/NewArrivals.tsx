import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "./AnimatedSection";
import { LuxurySectionHeader } from "./LuxurySectionHeader";
import { ProductCard } from "./ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ChevronRight, Loader2, Sparkles } from "lucide-react";

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
    <section className="py-20 lg:py-32 bg-white border-y border-gold/10 relative overflow-hidden">
      {/* Decorative gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="luxury-container relative">
        {/* Luxury Section Header */}
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

        {loading
          ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          )
          : products.length > 0
          ? (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                {products.map((product, index) => (
                  <AnimatedSection
                    key={product.node.id}
                    animation="fade-up"
                    delay={index * 100}
                    duration={800}
                  >
                    <ProductCard product={product} />
                  </AnimatedSection>
                ))}
              </div>

              {/* View All Link */}
              <AnimatedSection
                animation="zoom"
                delay={800}
                duration={800}
                className="text-center"
              >
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 font-body text-sm text-foreground hover:text-gold transition-colors duration-400 uppercase tracking-widest group border-b border-transparent hover:border-gold pb-1"
                >
                  {isArabic
                    ? "عرض جميع المنتجات الجديدة"
                    : "View All New Arrivals"}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </AnimatedSection>
            </>
          )
          : (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">
                {isArabic
                  ? "لا توجد منتجات جديدة حالياً"
                  : "No new arrivals at the moment"}
              </p>
            </div>
          )}
      </div>
    </section>
  );
};
