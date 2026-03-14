from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .infrastructure.views import AuthViewSet, UserViewSet

router = DefaultRouter()
router.register("management", UserViewSet, basename="user-management")

urlpatterns = [
    path("auth/login/", AuthViewSet.as_view({"post": "login"}), name="auth-login"),
]

urlpatterns += router.urls
