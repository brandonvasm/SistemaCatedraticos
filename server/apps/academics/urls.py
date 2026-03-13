from django.urls import path

from .views import SemesterListCreateView

urlpatterns = [
    path("semesters/", SemesterListCreateView.as_view(), name="semester-list-create"),
]
