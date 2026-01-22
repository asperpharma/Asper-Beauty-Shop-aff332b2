import { memo, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import { Eye, Heart, ShoppingBag, Sparkles, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { QuickViewModal } from "./QuickViewModal";
import { getLocalizedDescription, translateTitle } from "@/lib/productUtils";
import { OptimizedImage } from "./OptimizedImage";
import { ProductImagePlaceholder } from "./ProductImagePlaceholder";
import { categorizeProduct } from "@/lib/categoryMapping";

interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = memo(({ product }: ProductCardProps) => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { node } = product;
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { t, language } = useLanguage();

  const isWishlisted = isInWishlist(node.id);

  const firstVariant = node.variants.edges[0]?.node;
  const firstImage = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  // Memoize badge calculations
  const { isBestseller, isNewArrival, isOnSale, discountPercent, brand, productCategory } = useMemo(() => {
    // Check for badges based on tags
    const tags = (node as any).tags || [];
    const bestseller = Array.isArray(tags)
      ? tags.some((tag: string) => tag.toLowerCase().includes("bestseller"))
      : typeof tags === "string" && tags.toLowerCase().includes("bestseller");

    // Check if product is new (created within last 30 days)
    const createdAt = (node as any).createdAt;
    const newArrival = createdAt
      ? (Date.now() - new Date(createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000
      : false;

    // Check for sale/discount
    const compareAtPrice = firstVariant?.compareAtPrice;
    const currentPrice = parseFloat(firstVariant?.price?.amount || price.amount);
    const originalPrice = compareAtPrice
      ? parseFloat(compareAtPrice.amount)
      : null;
    const onSale = originalPrice && originalPrice > currentPrice;
    const discount = onSale
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

    // Extract brand from vendor or title
    const brandName = (node as any).vendor || node.title.split(" ")[0];
    
    // Get category for display (memoize this expensive operation)
    const category = categorizeProduct(
      node.title,
      node.productType,
      node.vendor,
    );

    return {
      isBestseller: bestseller,
      isNewArrival: newArrival,
      isOnSale: onSale,
      discountPercent: discount,
      brand: brandName,
      productCategory: category,
    };
  }, [node, firstVariant, price.amount]);

  // Memoize price calculations
  const { currentPrice, originalPrice } = useMemo(() => {
    const compareAtPrice = firstVariant?.compareAtPrice;
    const current = parseFloat(firstVariant?.price?.amount || price.amount);
    const original = compareAtPrice
      ? parseFloat(compareAtPrice.amount)
      : null;
    
    return {
      currentPrice: current,
      originalPrice: original,
    };
  }, [firstVariant, price.amount]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!firstVariant) return;

    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });

    toast.success(t.addedToBag, {
      description: node.title,
      position: "top-center",
    });

    setCartOpen(true);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);

    if (!isWishlisted) {
      toast.success("Added to wishlist", {
        description: node.title,
        position: "top-center",
      });
    }
  };

  return (
    <Link to={`/product/${node.handle}`} className="group block">
      {/* Luxury Card Container - Enhanced with slow, cinematic transitions */}
      <div className="bg-white overflow-hidden transition-all duration-700 ease-in-out border border-gray-100 group-hover:border-gold/30 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-gold-hover-lg">
        {/* Image Container with slow zoom effect */}
        <div className="aspect-[3/4] bg-secondary overflow-hidden relative">
          {firstImage
            ? (
              <>
                <OptimizedImage
                  src={firstImage.url}
                  alt={firstImage.altText || node.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                  width={400}
                  height={400}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </>
            )
            : (
              <ProductImagePlaceholder
                title={node.title}
                brand={brand}
                category={productCategory}
                className="group-hover:border-gold/20 transition-all duration-700"
              />
            )}

          {/* Gold Badge Icons */}
          {(isBestseller || isNewArrival || isOnSale) && (
            <div className="absolute top-2 md:top-3 left-2 md:left-3 z-20 flex flex-col gap-1.5">
              {isBestseller && (
                <div
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gold flex items-center justify-center shadow-md"
                  title="Bestseller"
                >
                  <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-burgundy fill-burgundy" />
                </div>
              )}
              {isNewArrival && !isBestseller && (
                <div
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gold flex items-center justify-center shadow-md"
                  title="New Arrival"
                >
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-burgundy" />
                </div>
              )}
              {isOnSale && (
                <div className="px-2 py-1 bg-burgundy text-white font-body text-[10px] md:text-xs tracking-wide rounded-full shadow-md">
                  -{discountPercent}%
                </div>
              )}
            </div>
          )}

          {/* Wishlist Button - Always visible on mobile */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 md:top-3 right-2 md:right-3 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-400 ${
              isWishlisted
                ? "bg-gold text-burgundy"
                : "bg-white/80 text-muted-foreground md:opacity-0 md:group-hover:opacity-100 hover:bg-gold hover:text-burgundy"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>

          {/* Luxury Quick Add Button - Appears on hover with slow animation */}
          <div className="hidden md:flex absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-[#1A1A1A] text-white hover:bg-gold hover:text-[#1A1A1A] rounded-none py-4 font-serif text-sm tracking-[0.2em] uppercase transition-all duration-500 shadow-gold-button-hover"
            >
              <ShoppingBag className="w-4 h-4 me-2" />
              {language === "ar"
                ? "إضافة إلى السلة"
                : `Add to Bag — ${price.currencyCode} ${
                  currentPrice.toFixed(2)
                }`}
            </Button>
          </div>

          {/* Quick View Button - Hidden on mobile */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="hidden md:flex absolute bottom-14 right-3 z-20 w-9 h-9 rounded-full bg-white/80 items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-gold hover:text-burgundy transition-all duration-400"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Content - Luxury Typography & Spacing */}
        <div className="p-6 md:p-8 bg-white text-center space-y-3">
          {/* Category Badge - Wide Letter Spacing (Luxury Fashion Style) */}
          <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase">
            {productCategory.replace("-", " ")}
          </p>

          {/* Brand Name - Minimalist */}
          <p className="font-body text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.15em] opacity-70">
            {brand}
          </p>

          {/* Product Title - Serif Font, Hover Gold */}
          <h3 className="font-serif text-base md:text-lg text-[#1A1A1A] group-hover:text-gold transition-colors duration-300 line-clamp-2 leading-relaxed">
            {translateTitle(node.title, language)}
          </h3>

          {/* Price - Elegant Display */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {isOnSale && originalPrice && (
              <p className="font-body text-sm text-muted-foreground line-through opacity-60">
                {price.currencyCode} {originalPrice.toFixed(2)}
              </p>
            )}
            <p
              className={`font-serif text-lg md:text-xl font-semibold ${
                isOnSale ? "text-burgundy" : "text-[#1A1A1A]"
              }`}
            >
              {price.currencyCode} {currentPrice.toFixed(2)}
            </p>
          </div>

          {/* Optional: Star Rating (Luxury Touch) */}
          <div className="flex justify-center gap-1 opacity-60 pt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-gold text-gold" />
            ))}
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </Link>
  );
});
