import { useLanguage } from "@/contexts/LanguageContext";

interface ConfidenceScoreProps {
  score: number; // 0-100
}

export const ConfidenceScore = ({ score }: ConfidenceScoreProps) => {
  const { isArabic } = useLanguage();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return isArabic ? "ثقة عالية" : "High Confidence";
    if (score >= 60) return isArabic ? "ثقة متوسطة" : "Medium Confidence";
    return isArabic ? "ثقة منخفضة" : "Low Confidence";
  };

  return (
    <div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
      <div className="flex-1 h-2 bg-muted border rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
        <span className={`text-sm font-medium ${isArabic ? "font-arabic" : ""}`}>
          {getScoreLabel(score)}
        </span>
        <span className="text-sm font-mono text-muted-foreground">
          {score}%
        </span>
      </div>
    </div>
  );
};
