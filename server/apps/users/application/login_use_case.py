from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed

class LoginUseCase(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    @staticmethod
    def execute(email, password):
        user = authenticate(email=email, password=password)
        
        if user is not None and user.is_active:
            access = AccessToken.for_user(user)
            return {
                "access": str(access),
                "user": user
            }
        raise AuthenticationFailed("Invalid credentials or inactive account")
    