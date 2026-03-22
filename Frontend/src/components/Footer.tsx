import { useLanguage } from "@/contexts/LanguageContext";
import zelijPattern from "@/assets/zelij-pattern.jpg";
export const Footer = () => {
  const {
    t,
    isArabic
  } = useLanguage();
  return <footer className="border-t-2 py-8 mt-auto relative overflow-hidden">
      {/* Zelij background pattern */}
      <div className="absolute inset-0 bg-cover bg-center grayscale opacity-40" style={{
      backgroundImage: `url(${zelijPattern})`
    }} />
      <div className="container relative z-10">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground ${isArabic ? "md:flex-row-reverse font-arabic" : ""}`}>
          <p className="text-primary">
            {t("footer.title")}
          </p>
          <p className="text-xs uppercase tracking-wide text-primary">
            {t("footer.project")}
          </p>
        </div>
      </div>
    </footer>;
};