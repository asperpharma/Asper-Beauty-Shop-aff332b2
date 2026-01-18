import { ShoppingBag, Sparkles } from "lucide-react";

interface ProductImagePlaceholderProps {
  title: string;
  brand?: string;
  category?: string;
  className?: string;
}

export const ProductImagePlaceholder = ({ 
  title, 
  brand, 
  category,
  className = "" 
}: ProductImagePlaceholderProps) => {
  // Extract first letter of title or brand for elegant monogram
  const firstLetter = (brand || title).charAt(0).toUpperCase();
  
  // Get initials from brand if available (e.g., "La Roche Posay" -> "LR")
  const brandInitials = brand 
    ? brand.split(' ').slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('')
    : firstLetter;

  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-cream via-cream/80 to-cream/60 relative overflow-hidden border border-gold/10 ${className}`}>
      {/* Decorative Pattern - Subtle Elegant Texture */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(212, 175, 55, 0.05) 10px,
            rgba(212, 175, 55, 0.05) 20px
          )`,
        }}
      />
      
      {/* Elegant Monogram Circle - Like Beauty Box/iHerb Style */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 p-6">
        {/* Brand/Product Initials Circle */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gold/20 via-gold/10 to-cream border-2 border-gold/30 flex items-center justify-center shadow-gold-badge group-hover:shadow-gold-badge-hover transition-all duration-500">
          <span className="font-display text-2xl md:text-3xl text-gold font-semibold">
            {brandInitials.slice(0, 2)}
          </span>
        </div>
        
        {/* Decorative Elements */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold/40" />
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <ShoppingBag className="w-4 h-4 text-gold/40" />
        </div>
        
        {/* Category Indicator (if available) */}
        {category && (
          <span className="font-body text-xs text-gold/60 uppercase tracking-widest text-center px-3 py-1 bg-gold/5 rounded-full border border-gold/10">
            {category}
          </span>
        )}
      </div>

      {/* Subtle Gold Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:via-gold/3 group-hover:to-gold/0 transition-all duration-500 pointer-events-none" />
      
      {/* Corner Accent - Elegant Touch */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tl from-gold/5 to-transparent pointer-events-none" />
    </div>
  );
};
