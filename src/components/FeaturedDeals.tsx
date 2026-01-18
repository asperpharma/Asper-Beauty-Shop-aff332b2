import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "./AnimatedSection";
import { LuxurySectionHeader } from "./LuxurySectionHeader";
import { ProductCard } from "./ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { ChevronRight, Loader2, Tag } from "lucide-react";

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
          const currentPrice = parseFloat(firstVariant?.price?.amount || product.node.priceRange.minVariantPrice.amount);
          const originalPrice = compareAtPrice ? parseFloat(compareAtPrice.amount) : null;
          
          return originalPrice && originalPrice > currentPrice;
        });

        // Sort by discount percentage and take 8
        const sortedSale = saleProducts
          .map((product) => {
            const firstVariant = product.node.variants.edges[0]?.node;
            const compareAtPrice = firstVariant?.compareAtPrice;
            const currentPrice = parseFloat(firstVariant?.price?.amount || product.node.priceRange.minVariantPrice.amount);
            const originalPrice = compareAtPrice ? parseFloat(compareAtPrice.amount) : null;
            const discount = originalPrice ? ((originalPrice - currentPrice) / originalPrice) * 100 : 0;
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

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-cream border-y border-gold/10">
        <div className="luxury-container">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 lg:py-32 bg-cream border-y border-gold/10 relative overflow-hidden">
      {/* Decorative gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="luxury-container relative">
        {/* Luxury Section Header */}
        <LuxurySectionHeader
          icon={Tag}
          scriptText="Featured Deals"
          scriptTextAr="عروض مميزة"
          title={isArabic ? "خصومات" : "Today's"}
          titleHighlight={isArabic ? "حصريّة" : "Deals"}
          description={isArabic 
            ? 'استفيدي من أفضل العروض والتخفيضات على منتجاتنا المميزة'
            : 'Don\'t miss out on our best offers and discounts on premium products'}
          iconSize="md"
        />

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
        <AnimatedSection animation="zoom" delay={800} duration={800} className="text-center">
          <Link
            to="/collections?filter=sale"
            className="inline-flex items-center gap-2 font-body text-sm text-foreground hover:text-gold transition-colors duration-400 uppercase tracking-widest group border-b border-transparent hover:border-gold pb-1"
          >
            {isArabic ? 'عرض جميع العروض' : 'View All Deals'}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};