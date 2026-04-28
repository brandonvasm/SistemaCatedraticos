from django.urls import path

from .teacher_views import TeacherHistoricalView, TeacherListCreateView
from .courses_views import CourseListView, CourseDetailView

from .views import (
    CourseSectionByFacultyView,
    CourseTeachersStatsView,
    FacultyCreateView,
    FacultyDetailView,
    FacultyHistoricalView,
    SemesterDetailView,
    SemesterListCreateView,
    TeacherStatsListView,
    TopCoursesByScoreView,
    TeacherStatsDetailView,
    TeacherCourseListView
)

urlpatterns = [
    path("faculties/", FacultyCreateView.as_view(), name="faculty-create"),
    path("faculties/<int:pk>/", FacultyDetailView.as_view(), name="faculty-detail"),
    path("semesters/", SemesterListCreateView.as_view(), name="semester-list-create"),
    path("semesters/<int:pk>/", SemesterDetailView.as_view(), name="semester-detail"),
    path("teachers/", TeacherListCreateView.as_view(), name="teacher-list"),
    path("teachers/stats/", TeacherStatsListView.as_view(), name="teacher-stats"),
    path("teachers/stats/<int:pk>/", TeacherStatsDetailView.as_view(), name="teacher-stats-detail"),
    path(
        "teachers/historical/faculty/",
        FacultyHistoricalView.as_view(),
        name="faculty-historical",
    ),
    path(
        "teachers/<int:pk>/historical/",
        TeacherHistoricalView.as_view(),
        name="teacher-historical",
    ),
    path("sections/", CourseSectionByFacultyView.as_view(), name="sections-by-faculty"),
    path("courses/top/", TopCoursesByScoreView.as_view(), name="courses-top"),
    path("courses/", CourseListView.as_view(), name="course-list"),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),
    path('courses/<int:pk>/teachers-stats/', CourseTeachersStatsView.as_view(), name='course-teachers-stats'),
    path('teachers/<int:pk>/courses/', TeacherCourseListView.as_view(), name='teacher-courses-list')
    
    
]
