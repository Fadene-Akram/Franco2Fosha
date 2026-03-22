
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import TransliterationRequestSerializer, FeedbackSerializer, ContributionSerializer
from .services import transliteration_service
import logging

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class TransliterateView(APIView):
    def post(self, request):
        serializer = TransliterationRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        text = serializer.validated_data['text']
        output_type = serializer.validated_data['output_type']

        try:
            # result is now a dict with output_text, confidence, and alternatives
            result = transliteration_service.transliterate(text, output_type)

            response_data = {
                'input_text': text,
                'output_text': result['output_text'],
                'output_type': output_type,
                'confidence': result['confidence'],
                'alternatives': result['alternatives'],  # [{"text": ..., "confidence": ...}, ...]
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Transliteration error: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class FeedbackView(APIView):
    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            serializer.save()
            return Response(
                {"message": "Feedback submitted successfully"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            logger.error(f"Feedback submission error: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class ContributeView(APIView):
    def post(self, request):
        serializer = ContributionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            serializer.save()
            return Response(
                {"message": "Contribution submitted successfully"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            logger.error(f"Contribution submission error: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)