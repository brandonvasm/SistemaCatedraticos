from django.urls import path

from .views import TrainingHoursByFacultyView, TrainingHoursByTeacherView

urlpatterns = [
    path(
        "training-hours/",
        TrainingHoursByFacultyView.as_view(),
        name="training-hours-by-faculty",
    ),
    path(
        "training-hours/<int:teacher_id>/",
        TrainingHoursByTeacherView.as_view(),
        name="training-hours-by-teacher",
    ),
]
