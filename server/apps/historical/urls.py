from rest_framework.routers import DefaultRouter
from .views import CourseHistoryViewSet

router = DefaultRouter()
router.register(r"course-history", CourseHistoryViewSet, basename="course-history")

urlpatterns = router.urls
