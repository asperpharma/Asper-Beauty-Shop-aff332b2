import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SiteLayout } from "@/components/SiteLayout";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Brands from "./pages/Brands";
import BrandVichy from "./pages/BrandVichy";
import BestSellers from "./pages/BestSellers";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import SkinConcerns from "./pages/SkinConcerns";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Philosophy from "./pages/Philosophy";
import BulkUpload from "./pages/BulkUpload";
import AdminOrders from "./pages/AdminOrders";
import Tracking from "./pages/Tracking";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Consultation from "./pages/Consultation";
import { RequireAdmin } from "./components/RequireAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <SiteLayout>
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
          </SiteLayout>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
