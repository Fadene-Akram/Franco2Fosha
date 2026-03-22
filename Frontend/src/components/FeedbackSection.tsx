import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { submitFeedback } from "@/services/api";

interface FeedbackSectionProps {
  input: string;
  output: string;
}

export const FeedbackSection = ({ input, output }: FeedbackSectionProps) => {
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(
    null,
  );
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isArabic } = useLanguage();

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type);
    setShowComment(true);
  };

  const handleSubmitComment = async () => {
    if (!feedback || isSubmitting) {
      if (!feedback) {
        toast({
          title: isArabic ? "يرجى اختيار تقييم" : "Please select a rating",
          description: isArabic
            ? "اضغط على إعجاب أو عدم إعجاب"
            : "Click thumbs up or thumbs down first",
          variant: "destructive",
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFeedback({
        input_text: input,
        output_text: output,
        feedback_type: feedback,
        comment: comment || null,
      });

      setSubmitted(true);
      setShowComment(false);
      toast({
        title: isArabic
          ? "شكراً على ملاحظاتك!"
          : "Thank you for your feedback!",
        description: isArabic
          ? "مساهمتك تساعدنا على التحسين"
          : "Your input helps us improve",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: isArabic ? "حدث خطأ" : "Error",
        description: isArabic
          ? "فشل في إرسال الملاحظات. يرجى المحاولة مرة أخرى."
          : "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className={`flex items-center gap-2 text-sm text-muted-foreground ${isArabic ? "flex-row-reverse font-arabic" : ""}`}
      >
        <ThumbsUp className="w-4 h-4 text-primary" />
        <span>{isArabic ? "تم إرسال الملاحظات" : "Feedback submitted"}</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}
      >
        <span
          className={`text-xs font-medium uppercase tracking-wide text-muted-foreground ${isArabic ? "font-arabic" : ""}`}
        >
          {isArabic
            ? "هل كان هذا التحويل مفيداً؟"
            : "Was this transliteration helpful?"}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant={feedback === "positive" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFeedback("positive")}
            className="h-8 w-8 p-0"
          >
            <ThumbsUp className="w-4 h-4" />
          </Button>
          <Button
            variant={feedback === "negative" ? "destructive" : "ghost"}
            size="sm"
            onClick={() => handleFeedback("negative")}
            className="h-8 w-8 p-0"
          >
            <ThumbsDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComment(!showComment)}
            className="h-8 w-8 p-0"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showComment && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`flex items-start gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
          >
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                isArabic
                  ? "شاركنا رأيك أو اقتراحاتك (اختياري)..."
                  : "Share your thoughts or suggestions (optional)..."
              }
              className={`flex-1 min-h-[80px] border-2 ${isArabic ? "font-arabic text-right" : ""}`}
              dir={isArabic ? "rtl" : "ltr"}
            />
          </div>
          <div
            className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
          >
            <Button
              size="sm"
              onClick={handleSubmitComment}
              disabled={isSubmitting || !feedback}
              className="border-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isArabic ? (
                "إرسال"
              ) : (
                "Submit"
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowComment(false);
                setComment("");
                setFeedback(null);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
