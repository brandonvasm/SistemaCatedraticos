from .views import (
    TeacherCommentsAnalysisAIView,
    TeacherCommentsAnalysisTaskStatusView,
    CourseAnalysisAIView,
    TeacherProfileAnalysisAIView,
    )
from django.urls import path

urlpatterns = [
    path('teacher-comments-analysis/', TeacherCommentsAnalysisAIView.as_view(), name='teacher-comments-analysis'),
    path('teacher-comments-analysis/tasks/<str:task_id>/', TeacherCommentsAnalysisTaskStatusView.as_view(), name='teacher-comments-analysis-task-status'),
    path('course-analysis/<int:pk>/', CourseAnalysisAIView.as_view({'get': 'course'}), name='course-analysis'),
    path('general-course-recommendations/', CourseAnalysisAIView.as_view({'get': 'general_recommendations'}), name='general-course-recommendations'),
    path('teacher-profile-analysis/<int:pk>/', TeacherProfileAnalysisAIView.as_view({'get': 'teacher'}), name='teacher-profile-analysis'),
    path('general-teacher-recommendations/', TeacherProfileAnalysisAIView.as_view({'get': 'general_recommendations'}), name='general-teacher-recommendations'),
]
