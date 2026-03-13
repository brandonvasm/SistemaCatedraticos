from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import UserViewSet

router = SimpleRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'users/(?P<pk>\d+)/', UserViewSet, basename='user-detail')
urlpatterns = router.urls
