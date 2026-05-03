from .views import TeacherCommentsAnalysisAIView
from django.urls import path

urlpatterns = [
    path('teacher-comments-analysis/', TeacherCommentsAnalysisAIView.as_view(), name='teacher-comments-analysis'),
]
