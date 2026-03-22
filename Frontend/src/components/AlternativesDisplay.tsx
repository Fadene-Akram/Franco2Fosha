import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface Alternative {
  text: string;
  confidence: number;
}

interface AlternativesDisplayProps {
  alternatives: Alternative[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const AlternativesDisplay = ({
  alternatives,
  selectedIndex,
  onSelect,
}: AlternativesDisplayProps) => {
  const { isArabic } = useLanguage();

  if (alternatives.length <= 1) return null;

  return (
    <div className="space-y-3">
      <h4
        className={`text-xs font-medium uppercase tracking-wide text-muted-foreground ${isArabic ? "font-arabic text-right" : ""}`}
      >
        {isArabic ? "بدائل أخرى" : "Alternative Transliterations"}
      </h4>
      <div className="flex flex-wrap gap-2">
        {alternatives.map((alt, index) => (
          <Button
            key={index}
            variant={selectedIndex === index ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(index)}
            className={`flex items-center gap-2 font-arabic text-base border-2 ${
              selectedIndex === index ? "" : "hover:bg-muted"
            }`}
            dir="rtl"
          >
            {selectedIndex === index && <Check className="w-3 h-3" />}
            <span>{alt.text}</span>
            <span className="text-xs opacity-70 font-mono">
              ({alt.confidence.toFixed(2)}%)
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
