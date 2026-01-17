import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldCheck, Stethoscope, Truck } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const trustItems = [
  {
    id: 'authentic',
    icon: ShieldCheck,
    title: 'Guaranteed Authentic',
    titleAr: 'أصالة مضمونة',
    description: 'We compete against fakes',
    descriptionAr: 'نحارب المنتجات المقلدة',
  },
  {
    id: 'pharmacist',
    icon: Stethoscope,
    title: 'Pharmacist Verified',
    titleAr: 'معتمد من الصيدلي',
    description: 'We are experts',
    descriptionAr: 'خبراء متخصصون',
  },
  {
    id: 'delivery',
    icon: Truck,
    title: 'Amman Concierge Delivery',
    titleAr: 'توصيل سريع في عمّان',
    description: 'We are fast',
    descriptionAr: 'سرعة فائقة',
  },
];

export const TrustBanner = () => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="py-8 bg-burgundy overflow-hidden">
      <div className="luxury-container">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {trustItems.map((item, index) => (
            <AnimatedSection 
              key={item.id} 
              animation={index === 0 ? "fade-left" : index === 2 ? "fade-right" : "fade-up"}
              delay={index * 100}
            >
              <div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <item.icon className="w-8 h-8 text-gold" strokeWidth={1.5} />
                </div>
                <div className={`${isArabic ? 'text-right' : 'text-left'}`}>
                  <h3 className="font-display text-sm lg:text-base text-cream">
                    {isArabic ? item.titleAr : item.title}
                  </h3>
                  <p className="font-body text-xs text-cream/70">
                    {isArabic ? item.descriptionAr : item.description}
                  </p>
                </div>
                
                {/* Separator - hidden on last item and mobile */}
                {index < trustItems.length - 1 && (
                  <div className="hidden md:block w-px h-10 bg-gold/30 ml-8" />
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
