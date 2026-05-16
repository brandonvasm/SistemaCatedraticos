from rest_framework import viewsets, status
from rest_framework.response import Response

from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiParameter
from .authentication import CookieJWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

from ..models import User
from ..domain.serializers.user_serializer import UserSerializer
from ..domain.serializers.login_serializer import LoginSerializer
from .permissions import IsSysAdmin, IsSysAdminOrCoordinator

# Use cases
from ..application.login_use_case import LoginUseCase
from ..application.update_user_use_case import UpdateUserUseCase
from ..application.create_user_use_case import CreateUserUseCase

# Create your views here.

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    authentication_classes = [CookieJWTAuthentication]

    @extend_schema(
        request=LoginSerializer,
        responses={200:{OpenApiParameter(name="message", type=str, description="Login successful")}},
        description="Endpoint for user login. Accepts email and password, returns a success message and sets a JWT token in an HTTP-only cookie."
    )
    def login(self, request):
    
        result = LoginUseCase.execute(
            email=request.data.get("email"),
            password=request.data.get("password")
        )

        user_data = UserSerializer(result["user"]).data
        user_data.pop("password", None)

        response = Response(
            {'message': 'Login successful', "user_id": result["user"].id, "role": result["user"].role, "user": user_data},
            status=status.HTTP_200_OK
            )
        
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=result['access'],
            httponly=True,
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            max_age=3600,  # 1 hour
        )
    
        return response

class LogoutViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    @extend_schema(
        responses={200: OpenApiParameter(name="message", type=str, description="Logout successful")},
        description="Endpoint for user logout. Deletes the JWT token from the HTTP-only cookie."
    )
    def logout(self, request):
        response = Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        return response

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer



    def get_queryset(self):
        
        user = self.request.user

        if user.role == 'admin':
            return User.objects.filter(faculty_id=user.faculty_id)

        return User.objects.none()



    def get_permissions(self):

        if self.action in ["create", "destroy", "list"]:
            permission_classes = [IsSysAdmin]
        else:
            permission_classes = [IsSysAdminOrCoordinator]

        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        f_id = request.data.get('faculty_id')

        user = CreateUserUseCase.execute(serializer.validated_data)

        if f_id:
            user.faculty_id_id = f_id
            user.save()

        return Response(
            {'message': 'User successfully created', 'user_id': user.id},
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        user = UpdateUserUseCase.execute(
            request_user=request.user,
            target_user=serializer.instance,
            data=serializer.validated_data
        )

        return Response(
            {'message': 'User successfully updated', 'user_id': user.id},
            status=status.HTTP_200_OK
        )

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.id == request.user.id:
            return Response({'message': 'You cannot delete your own account'}, status=status.HTTP_400_BAD_REQUEST)
        instance.is_active = not instance.is_active
        instance.save()
        
        # Mensaje dinámico según el nuevo estado
        estado = "activado" if instance.is_active else "desactivado"
        
        return Response({
            'message': f'Usuario {estado} correctamente',
            'is_active': instance.is_active
        }, status=status.HTTP_200_OK)
    