import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isArabic: boolean;
}

const translations: Record<string, Record<Language, string>> = {
  // Header
  "header.title": {
    en: "Clean Algerian Arabic",
    ar: "العربية الجزائرية النظيفة",
  },
  "header.subtitle": {
    en: "Arabizi to Arabic Script Transliteration",
    ar: "تحويل الأرابيزي إلى الحروف العربية",
  },

  // Hero
  "hero.tag": {
    en: "NLP Research Tool",
    ar: "أداة بحث معالجة اللغة الطبيعية",
  },
  "hero.title": {
    en: "Transform Arabizi into Clean Arabic Script",
    ar: "حوّل الأرابيزي إلى نص عربي نظيف",
  },
  "hero.description": {
    en: "A transliteration and normalization pipeline that converts informal Arabizi text into standardized Algerian Darija or Modern Standard Arabic (MSA).",
    ar: "أداة تحويل وتوحيد تحوّل نصوص الأرابيزي غير الرسمية إلى الدارجة الجزائرية أو العربية الفصحى الموحدة.",
  },
  "hero.feature1": {
    en: "Dialectal Sensitivity",
    ar: "حساسية لهجوية",
  },
  "hero.feature2": {
    en: "High Accuracy",
    ar: "دقة عالية",
  },
  "hero.feature3": {
    en: "Cultural Authenticity",
    ar: "أصالة ثقافية",
  },
  "hero.cta": {
    en: "Enter your text below",
    ar: "أدخل نصك أدناه",
  },

  // Form
  "form.inputLabel": {
    en: "Input (Arabizi)",
    ar: "المدخل (أرابيزي)",
  },
  "form.clear": {
    en: "Clear",
    ar: "مسح",
  },
  "form.placeholder": {
    en: "Enter your Arabizi text here... (e.g., 'ki rak labas?')",
    ar: "أدخل نص الأرابيزي هنا... (مثال: 'ki rak labas?')",
  },
  "form.outputType": {
    en: "Output Type",
    ar: "نوع المخرج",
  },
  "form.darija": {
    en: "Algerian Darija",
    ar: "الدارجة الجزائرية",
  },
  "form.msa": {
    en: "Modern Standard Arabic",
    ar: "العربية الفصحى",
  },
  "form.transliterate": {
    en: "Transliterate",
    ar: "تحويل",
  },
  "form.processing": {
    en: "Processing...",
    ar: "جاري المعالجة...",
  },

  // Output
  "output.input": {
    en: "Input",
    ar: "المدخل",
  },
  "output.output": {
    en: "Output",
    ar: "المخرج",
  },
  "output.copy": {
    en: "Copy",
    ar: "نسخ",
  },
  "output.copied": {
    en: "Copied!",
    ar: "تم النسخ!",
  },
  "output.placeholder": {
    en: "Your transliteration will appear here...",
    ar: "سيظهر التحويل هنا...",
  },

  // Examples
  "examples.title": {
    en: "Example Transliterations",
    ar: "أمثلة على التحويل",
  },
  "examples.arabizi": {
    en: "Arabizi",
    ar: "أرابيزي",
  },
  "examples.darija": {
    en: "Darija",
    ar: "دارجة",
  },
  "examples.msa": {
    en: "MSA",
    ar: "فصحى",
  },

  // Contribute
  "contribute.title": {
    en: "Contribute to the Corpus",
    ar: "ساهم في بناء المجموعة",
  },
  "contribute.description": {
    en: "Help us build a comprehensive parallel corpus by adding phrases in Arabizi along with their Darija and MSA translations.",
    ar: "ساعدنا في بناء مجموعة متوازية شاملة بإضافة عبارات بالأرابيزي مع ترجماتها بالدارجة والفصحى.",
  },
  "contribute.arabiziLabel": {
    en: "Arabizi Text",
    ar: "نص الأرابيزي",
  },
  "contribute.arabiziHint": {
    en: "(Latin letters and numbers only)",
    ar: "(حروف لاتينية وأرقام فقط)",
  },
  "contribute.darijaLabel": {
    en: "Darija Translation",
    ar: "ترجمة الدارجة",
  },
  "contribute.arabicHint": {
    en: "(Arabic script only)",
    ar: "(حروف عربية فقط)",
  },
  "contribute.msaLabel": {
    en: "MSA Translation",
    ar: "ترجمة الفصحى",
  },
  "contribute.submit": {
    en: "Submit Contribution",
    ar: "إرسال المساهمة",
  },
  "contribute.submitting": {
    en: "Submitting...",
    ar: "جاري الإرسال...",
  },
  "contribute.footer": {
    en: "Your contributions help improve the transliteration system and support linguistic research on Algerian Arabic.",
    ar: "مساهماتك تساعد في تحسين نظام التحويل ودعم البحث اللغوي حول العربية الجزائرية.",
  },
  "contribute.validArabizi": {
    en: "Valid Arabizi format",
    ar: "صيغة أرابيزي صحيحة",
  },
  "contribute.validArabic": {
    en: "Valid Arabic script",
    ar: "حروف عربية صحيحة",
  },
  "contribute.arabiziRequired": {
    en: "Arabizi text is required",
    ar: "نص الأرابيزي مطلوب",
  },
  "contribute.latinOnly": {
    en: "Must contain only Latin letters and numbers",
    ar: "يجب أن يحتوي على حروف لاتينية وأرقام فقط",
  },
  "contribute.darijaRequired": {
    en: "Darija translation is required",
    ar: "ترجمة الدارجة مطلوبة",
  },
  "contribute.msaRequired": {
    en: "MSA translation is required",
    ar: "ترجمة الفصحى مطلوبة",
  },
  "contribute.arabicOnly": {
    en: "Must contain only Arabic script",
    ar: "يجب أن يحتوي على حروف عربية فقط",
  },

  // Footer
  "footer.title": {
    en: "Clean Algerian Arabic — Transliteration & Script Normalization",
    ar: "العربية الجزائرية النظيفة — تحويل وتوحيد الخط",
  },
  "footer.project": {
    en: "NLP Research Project",
    ar: "مشروع بحث معالجة اللغة الطبيعية",
  },

  // Toast messages
  "toast.complete": {
    en: "Transliteration Complete",
    ar: "اكتمل التحويل",
  },
  "toast.convertedTo": {
    en: "Converted to",
    ar: "تم التحويل إلى",
  },
  "toast.submitted": {
    en: "Contribution Submitted!",
    ar: "تم إرسال المساهمة!",
  },
  "toast.thanks": {
    en: "Thank you for helping build the corpus",
    ar: "شكراً لمساهمتك في بناء المجموعة",
  },
  "toast.validationError": {
    en: "Validation Error",
    ar: "خطأ في التحقق",
  },
  "toast.fixErrors": {
    en: "Please fix the errors before submitting",
    ar: "الرجاء تصحيح الأخطاء قبل الإرسال",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isArabic = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isArabic }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
