import { ReactNode } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { AnimatedSection } from "./AnimatedSection";
import { ProductCard } from "./ProductCard";
import { ShopifyProduct } from "@/lib/shopify";
import { ChevronRight, Loader2 } from "lucide-react";

interface ProductGridSectionProps {
  header: ReactNode;
  products: ShopifyProduct[];
  loading: boolean;
  viewAll: {
    to: string;
    label: string;
  };
  emptyMessage?: string;
  sectionClassName?: string;
  containerClassName?: string;
  topAccent?: boolean;
  bottomAccent?: boolean;
  hideOnEmpty?: boolean;
}

export const ProductGridSection = ({
  header,
  products,
  loading,
  viewAll,
  emptyMessage,
  sectionClassName = "py-20 lg:py-32 bg-cream border-y border-gold/10 relative overflow-hidden",
  containerClassName = "luxury-container relative",
  topAccent = true,
  bottomAccent = false,
  hideOnEmpty = false,
}: ProductGridSectionProps) => {
  const isEmpty = !loading && products.length === 0;

  if (hideOnEmpty && isEmpty) {
    return null;
  }

  return (
    <section className={sectionClassName}>
      {topAccent && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      )}
      {bottomAccent && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      )}
      <div className={containerClassName}>
        {header}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : products.length > 0 ? (
          <>
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

            <AnimatedSection
              animation="zoom"
              delay={800}
              duration={800}
              className="text-center"
            >
              <Link
                to={viewAll.to}
                className={clsx(
                  "inline-flex items-center gap-2 font-body text-sm text-foreground hover:text-gold transition-colors duration-400 uppercase tracking-widest group border-b border-transparent hover:border-gold pb-1",
                )}
              >
                {viewAll.label}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          </>
        ) : (
          emptyMessage && (
            <div className="text-center py-12">
              <p className="font-body text-muted-foreground">{emptyMessage}</p>
            </div>
          )
        )}
      </div>
    </section>
  );
};
