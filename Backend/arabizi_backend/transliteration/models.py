from django.db import models


class Feedback(models.Model):
    class FeedbackType(models.TextChoices):
        POSITIVE = "positive", "Positive"
        NEGATIVE = "negative", "Negative"

    input_text = models.TextField()
    output_text = models.TextField()
    feedback_type = models.CharField(max_length=8, choices=FeedbackType.choices)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "feedback"

    def __str__(self):
        return f"[{self.feedback_type}] {self.created_at:%Y-%m-%d %H:%M} — {self.input_text[:50]}"
    

class Contribution(models.Model):
    arabizi = models.TextField()
    darija = models.TextField()
    msa = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.created_at:%Y-%m-%d %H:%M} — {self.arabizi[:50]}"
