// import { useState } from "react";
// import { Header } from "@/components/Header";
// import { HeroSection } from "@/components/HeroSection";
// import { TransliterationForm } from "@/components/TransliterationForm";
// import { OutputDisplay } from "@/components/OutputDisplay";
// import { ExamplesSection } from "@/components/ExamplesSection";
// import { ContributeSection } from "@/components/ContributeSection";
// import { Footer } from "@/components/Footer";
// import { useToast } from "@/hooks/use-toast";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { transliterateText } from "@/services/api";

// type OutputType = "darija" | "msa";

// interface Alternative {
//   text: string;
//   confidence: number;
// }

// const Index = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [lastInput, setLastInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [outputType, setOutputType] = useState<OutputType>("darija");
//   const [confidence, setConfidence] = useState(0);
//   const [alternatives, setAlternatives] = useState<Alternative[]>([]);
//   const [selectedAltIndex, setSelectedAltIndex] = useState(0);
//   const { toast } = useToast();
//   const { t, isArabic } = useLanguage();

//   const handleTransliterate = async (text: string, type: OutputType) => {
//     setIsLoading(true);
//     setLastInput(text);
//     setOutputType(type);

//     try {
//       // Call the Django backend API
//       const result = await transliterateText(text, type);

//       // Set the output from API response
//       setOutput(result.output_text);

//       // For now, we'll set a default confidence since your backend doesn't return it
//       // You can add confidence to your Django backend later
//       setConfidence(85);

//       // Create alternatives array with the main result
//       // You can enhance your backend to return alternatives later
//       setAlternatives([{ text: result.output_text, confidence: 85 }]);

//       setSelectedAltIndex(0);

//       toast({
//         title: t("toast.complete"),
//         description: `${t("toast.convertedTo")} ${type === "darija" ? t("form.darija") : t("form.msa")}`,
//       });
//     } catch (error) {
//       // Handle errors
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "Failed to transliterate. Please try again.";

//       toast({
//         title: isArabic ? "خطأ" : "Error",
//         description: errorMessage,
//         variant: "destructive",
//       });

//       console.error("Transliteration error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAlternativeSelect = (index: number) => {
//     setSelectedAltIndex(index);
//     setOutput(alternatives[index].text);
//     setConfidence(alternatives[index].confidence);
//   };

//   const handleClear = () => {
//     setLastInput("");
//     setOutput("");
//     setConfidence(0);
//     setAlternatives([]);
//     setSelectedAltIndex(0);
//   };

//   return (
//     <div
//       className={`min-h-screen flex flex-col ${isArabic ? "font-arabic" : ""}`}
//       dir={isArabic ? "rtl" : "ltr"}
//     >
//       <Header />
//       <HeroSection />

//       <main className="flex-1 py-12">
//         <div className="container">
//           <div className="max-w-3xl mx-auto space-y-8">
//             <div className="border-2 p-6 md:p-8 shadow-md bg-background">
//               <TransliterationForm
//                 onTransliterate={handleTransliterate}
//                 onClear={handleClear}
//                 isLoading={isLoading}
//               />
//             </div>

//             <OutputDisplay
//               input={lastInput}
//               output={output}
//               outputType={outputType}
//               confidence={confidence}
//               alternatives={alternatives}
//               selectedAltIndex={selectedAltIndex}
//               onAlternativeSelect={handleAlternativeSelect}
//             />
//           </div>
//         </div>
//       </main>

//       <ExamplesSection />
//       <ContributeSection />
//       <Footer />
//     </div>
//   );
// };

// export default Index;

import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TransliterationForm } from "@/components/TransliterationForm";
import { OutputDisplay } from "@/components/OutputDisplay";
import { ExamplesSection } from "@/components/ExamplesSection";
import { ContributeSection } from "@/components/ContributeSection";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { transliterateText } from "@/services/api";

type OutputType = "darija" | "msa";

interface Alternative {
  text: string;
  confidence: number;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastInput, setLastInput] = useState("");
  const [output, setOutput] = useState("");
  const [outputType, setOutputType] = useState<OutputType>("darija");
  const [confidence, setConfidence] = useState(0);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [selectedAltIndex, setSelectedAltIndex] = useState(0);
  const { toast } = useToast();
  const { t, isArabic } = useLanguage();

  const handleTransliterate = async (text: string, type: OutputType) => {
    setIsLoading(true);
    setLastInput(text);
    setOutputType(type);

    try {
      const result = await transliterateText(text, type);

      // Use confidence and alternatives directly from the API response.
      // Fall back to safe defaults only if the backend omits them
      // (e.g. during a gradual rollout or local dev without the updated service).
      const apiConfidence: number = result.confidence ?? 0;
      const apiAlternatives: Alternative[] =
        Array.isArray(result.alternatives) && result.alternatives.length > 0
          ? result.alternatives
          : [{ text: result.output_text, confidence: apiConfidence }];

      setOutput(result.output_text);
      setConfidence(apiConfidence);
      setAlternatives(apiAlternatives);
      setSelectedAltIndex(0);

      toast({
        title: t("toast.complete"),
        description: `${t("toast.convertedTo")} ${type === "darija" ? t("form.darija") : t("form.msa")}`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to transliterate. Please try again.";

      toast({
        title: isArabic ? "خطأ" : "Error",
        description: errorMessage,
        variant: "destructive",
      });

      console.error("Transliteration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlternativeSelect = (index: number) => {
    setSelectedAltIndex(index);
    setOutput(alternatives[index].text);
    setConfidence(alternatives[index].confidence);
  };

  const handleClear = () => {
    setLastInput("");
    setOutput("");
    setConfidence(0);
    setAlternatives([]);
    setSelectedAltIndex(0);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${isArabic ? "font-arabic" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header />
      <HeroSection />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="border-2 p-6 md:p-8 shadow-md bg-background">
              <TransliterationForm
                onTransliterate={handleTransliterate}
                onClear={handleClear}
                isLoading={isLoading}
              />
            </div>

            <OutputDisplay
              input={lastInput}
              output={output}
              outputType={outputType}
              confidence={confidence}
              alternatives={alternatives}
              selectedAltIndex={selectedAltIndex}
              onAlternativeSelect={handleAlternativeSelect}
            />
          </div>
        </div>
      </main>

      <ExamplesSection />
      <ContributeSection />
      <Footer />
    </div>
  );
};

export default Index;
