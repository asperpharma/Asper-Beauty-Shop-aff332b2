import { Award, Beaker } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MedicalGradeBadgeProps {
  grade?: "pharmaceutical" | "clinical" | "dermatological";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const MedicalGradeBadge = ({
  grade = "clinical",
  size = "md",
  className = "",
}: MedicalGradeBadgeProps) => {
  const { language } = useLanguage();

  const gradeText = {
    pharmaceutical: {
      en: "Pharmaceutical Grade",
      ar: "درجة صيدلانية",
    },
    clinical: {
      en: "Clinical Grade",
      ar: "درجة سريرية",
    },
    dermatological: {
      en: "Dermatological Grade",
      ar: "درجة جلدية",
    },
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSize = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const Icon = grade === "pharmaceutical" ? Beaker : Award;

  return (
    <div
      className={`pillar-resilience-badge inline-flex items-center gap-1.5 ${sizeClasses[size]} ${className}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Icon className={iconSize[size]} />
      <span className="font-semibold">
        {gradeText[grade][language as keyof typeof gradeText[typeof grade]]}
      </span>
    </div>
  );
};
