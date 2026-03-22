import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";

const examples = [
  {
    arabizi: "hello",
    darija: "سلام",
    msa: "مرحبا",
  },
  {
    arabizi: "welcome",
    darija: "مرحبا",
    msa: "أهلاً",
  },
  {
    arabizi: "mrahba bikom",
    darija: "مرحبا بيكم",
    msa: "أهلاً بكم",
  },
  {
    arabizi: "ahla w sahlan",
    darija: "أهلا وسهلا",
    msa: "أهلاً وسهلاً",
  },
  {
    arabizi: "sbah lkhir",
    darija: "صباح الخير",
    msa: "صباح الخير",
  },
  {
    arabizi: "msa lkhir",
    darija: "مساء الخير",
    msa: "مساء الخير",
  },
  {
    arabizi: "ki rak labas?",
    darija: "كي راك لاباس؟",
    msa: "كيف حالك؟",
  },
  {
    arabizi: "chokran",
    darija: "شكرا",
    msa: "شكراً",
  },
  {
    arabizi: "goodbye",
    darija: "بسلامة",
    msa: "مع السلامة",
  },
];

export const ExamplesSection = () => {
  const { t, isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section className="border-t-2 py-12 bg-muted/30">
      <div className="container">
        <h3 className={`text-sm font-medium uppercase tracking-wide mb-6 ${isArabic ? "font-arabic text-right" : ""}`}>
          {t("examples.title")}
        </h3>
        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            direction: isArabic ? "rtl" : "ltr",
          }}
          plugins={[
            AutoScroll({
              speed: 0.8,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
              startDelay: 0,
            }),
          ]}
          className="w-full"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <CarouselContent className={isArabic ? "-mr-2" : "-ml-2"}>
            {examples.map((example, index) => (
              <CarouselItem key={index} className={`${isArabic ? "pr-2" : "pl-2"} basis-1/3 md:basis-1/4 lg:basis-1/5`}>
                <div className="py-4 px-2 h-full text-center space-y-2">
                  <p className="font-mono text-lg text-muted-foreground">{example.arabizi}</p>
                  <Arrow className="w-4 h-4 text-muted-foreground/50 mx-auto" />
                  <p className={`text-xl ${isArabic ? "font-arabic" : "font-serif"}`} dir="rtl">
                    {example.darija}
                  </p>
                  <p className={`text-base text-muted-foreground ${isArabic ? "font-arabic" : "font-serif"}`} dir="rtl">
                    {example.msa}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
