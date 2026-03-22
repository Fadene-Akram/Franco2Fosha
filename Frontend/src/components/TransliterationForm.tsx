import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  ArrowLeft,
  Languages,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type OutputType = "darija" | "msa";

interface TransliterationFormProps {
  onTransliterate: (text: string, outputType: OutputType) => void;
  onClear: () => void;
  isLoading?: boolean;
}

// Check if text contains Arabic characters
const containsArabic = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicRegex.test(text);
};

export const TransliterationForm = ({
  onTransliterate,
  onClear,
  isLoading,
}: TransliterationFormProps) => {
  const [inputText, setInputText] = useState("");
  const [outputType, setOutputType] = useState<OutputType>("darija");
  const [hasArabicError, setHasArabicError] = useState(false);
  const { t, isArabic } = useLanguage();

  const handleInputChange = (value: string) => {
    setInputText(value);
    setHasArabicError(containsArabic(value));
  };

  const handleSubmit = () => {
    if (inputText.trim() && !hasArabicError) {
      onTransliterate(inputText, outputType);
    }
  };

  const handleClear = () => {
    setInputText("");
    setHasArabicError(false);
    onClear();
  };

  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div
          className={`flex items-center justify-between ${isArabic ? "flex-row-reverse" : ""}`}
        >
          <label
            className={`text-sm font-medium uppercase tracking-wide ${isArabic ? "font-arabic" : ""}`}
          >
            {t("form.inputLabel")}
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className={`text-xs uppercase tracking-wide ${isArabic ? "font-arabic" : ""}`}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            {t("form.clear")}
          </Button>
        </div>
        <Textarea
          placeholder={t("form.placeholder")}
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
          className={`min-h-[160px] font-mono text-base border-2 shadow-xs focus:shadow-sm transition-shadow resize-none ${
            hasArabicError
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }`}
          dir="ltr"
        />
        {hasArabicError && (
          <div
            className={`flex items-center gap-2 text-destructive text-sm ${isArabic ? "flex-row-reverse font-arabic" : ""}`}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              {isArabic
                ? "يرجى استخدام الحروف اللاتينية والأرقام فقط (صيغة عربيزي)"
                : "Please use only Latin letters and numbers (Arabizi format)"}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label
          className={`text-sm font-medium uppercase tracking-wide block ${isArabic ? "font-arabic text-right" : ""}`}
        >
          {t("form.outputType")}
        </label>
        <div className={`flex gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
          <button
            onClick={() => setOutputType("darija")}
            className={`flex-1 p-4 border-2 transition-all ${
              outputType === "darija"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-background hover:bg-accent"
            }`}
          >
            <div className={isArabic ? "text-right" : "text-left"}>
              <div className="font-semibold font-arabic">الدارجة</div>
              <div
                className={`text-sm opacity-80 ${isArabic ? "font-arabic" : ""}`}
              >
                {t("form.darija")}
              </div>
            </div>
          </button>
          <button
            onClick={() => setOutputType("msa")}
            className={`flex-1 p-4 border-2 transition-all ${
              outputType === "msa"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-background hover:bg-accent"
            }`}
          >
            <div className={isArabic ? "text-right" : "text-left"}>
              <div className="font-semibold font-arabic">العربية الفصحى</div>
              <div
                className={`text-sm opacity-80 ${isArabic ? "font-arabic" : ""}`}
              >
                {t("form.msa")}
              </div>
            </div>
          </button>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!inputText.trim() || isLoading || hasArabicError}
        className={`w-full h-14 text-base font-semibold uppercase tracking-wide shadow-md hover:shadow-lg transition-shadow ${isArabic ? "font-arabic" : ""}`}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            {t("form.processing")}
          </>
        ) : (
          <>
            <Languages className="w-5 h-5 mr-2" />
            {t("form.transliterate")}
            <Arrow className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};
