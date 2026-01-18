import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LuxuryBackgroundProps {
  className?: string;
}

export const LuxuryBackground = ({ className }: LuxuryBackgroundProps) => {
  const { language } = useLanguage();

  return (
    <div className={cn("luxury-background-wrapper", className)}>
      {/* Background Image Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Beautiful Lady Face Background - Subtle and Elegant */}
        <div 
          className="absolute inset-0 opacity-[0.08] md:opacity-[0.12] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/luxury-beauty-background.jpg')`,
            backgroundPosition: language === 'ar' ? 'right center' : 'left center',
            filter: 'sepia(20%) saturate(60%) brightness(95%) contrast(110%)',
          }}
        />
        
        {/* Gradient Overlay - Blends with website colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream/40 via-transparent to-cream/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream/50" />
        
        {/* Gold Accent Overlay - Subtle luxury touch */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};
