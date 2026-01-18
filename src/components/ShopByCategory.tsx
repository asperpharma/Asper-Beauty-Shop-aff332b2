import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "./AnimatedSection";
import { LuxurySectionHeader } from "./LuxurySectionHeader";
import { CATEGORIES } from "@/lib/categoryMapping";
import { ChevronRight, Sparkles, Star, Tag, Grid3x3 } from "lucide-react";

// Category icons/images
import skinCareImg from "@/assets/categories/skin-care.webp";
import hairCareImg from "@/assets/categories/hair-care.webp";
import bodyCareImg from "@/assets/categories/body-care.webp";
import makeUpImg from "@/assets/categories/make-up.webp";
import fragrancesImg from "@/assets/categories/fragrances.webp";
import toolsDevicesImg from "@/assets/categories/tools-devices.webp";

const categoryImages: Record<string, string> = {
  'skin-care': skinCareImg,
  'hair-care': hairCareImg,
  'body-care': bodyCareImg,
  'make-up': makeUpImg,
  'fragrances': fragrancesImg,
  'tools-devices': toolsDevicesImg,
};

export const ShopByCategory = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // Order categories for display
  const categoryOrder = ['skin-care', 'make-up', 'hair-care', 'body-care', 'fragrances', 'tools-devices'];
  const categories = categoryOrder.map(slug => ({
    ...CATEGORIES[slug],
    image: categoryImages[slug],
  }));

  // Quick navigation links
  const quickLinks = [
    { name: 'New Arrivals', nameAr: 'وصل حديثاً', href: '/collections?filter=new', icon: Sparkles },
    { name: 'Best Sellers', nameAr: 'الأكثر مبيعاً', href: '/best-sellers', icon: Star },
    { name: 'On Sale', nameAr: 'تخفيضات', href: '/collections?filter=sale', icon: Tag },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white border-b border-gold/10 relative overflow-hidden">
      {/* Decorative gold accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="luxury-container relative">
        {/* Luxury Section Header */}
        <LuxurySectionHeader
          icon={Grid3x3}
          scriptText="Shop by Category"
          scriptTextAr="تسوق حسب الفئة"
          title={isArabic ? "اكتشفي" : "Discover Our"}
          titleHighlight={isArabic ? "مجموعاتنا" : "Collections"}
          description={isArabic 
            ? 'كل منتج في مكانه الصحيح. تصفحي مجموعتنا الفاخرة المنظمة بدقة'
            : 'Every product in its place. Browse our carefully curated luxury collections'}
          iconSize="md"
        />

        {/* Quick Navigation Links Bar - Luxury styling */}
        <AnimatedSection animation="fade-up" delay={100} duration={800} className="mb-16">
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group relative flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-cream via-cream to-white border-2 border-gold/30 rounded-full hover:border-gold hover:bg-gradient-to-br hover:from-gold/10 hover:via-gold/5 hover:to-cream transition-all duration-500 shadow-gold-lg hover:shadow-gold-hover overflow-hidden"
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-opacity duration-700" />
                  <Icon className="w-5 h-5 text-gold relative z-10 group-hover:scale-110 transition-transform duration-500" />
                  <span className="font-body text-sm uppercase tracking-widest text-foreground relative z-10 group-hover:text-gold transition-colors duration-500">
                    {isArabic ? link.nameAr : link.name}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gold relative z-10 group-hover:translate-x-1 transition-transform duration-500" />
                </Link>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Categories Grid - Organized like Ulta/Cult Beauty */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <AnimatedSection 
              key={category.slug} 
              animation="fade-up" 
              delay={index * 100}
              duration={900}
            >
              <Link
                to={`/collections/${category.slug}`}
                className="group block"
              >
                {/* Luxury Category Card */}
                <div className="relative overflow-hidden aspect-square border-2 border-gold/20 hover:border-gold/60 transition-all duration-700 bg-cream/30 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-gold/20 group/card">
                  {/* Gold border glow on hover */}
                  <div className="absolute inset-0 border-2 border-gold/0 group-hover/card:border-gold/40 rounded-xl transition-all duration-700 -z-10" />
                  
                  {/* Category Image */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <img
                      src={category.image}
                      alt={isArabic ? category.titleAr : category.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-125"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent" />
                  </div>
                  
                  {/* Category Info Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-5 lg:p-7 text-center">
                    <h3 className="font-display text-lg lg:text-xl text-cream mb-3 group-hover/card:text-gold transition-colors duration-700 font-semibold drop-shadow-lg">
                      {isArabic ? category.titleAr : category.title}
                    </h3>
                    
                    {/* Luxury Hover Button */}
                    <div className="mt-3 opacity-0 group-hover/card:opacity-100 transition-all duration-700 transform translate-y-4 group-hover/card:translate-y-0">
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-gold/90 text-burgundy font-body text-xs uppercase tracking-widest rounded-full shadow-gold-button hover:shadow-gold-button-hover transition-all duration-500">
                        {isArabic ? 'تسوق' : 'Shop'}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/card:opacity-100 transform -skew-x-12 transition-opacity duration-1000 rounded-xl" />
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {/* View All Collections Link */}
        <AnimatedSection animation="zoom" delay={700} duration={800} className="text-center mt-12">
          <Link 
            to="/collections" 
            className="inline-flex items-center gap-2 font-body text-sm text-foreground hover:text-gold transition-colors duration-400 uppercase tracking-widest group border-b border-transparent hover:border-gold pb-1"
          >
            {isArabic ? 'عرض جميع المجموعات' : 'View All Collections'}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};