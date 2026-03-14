from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import AccessToken

from django.conf import settings
from .authentication import CookieJWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

from ..models import User
from ..serializers.user_serializer import UserSerializer
from ..serializers.login_serializer import LoginSerializer
from .permissions import IsSysAdmin, IsSysAdminOrCoordinator

# Create your views here.

class AuthViewSet(viewsets.ViewSet):

    authentication_classes = [CookieJWTAuthentication]

    def login(self, request):

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        token = AccessToken.for_user(user)

        response = Response(
            {'message': 'Login successful'},
            status=status.HTTP_200_OK
            )
        
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=str(token),
            httponly=True,
            secure=True,
            samesite='Lax',
            max_age=3600,  # 1 hour
        )
    
        return response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):

        if self.action in ["create", "destroy"]:
            permission_classes = [IsSysAdmin]
        else:
            permission_classes = [IsSysAdminOrCoordinator]

        return [permission() for permission in permission_classes]
""" 
    @action(detail=False, methods=["post"])
    def login(self, request):

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        token = AccessToken.for_user(user)

        response = JsonResponse({'message': 'Login successful'})
        response.set_cookie(
            key='jwt',
            value=str(token),
            httponly=True,
            secure=True,
            samesite='Lax',
            max_age=3600,  # 1 hour
        )

        return response

    @action(detail=False, methods=["get", "patch"])
    def me(self, request):

        user = request.user

        if request.method == "GET":

            serializer = self.get_serializer(user)
            return Response(serializer.data)

        if request.method == "PATCH":

            serializer = self.get_serializer(
                user,
                data=request.data,
                partial=True
            )

            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data) """