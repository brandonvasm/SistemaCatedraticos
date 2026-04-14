from dataclasses import fields

from rest_framework import serializers

from .models import Contract, Faculty, Semester, Teacher


class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ["id", "name", "pensum_loaded"]


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
        fields = ["id", "teacher", "faculty", "created_at", "is_active"]


class TeacherSerializer(serializers.ModelSerializer):
    faculty_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Teacher
        fields = [
            "id",
            "identity_code",
            "name",
            "created_at",
            "is_active",
            "faculty_id",
        ]
        extra_kwargs = {"identity_code": {"validators": []}}

    def create(self, validated_data):
        from apps.academics.application.application import TeacherUpsertService

        faculty_id = validated_data.pop("faculty_id")

        teacher, created = TeacherUpsertService.execute(
            identity_code=validated_data["identity_code"],
            name=validated_data["name"],
            faculty_id=faculty_id,
            created_at=validated_data.get("created_at"),
            is_active=validated_data.get("is_active", True),
        )

        return teacher
