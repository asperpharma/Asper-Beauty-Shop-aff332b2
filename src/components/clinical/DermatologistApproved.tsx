import { Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DermatologistApprovedProps {
  variant?: "badge" | "card" | "inline";
  showIcon?: boolean;
  className?: string;
}

export const DermatologistApproved = ({
  variant = "badge",
  showIcon = true,
  className = "",
}: DermatologistApprovedProps) => {
  const { t, language } = useLanguage();

  const text = {
    en: "Dermatologist Approved",
    ar: "معتمد من أطباء الجلدية",
  };

  const description = {
    en: "Clinically tested and approved by dermatology experts",
    ar: "مختبر سريريًا ومعتمد من قبل خبراء الأمراض الجلدية",
  };

  if (variant === "badge") {
    return (
      <div
        className={`clinical-badge inline-flex items-center gap-2 ${className}`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        {showIcon && <Shield className="w-3.5 h-3.5" />}
        <span className="text-xs font-medium">
          {text[language as keyof typeof text]}
        </span>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`medical-elite-card ${className}`}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-start gap-4">
          {showIcon && (
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h4 className="font-display text-lg font-semibold text-primary mb-2">
              {text[language as keyof typeof text]}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description[language as keyof typeof description]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // inline variant
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-primary font-medium text-sm ${className}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {showIcon && <Shield className="w-4 h-4" />}
      {text[language as keyof typeof text]}
    </span>
  );
};
