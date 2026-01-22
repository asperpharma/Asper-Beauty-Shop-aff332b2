import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";
import { RequireAdmin } from "./components/RequireAdmin";

// Lazy load all routes for code splitting
const Index = lazy(() => import("./pages/Index"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Collections = lazy(() => import("./pages/Collections"));
const CollectionDetail = lazy(() => import("./pages/CollectionDetail"));
const Brands = lazy(() => import("./pages/Brands"));
const BrandVichy = lazy(() => import("./pages/BrandVichy"));
const BestSellers = lazy(() => import("./pages/BestSellers"));
const Offers = lazy(() => import("./pages/Offers"));
const Contact = lazy(() => import("./pages/Contact"));
const SkinConcerns = lazy(() => import("./pages/SkinConcerns"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Account = lazy(() => import("./pages/Account"));
const Philosophy = lazy(() => import("./pages/Philosophy"));
const BulkUpload = lazy(() => import("./pages/BulkUpload"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const Tracking = lazy(() => import("./pages/Tracking"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Returns = lazy(() => import("./pages/Returns"));
const Consultation = lazy(() => import("./pages/Consultation"));

const queryClient = new QueryClient();

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-soft-ivory">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-shiny-gold" />
      <p className="font-body text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:handle" element={<ProductDetail />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:slug" element={<CollectionDetail />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/brands/vichy" element={<BrandVichy />} />
              <Route path="/best-sellers" element={<BestSellers />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/skin-concerns" element={<SkinConcerns />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/account" element={<Account />} />
              <Route path="/philosophy" element={<Philosophy />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route
                path="/admin/bulk-upload"
                element={
                  <RequireAdmin>
                    <BulkUpload />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <RequireAdmin>
                    <AdminOrders />
                  </RequireAdmin>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
