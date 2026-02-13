import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "./AnimatedSection";
import { ProductCard } from "./ProductCard";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { categorizeProduct } from "@/lib/categoryMapping";
import { CATEGORIES } from "@/lib/categoryMapping";
import {
  ChevronRight,
  Droplets,
  Heart,
  Loader2,
  Scissors,
  Sparkles,
} from "lucide-react";

interface FeaturedProductsByCategoryProps {
  categorySlug: string;
  limit?: number;
}

const FeaturedProductsCategory = (
  { categorySlug, limit = 4 }: FeaturedProductsByCategoryProps,
) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryInfo = CATEGORIES[categorySlug];

  useEffect(() => {
    // Early return inside useEffect instead of before it
    if (!categoryInfo) return;
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Fetch more products to ensure we get enough in the category
        const allProducts = await fetchProducts(50);

        // Filter products by category
        const categoryProducts = allProducts.filter((product) => {
          const productCategory = categorizeProduct(
            product.node.title,
            product.node.productType,
            product.node.vendor,
          );
          return productCategory === categorySlug;
        });

        // Take only the requested limit
        setProducts(categoryProducts.slice(0, limit));
      } catch (error) {
        console.error(`Failed to fetch ${categorySlug} products:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categorySlug, limit, categoryInfo]);

  // Early returns after hooks
  if (!categoryInfo) return null;

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-cream">
        <div className="luxury-container">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  // Alternate background colors for better organization
  const bgClass = categorySlug === "skin-care"
    ? "bg-white"
    : categorySlug === "make-up"
    ? "bg-cream"
    : "bg-white";

  // Category icons
  const categoryIcons: Record<string, typeof Sparkles> = {
    "skin-care": Droplets,
    "make-up": Sparkles,
    "hair-care": Scissors,
  };

  const CategoryIcon = categoryIcons[categorySlug] || Sparkles;

  return (
    <section
      className={`py-16 lg:py-24 ${bgClass} border-y border-gold/10 relative overflow-hidden`}
    >
      {/* Decorative gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="luxury-container relative">
        {/* Section Header with Luxury Icon Badge and Gold Accents */}
        <div className="flex items-center justify-between mb-12 pb-6 border-b-2 border-gold/20">
          <div className="flex items-center gap-6">
            {/* Luxury Icon Badge */}
            <div className="w-16 h-16 relative rounded-full bg-gradient-to-br from-gold/20 via-gold/10 to-transparent border-2 border-gold/40 flex items-center justify-center shadow-gold-badge hover:shadow-gold-badge-hover group/icon">
              {/* Inner glow effect */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
              <CategoryIcon
                className="w-7 h-7 text-gold relative z-10 transition-transform duration-500 group-hover/icon:scale-110"
                strokeWidth={2}
              />
              {/* Shine effect on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/icon:opacity-100 transform -skew-x-12 transition-opacity duration-700" />
            </div>
            <div>
              <h3 className="font-display text-3xl lg:text-4xl text-foreground mb-2 leading-tight">
                <span className="text-gold relative inline-block">
                  {isArabic ? categoryInfo.titleAr : categoryInfo.title}
                  {/* Elegant underline accent */}
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
                </span>
              </h3>
              <p className="font-body text-base text-muted-foreground max-w-2xl leading-relaxed">
                {isArabic
                  ? categoryInfo.descriptionAr
                  : categoryInfo.description}
              </p>
            </div>
          </div>
          <Link
            to={`/collections/${categorySlug}`}
            className="hidden md:flex items-center gap-2 px-6 py-3 border-2 border-gold/30 hover:border-gold bg-transparent hover:bg-gold/5 rounded-full font-body text-xs text-foreground hover:text-gold transition-all duration-500 uppercase tracking-widest group shadow-gold-sm hover:shadow-gold-hover"
          >
            {isArabic ? "عرض الكل" : "View All"}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
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

        {/* Mobile View All Link - Luxury Styled */}
        <div className="md:hidden text-center mt-8">
          <Link
            to={`/collections/${categorySlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gold/30 hover:border-gold bg-transparent hover:bg-gold/5 rounded-full font-body text-xs text-foreground hover:text-gold transition-all duration-500 uppercase tracking-widest group shadow-gold-sm hover:shadow-gold-hover"
          >
            {isArabic ? "عرض الكل" : "View All"}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export const FeaturedProductsByCategory = () => {
  // Show featured products for key categories
  const featuredCategories = ["skin-care", "make-up", "hair-care"];

  return (
    <>
      {featuredCategories.map((categorySlug, index) => (
        <FeaturedProductsCategory
          key={categorySlug}
          categorySlug={categorySlug}
          limit={4}
        />
      ))}
    </>
  );
};
