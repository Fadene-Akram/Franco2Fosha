import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { submitContribution } from "@/services/api";

// Validation functions
const isValidArabizi = (text: string): boolean => {
  const arabiziRegex = /^[a-zA-Z0-9\s.,!?'-]+$/;
  return arabiziRegex.test(text) && text.trim().length > 0;
};

const isValidArabicScript = (text: string): boolean => {
  const arabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s.,!?؟،؛]+$/;
  return arabicRegex.test(text) && text.trim().length > 0;
};

interface ValidationState {
  isValid: boolean;
  messageKey: string;
}

export const ContributeSection = () => {
  const [arabizi, setArabizi] = useState("");
  const [darija, setDarija] = useState("");
  const [msa, setMsa] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t, isArabic } = useLanguage();

  const [validations, setValidations] = useState<{
    arabizi: ValidationState | null;
    darija: ValidationState | null;
    msa: ValidationState | null;
  }>({
    arabizi: null,
    darija: null,
    msa: null,
  });

  const validateArabizi = (value: string): ValidationState => {
    if (!value.trim()) {
      return { isValid: false, messageKey: "contribute.arabiziRequired" };
    }
    if (!isValidArabizi(value)) {
      return { isValid: false, messageKey: "contribute.latinOnly" };
    }
    return { isValid: true, messageKey: "contribute.validArabizi" };
  };

  const validateArabicField = (
    value: string,
    requiredKey: string,
  ): ValidationState => {
    if (!value.trim()) {
      return { isValid: false, messageKey: requiredKey };
    }
    if (!isValidArabicScript(value)) {
      return { isValid: false, messageKey: "contribute.arabicOnly" };
    }
    return { isValid: true, messageKey: "contribute.validArabic" };
  };

  const handleArabiziChange = (value: string) => {
    setArabizi(value);
    if (value) {
      setValidations((prev) => ({ ...prev, arabizi: validateArabizi(value) }));
    } else {
      setValidations((prev) => ({ ...prev, arabizi: null }));
    }
  };

  const handleDarijaChange = (value: string) => {
    setDarija(value);
    if (value) {
      setValidations((prev) => ({
        ...prev,
        darija: validateArabicField(value, "contribute.darijaRequired"),
      }));
    } else {
      setValidations((prev) => ({ ...prev, darija: null }));
    }
  };

  const handleMsaChange = (value: string) => {
    setMsa(value);
    if (value) {
      setValidations((prev) => ({
        ...prev,
        msa: validateArabicField(value, "contribute.msaRequired"),
      }));
    } else {
      setValidations((prev) => ({ ...prev, msa: null }));
    }
  };

  const isFormValid = () => {
    const arabiziValid = validateArabizi(arabizi);
    const darijaValid = validateArabicField(
      darija,
      "contribute.darijaRequired",
    );
    const msaValid = validateArabicField(msa, "contribute.msaRequired");
    return arabiziValid.isValid && darijaValid.isValid && msaValid.isValid;
  };

  const handleSubmit = async () => {
    const arabiziValidation = validateArabizi(arabizi);
    const darijaValidation = validateArabicField(
      darija,
      "contribute.darijaRequired",
    );
    const msaValidation = validateArabicField(msa, "contribute.msaRequired");

    setValidations({
      arabizi: arabiziValidation,
      darija: darijaValidation,
      msa: msaValidation,
    });

    if (
      !arabiziValidation.isValid ||
      !darijaValidation.isValid ||
      !msaValidation.isValid
    ) {
      toast({
        title: t("toast.validationError"),
        description: t("toast.fixErrors"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContribution({
        arabizi: arabizi.trim(),
        darija: darija.trim(),
        msa: msa.trim(),
      });

      toast({
        title: t("toast.submitted"),
        description: t("toast.thanks"),
      });

      setArabizi("");
      setDarija("");
      setMsa("");
      setValidations({ arabizi: null, darija: null, msa: null });
    } catch (error) {
      console.error("Error submitting contribution:", error);
      toast({
        title: isArabic ? "حدث خطأ" : "Error",
        description: isArabic
          ? "فشل في إرسال المساهمة. يرجى المحاولة مرة أخرى."
          : "Failed to submit contribution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ValidationIndicator = ({
    validation,
  }: {
    validation: ValidationState | null;
  }) => {
    if (!validation) return null;
    return (
      <div
        className={`flex items-center gap-1 text-sm mt-1 ${validation.isValid ? "text-green-600" : "text-destructive"} ${isArabic ? "flex-row-reverse font-arabic" : ""}`}
      >
        {validation.isValid ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <AlertCircle className="h-3 w-3" />
        )}
        <span>{t(validation.messageKey)}</span>
      </div>
    );
  };

  return (
    <section className="py-16 bg-muted/30" id="contribute">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className={`text-center mb-8 ${isArabic ? "font-arabic" : ""}`}>
            <h2 className="text-3xl font-bold mb-4">{t("contribute.title")}</h2>
            <p className="text-muted-foreground">
              {t("contribute.description")}
            </p>
          </div>

          <div className="border-2 p-6 md:p-8 shadow-md bg-background">
            <div className="space-y-6">
              {/* Arabizi Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="arabizi-input"
                  className={`text-base font-semibold ${isArabic ? "font-arabic block text-right" : ""}`}
                >
                  {t("contribute.arabiziLabel")}
                  <span
                    className={`text-muted-foreground font-normal text-sm ${isArabic ? "mr-2" : "ml-2"}`}
                  >
                    {t("contribute.arabiziHint")}
                  </span>
                </Label>
                <Textarea
                  id="arabizi-input"
                  placeholder="e.g., ki rak labas, 3lach ma jitch..."
                  value={arabizi}
                  onChange={(e) => handleArabiziChange(e.target.value)}
                  className="min-h-[80px] text-base"
                  dir="ltr"
                />
                <ValidationIndicator validation={validations.arabizi} />
              </div>

              {/* Darija Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="darija-input"
                  className={`text-base font-semibold ${isArabic ? "font-arabic block text-right" : ""}`}
                >
                  {t("contribute.darijaLabel")}
                  <span
                    className={`text-muted-foreground font-normal text-sm ${isArabic ? "mr-2" : "ml-2"}`}
                  >
                    {t("contribute.arabicHint")}
                  </span>
                </Label>
                <Textarea
                  id="darija-input"
                  placeholder="e.g., كي راك لاباس، علاش ما جيتش..."
                  value={darija}
                  onChange={(e) => handleDarijaChange(e.target.value)}
                  className={`min-h-[80px] text-base text-right ${isArabic ? "font-arabic" : ""}`}
                  dir="rtl"
                />
                <ValidationIndicator validation={validations.darija} />
              </div>

              {/* MSA Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="msa-input"
                  className={`text-base font-semibold ${isArabic ? "font-arabic block text-right" : ""}`}
                >
                  {t("contribute.msaLabel")}
                  <span
                    className={`text-muted-foreground font-normal text-sm ${isArabic ? "mr-2" : "ml-2"}`}
                  >
                    {t("contribute.arabicHint")}
                  </span>
                </Label>
                <Textarea
                  id="msa-input"
                  placeholder="e.g., كيف حالك، لماذا لم تأتِ..."
                  value={msa}
                  onChange={(e) => handleMsaChange(e.target.value)}
                  className={`min-h-[80px] text-base text-right ${isArabic ? "font-arabic" : ""}`}
                  dir="rtl"
                />
                <ValidationIndicator validation={validations.msa} />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid()}
                className={`w-full ${isArabic ? "font-arabic" : ""}`}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("contribute.submitting")}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t("contribute.submit")}
                  </>
                )}
              </Button>

              <p
                className={`text-xs text-muted-foreground text-center ${isArabic ? "font-arabic" : ""}`}
              >
                {t("contribute.footer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
