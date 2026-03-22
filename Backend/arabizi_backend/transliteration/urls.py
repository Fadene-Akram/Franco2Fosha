from django.urls import path
from .views import TransliterateView,FeedbackView,ContributeView,HealthCheckView

urlpatterns = [
    path('transliterate/', TransliterateView.as_view(), name='transliterate'),
    path("feedback/", FeedbackView.as_view(), name="feedback"),
    path("contribute/", ContributeView.as_view(), name="contribute"),
    path('health/', HealthCheckView.as_view(), name='health'),
]