from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'

class FileCreateSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)
    data = serializers.CharField(write_only=True)

    class Meta:
        model = File
        fields = ['file', 'data']