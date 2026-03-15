from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .infrastructure.views import AuthViewSet, UserViewSet, LogoutViewSet

router = DefaultRouter()
router.register("management", UserViewSet, basename="user-management")

urlpatterns = [
    path("login/", AuthViewSet.as_view({"post": "login"}), name="auth-login"),
    path("logout/", LogoutViewSet.as_view({"post": "logout"}), name="auth-logout"),
]

urlpatterns += router.urls
