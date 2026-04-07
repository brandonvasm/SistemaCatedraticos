from django.urls import path

from .teacher_views import TeacherListCreateView
from .views import (
    FacultyCreateView,
    FacultyDetailView,
    SemesterListCreateView,
    TeacherStatsDetailView,
)

urlpatterns = [
    path("faculties/", FacultyCreateView.as_view(), name="faculty-create"),
    path("faculties/<int:pk>/", FacultyDetailView.as_view(), name="faculty-detail"),
    path("semesters/", SemesterListCreateView.as_view(), name="semester-list-create"),
    path("teachers/", TeacherListCreateView.as_view(), name="teacher-list"),
    path(
        "teachers/<int:pk>/stats/",
        TeacherStatsDetailView.as_view(),
        name="teacher-stats",
    ),
]
