import { ReactNode } from "react";
import { BeautyAssistant } from "@/components/BeautyAssistant";
import { ScrollToTop } from "@/components/ScrollToTop";
import { FloatingSocials } from "@/components/FloatingSocials";

interface SiteLayoutProps {
  children: ReactNode;
}

export const SiteLayout = ({ children }: SiteLayoutProps) => {
  return (
    <>
      {children}
      <BeautyAssistant />
      <ScrollToTop />
      <FloatingSocials />
    </>
  );
};
