from rest_framework import serializers
from dataclasses import fields

from .models import Faculty, Semester, Contract, Teacher

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = [
            "id", 
            "name", 
            "pensum_loaded"
        ]

class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = [
            "id",
            "year",
            "number",
            "ceat_loaded",
            "comments_loaded",
            "control_loaded",
            "evaluation_loaded",
            "status",
            "faculty",
        ]
        
class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = ['id', 'teacher', 'faculty', 'created_at', 'is_active']

class TeacherSerializer(serializers.ModelSerializer):
    faculty_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Teacher
        fields = ['id', 'identity_code', 'name', 'created_at', 'is_active', 'faculty_id']

    def create(self, validated_data):
        faculty_id = validated_data.pop('faculty_id')
        teacher = Teacher.objects.create(**validated_data)
        Contract.objects.create(teacher=teacher, faculty_id=faculty_id)
        return teacher