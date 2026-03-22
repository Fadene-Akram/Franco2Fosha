import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import zelijPattern from "@/assets/zelij-pattern.jpg";
export const Header = () => {
  const {
    t,
    toggleLanguage,
    isArabic
  } = useLanguage();
  return <header className="border-b-2 bg-background relative overflow-hidden">
      {/* Zelij background pattern */}
      <div className="absolute inset-0 bg-cover bg-center grayscale opacity-40" style={{
      backgroundImage: `url(${zelijPattern})`
    }} />
      <div className="container py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 flex items-center justify-center shadow-xs">
              <Languages className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-xl font-bold uppercase tracking-wide ${isArabic ? "font-arabic" : ""}`}>
                {t("header.title")}
              </h1>
              
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={toggleLanguage} className="flex items-center gap-2 border-2">
            
            <span className={isArabic ? "" : "font-arabic"}>
              {isArabic ? "English" : "العربية"}
            </span>
          </Button>
        </div>
      </div>
    </header>;
};