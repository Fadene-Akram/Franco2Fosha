import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ConfidenceScore } from "./ConfidenceScore";
import { AlternativesDisplay } from "./AlternativesDisplay";
import { FeedbackSection } from "./FeedbackSection";

interface Alternative {
  text: string;
  confidence: number;
}

interface OutputDisplayProps {
  input: string;
  output: string;
  outputType: "darija" | "msa";
  confidence: number;
  alternatives: Alternative[];
  selectedAltIndex: number;
  onAlternativeSelect: (index: number) => void;
}

export const OutputDisplay = ({
  input,
  output,
  outputType,
  confidence,
  alternatives,
  selectedAltIndex,
  onAlternativeSelect,
}: OutputDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t, isArabic } = useLanguage();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast({
      title: t("output.copied"),
      description: "Text copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!output) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Confidence Score */}
      <div className="border-2 p-4 bg-muted/30">
        <h4 className={`text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3 ${isArabic ? "font-arabic text-right" : ""}`}>
          {isArabic ? "مستوى الثقة" : "Confidence Level"}
        </h4>
        <ConfidenceScore score={confidence} />
      </div>

      <div className="border-t-2 pt-8">
        <h3 className={`text-sm font-medium uppercase tracking-wide mb-4 ${isArabic ? "font-arabic text-right" : ""}`}>
          {isArabic ? "مقارنة جنباً إلى جنب" : "Side-by-Side Comparison"}
        </h3>

        <div className={`grid md:grid-cols-2 gap-4 ${isArabic ? "direction-rtl" : ""}`}>
          <div className="border-2 p-6 bg-muted/50">
            <div className={`flex items-center justify-between mb-3 ${isArabic ? "flex-row-reverse" : ""}`}>
              <span className={`text-xs font-medium uppercase tracking-wide text-muted-foreground ${isArabic ? "font-arabic" : ""}`}>
                {isArabic ? "الأصلي (أرابيزي)" : "Original (Arabizi)"}
              </span>
              <span className="text-xs font-mono bg-secondary px-2 py-1">LTR</span>
            </div>
            <p className="font-mono text-lg leading-relaxed" dir="ltr">
              {input}
            </p>
          </div>

          <div className="border-2 p-6 bg-primary/5 shadow-sm">
            <div className={`flex items-center justify-between mb-3 ${isArabic ? "flex-row-reverse" : ""}`}>
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground font-arabic">
                {outputType === "darija" ? "الدارجة الجزائرية" : "العربية الفصحى"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-secondary px-2 py-1">RTL</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-6 px-2"
                >
                  {copied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
            <p className={`text-xl leading-relaxed ${isArabic ? "font-arabic" : "font-serif"}`} dir="rtl">
              {output}
            </p>
          </div>
        </div>
      </div>

      {/* Alternatives Section */}
      {alternatives.length > 1 && (
        <div className="border-2 p-4">
          <AlternativesDisplay
            alternatives={alternatives}
            selectedIndex={selectedAltIndex}
            onSelect={onAlternativeSelect}
          />
        </div>
      )}

      <div className="border-2 p-6">
        <div className={`flex items-center justify-between mb-3 ${isArabic ? "flex-row-reverse" : ""}`}>
          <span className={`text-xs font-medium uppercase tracking-wide text-muted-foreground ${isArabic ? "font-arabic" : ""}`}>
            {isArabic ? "المخرج الكامل" : "Full Output"}
          </span>
          <span className="text-xs px-2 py-1 bg-secondary font-medium uppercase">
            {outputType === "darija" ? "Darija" : "MSA"}
          </span>
        </div>
        <p className={`text-2xl leading-relaxed ${isArabic ? "font-arabic" : "font-serif"}`} dir="rtl">
          {output}
        </p>
      </div>

      {/* Feedback Section */}
      <div className="border-2 p-4 bg-muted/20">
        <FeedbackSection input={input} output={output} />
      </div>
    </div>
  );
};
