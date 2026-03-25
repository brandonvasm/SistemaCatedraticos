from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileView

router = DefaultRouter()
router.register("", FileView, basename="files")
urlpatterns = router.urls