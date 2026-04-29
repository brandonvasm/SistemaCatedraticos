from rest_framework.routers import DefaultRouter
from .views import CourseHistoryViewSet, CourseDetailHistoryViewSet

router = DefaultRouter()
router.register(r"course-history", CourseHistoryViewSet, basename="course-history")
router.register(r"course-history", CourseDetailHistoryViewSet, basename="course-history-detail")

urlpatterns = router.urls
