import { CheckCircle2, FileCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClinicalCertificationProps {
  certifications?: string[];
  variant?: "compact" | "detailed";
  className?: string;
}

export const ClinicalCertification = ({
  certifications = [
    "Clinically Tested",
    "Dermatologist Approved",
    "Hypoallergenic",
  ],
  variant = "compact",
  className = "",
}: ClinicalCertificationProps) => {
  const { language } = useLanguage();

  const defaultCertifications = {
    en: {
      clinicallyTested: "Clinically Tested",
      dermatologistApproved: "Dermatologist Approved",
      hypoallergenic: "Hypoallergenic",
      fragranceFree: "Fragrance Free",
      nonComedogenic: "Non-Comedogenic",
      parabenfree: "Paraben Free",
    },
    ar: {
      clinicallyTested: "مختبر سريريًا",
      dermatologistApproved: "معتمد من أطباء الجلدية",
      hypoallergenic: "مضاد للحساسية",
      fragranceFree: "خالي من العطور",
      nonComedogenic: "غير كوميدوغينيك",
      parabenfree: "خالي من البارابين",
    },
  };

  if (variant === "compact") {
    return (
      <div
        className={`pillar-transparency-section ${className}`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="pillar-transparency-label mb-2">
              {language === "en" ? "Clinical Certifications" : "الشهادات السريرية"}
            </h5>
            <ul className="space-y-1">
              {certifications.map((cert, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-foreground/80"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // detailed variant
  return (
    <div
      className={`medical-elite-card space-y-4 ${className}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-3 border-b border-gold/20 pb-3">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
          <FileCheck className="w-5 h-5 text-gold" />
        </div>
        <h4 className="font-display text-lg font-semibold text-primary">
          {language === "en" ? "Clinical Certifications" : "الشهادات السريرية"}
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 rounded-lg bg-asper-stone/30 border border-gold/10"
          >
            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-foreground">{cert}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
