from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    faculty = serializers.CharField(source='faculty.name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'role',
            'faculty',
            'evaluation_count',
        ]

    
    def create(self, validated_data):

        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        return user
    
    def update(self, instance, validated_data):

        request = self.context["request"]

        if request.user.role != "admin":
            validated_data.pop("role", None)

        return super().update(instance, validated_data)
    