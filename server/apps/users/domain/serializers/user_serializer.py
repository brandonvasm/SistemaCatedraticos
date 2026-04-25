from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    faculty_name = serializers.CharField(source='faculty_id.name', read_only=True)
    faculty_id = serializers.CharField(source='faculty_id.id', read_only=True)
    pensum_loaded = serializers.ReadOnlyField(source='faculty_id.pensum_loaded')

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'role',
            'faculty_name',
            'faculty_id',
            'is_active',
            'password',
            'evaluation_count',
            'pensum_loaded'
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password'].write_only = True
    
    
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
    