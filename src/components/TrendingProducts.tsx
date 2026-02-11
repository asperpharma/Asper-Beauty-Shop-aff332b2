import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "./AnimatedSection";
import { LuxurySectionHeader } from "./LuxurySectionHeader";
import { ProductCard } from "./ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ChevronRight, Loader2, TrendingUp } from "lucide-react";

export const TrendingProducts = memo(() => {
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
    <section className="py-20 lg:py-32 bg-cream border-y border-gold/10 relative overflow-hidden">
      {/* Decorative gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="luxury-container relative">
        {/* Luxury Section Header */}
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
                  to="/best-sellers"
                  className="inline-flex items-center gap-2 font-body text-sm text-foreground hover:text-gold transition-colors duration-400 uppercase tracking-widest group border-b border-transparent hover:border-gold pb-1"
                >
                  {isArabic
                    ? "عرض جميع المميزات"
                    : "View All Trending Products"}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </AnimatedSection>
            </>
          )
          : (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">
                {isArabic
                  ? "لا توجد منتجات متاحة حالياً"
                  : "No trending products available at the moment"}
              </p>
            </div>
          )}
      </div>
    </section>
  );
});
