import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "./AnimatedSection";

interface LuxurySectionHeaderProps {
  icon?: LucideIcon;
  scriptText?: string;
  scriptTextAr?: string;
  title: string;
  titleAr?: string;
  titleHighlight?: string;
  titleHighlightAr?: string;
  description?: string;
  descriptionAr?: string;
  animation?: "slide-up" | "fade-up" | "zoom";
  delay?: number;
  className?: string;
  showDivider?: boolean;
  iconSize?: "sm" | "md" | "lg";
}

export const LuxurySectionHeader = ({
  icon: Icon,
  scriptText,
  scriptTextAr,
  title,
  titleAr,
  titleHighlight,
  titleHighlightAr,
  description,
  descriptionAr,
  animation = "slide-up",
  delay = 0,
  className = "",
  showDivider = true,
  iconSize = "md",
}: LuxurySectionHeaderProps) => {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const iconSizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };

  const iconInnerSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-8 h-8",
  };

  return (
    <AnimatedSection 
      className={`text-center mb-12 ${className}`} 
      animation={animation} 
      duration={800}
      delay={delay}
    >
      {/* Icon Badge with Luxury Gold Accent */}
      {Icon && (
        <div className="flex justify-center mb-6">
          <div className={`${iconSizes[iconSize]} relative rounded-full bg-gradient-to-br from-gold/20 via-gold/10 to-transparent border-2 border-gold/40 flex items-center justify-center shadow-gold-badge hover:shadow-gold-badge-hover transition-all duration-500 group`}>
            {/* Inner glow effect */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Icon */}
            {Icon && (
              <Icon className={`${iconInnerSizes[iconSize]} text-gold relative z-10 transition-transform duration-500 group-hover:scale-110`} strokeWidth={2} />
            )}
            {/* Shine effect on hover */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-opacity duration-700" />
          </div>
        </div>
      )}

      {/* Script Text */}
      {(scriptText || scriptTextAr) && (
        <span className="font-script text-2xl md:text-3xl text-gold mb-4 block tracking-wide">
          {isArabic ? scriptTextAr : scriptText}
        </span>
      )}

      {/* Main Title with Gold Highlight */}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight tracking-tight">
        {isArabic ? (
          <>
            {titleAr}
            {titleHighlightAr && (
              <> <span className="text-gold relative inline-block">
                {titleHighlightAr}
                {/* Elegant underline accent */}
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
              </span></>
            )}
          </>
        ) : (
          <>
            {title}
            {titleHighlight && (
              <> <span className="text-gold relative inline-block">
                {titleHighlight}
                {/* Elegant underline accent */}
                <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
              </span></>
            )}
          </>
        )}
      </h2>

      {/* Luxury Divider with Gold Gradient */}
      {showDivider && (
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-gold/80 to-transparent relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold to-transparent blur-sm opacity-50" />
            {/* Center accent */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
          </div>
        </div>
      )}

      {/* Description */}
      {(description || descriptionAr) && (
        <p className="font-body text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {isArabic ? descriptionAr : description}
        </p>
      )}
    </AnimatedSection>
  );
};