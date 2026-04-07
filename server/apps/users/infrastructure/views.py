from rest_framework import viewsets, status
from rest_framework.response import Response

from django.conf import settings
from .authentication import CookieJWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

from ..models import User
from ..domain.serializers.user_serializer import UserSerializer
from .permissions import IsSysAdmin, IsSysAdminOrCoordinator

# Use cases
from ..application.login_use_case import LoginUseCase
from ..application.update_user_use_case import UpdateUserUseCase
from ..application.create_user_use_case import CreateUserUseCase

# Create your views here.

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    authentication_classes = [CookieJWTAuthentication]

    def login(self, request):

        result = LoginUseCase.execute(
            email=request.data.get("email"),
            password=request.data.get("password")
        )

        user_data = UserSerializer(result["user"]).data

        response = Response(
            {'message': 'Login successful', "user_id": result["user"].id, "role": result["user"].role, "user": user_data},
            status=status.HTTP_200_OK
            )
        
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=result['access'],
            httponly=True,
            secure=settings.SESSION_COOKIE_SECURE,
            samesite='Lax',
            max_age=3600,  # 1 hour
        )
    
        return response

class LogoutViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def logout(self, request):
        response = Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        return response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):

        if self.action in ["create", "destroy", "list"]:
            permission_classes = [IsSysAdmin]
        else:
            permission_classes = [IsSysAdminOrCoordinator]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        user = CreateUserUseCase.execute(serializer.validated_data)
        return user
    
    def perform_update(self, serializer):
        user = UpdateUserUseCase.execute(
            request_user=self.request.user,
            target_user=serializer.instance,
            data=serializer.validated_data
        )
        return user
    