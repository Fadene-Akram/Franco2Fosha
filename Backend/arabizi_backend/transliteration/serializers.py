from rest_framework import serializers
from .models import Feedback,Contribution

class TransliterationRequestSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=5000, required=True)
    output_type = serializers.ChoiceField(choices=['darija', 'msa'], required=True)
    
    def validate_text(self, value):
        if not value.strip():
            raise serializers.ValidationError("Text cannot be empty")
        return value.strip()
    
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ["input_text", "output_text", "feedback_type", "comment"]
        extra_kwargs = {
            "comment": {"required": False, "allow_null": True, "allow_blank": True},
        }


class ContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contribution
        fields = ["arabizi", "darija", "msa"]