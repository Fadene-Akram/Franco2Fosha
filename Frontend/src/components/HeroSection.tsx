import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import calligraphyCircle from "@/assets/calligraphy-circle.jpg";

export const HeroSection = () => {
  const { t, isArabic } = useLanguage();

  return (
    <section className="border-b-2 py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      <div className="container relative">
        {/* Spinning calligraphy half-circle */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-[54rem] h-[54rem] ${
            isArabic ? "-left-[27rem]" : "-right-[27rem]"
          }`}
        >
          <img 
            src={calligraphyCircle} 
            alt="Arabic calligraphy decoration" 
            className="w-full h-full object-contain animate-spin opacity-90"
            style={{ animationDuration: '30s' }}
          />
        </div>
        <div className={`max-w-3xl relative z-10 ${isArabic ? "mr-0 ml-auto text-right" : ""}`}>
          <span className={`inline-block text-xs font-medium uppercase tracking-widest mb-4 px-3 py-1 border-2 bg-background ${isArabic ? "font-arabic" : ""}`}>
            {t("hero.tag")}
          </span>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 ${isArabic ? "font-arabic" : ""}`}>
            {t("hero.title")}
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl ${isArabic ? "font-arabic mr-0 ml-auto" : ""}`}>
            {t("hero.description")}
          </p>
          <div className={`flex flex-wrap gap-4 text-sm ${isArabic ? "justify-end" : ""}`}>
            <div className={`flex items-center gap-2 px-4 py-2 border-2 bg-background ${isArabic ? "font-arabic" : ""}`}>
              <span className="w-2 h-2 bg-primary" />
              <span>{t("hero.feature1")}</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 border-2 bg-background ${isArabic ? "font-arabic" : ""}`}>
              <span className="w-2 h-2 bg-primary" />
              <span>{t("hero.feature2")}</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 border-2 bg-background ${isArabic ? "font-arabic" : ""}`}>
              <span className="w-2 h-2 bg-primary" />
              <span>{t("hero.feature3")}</span>
            </div>
          </div>
        </div>
        <div className={`mt-12 flex items-center gap-2 text-muted-foreground relative z-10 ${isArabic ? "justify-end flex-row-reverse" : ""}`}>
          <ArrowDown className="w-4 h-4 animate-bounce" />
          <span className={`text-sm uppercase tracking-wide ${isArabic ? "font-arabic" : ""}`}>
            {t("hero.cta")}
          </span>
        </div>
      </div>
    </section>
  );
};
