from django.urls import path

from .teacher_views import TeacherListCreateView
from .views import (
    FacultyCreateView,
    FacultyDetailView,
    SemesterDetailView,
    SemesterListCreateView,
    TeacherStatsListView,
)

urlpatterns = [
    path("faculties/", FacultyCreateView.as_view(), name="faculty-create"),
    path("faculties/<int:pk>/", FacultyDetailView.as_view(), name="faculty-detail"),
    path("semesters/", SemesterListCreateView.as_view(), name="semester-list-create"),
    path("semesters/<int:pk>/", SemesterDetailView.as_view(), name="semester-detail"),
    path("teachers/", TeacherListCreateView.as_view(), name="teacher-list"),
    path(
        "teachers/stats/",
        TeacherStatsListView.as_view(),
        name="teacher-stats",
    ),
]
