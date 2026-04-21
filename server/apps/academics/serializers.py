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

    def create(self, validated_data):
        faculty_id = validated_data.pop("faculty_id")
        teacher = Teacher.objects.create(**validated_data)
        Contract.objects.create(teacher=teacher, faculty_id=faculty_id)
        return teacher


class TeacherStatsSerializer(serializers.Serializer):
    teacher_id = serializers.IntegerField()
    teacher_name = serializers.CharField()
    cursos_impartidos = serializers.ListField(child=serializers.CharField())
    promedio_general = serializers.FloatField()
    tendencia_mejora = serializers.CharField()
    evaluaciones_total = serializers.IntegerField()
    recomendado_vs_otros = serializers.CharField()


class SemesterHistoricalSerializer(serializers.Serializer):
    semester_id = serializers.IntegerField()
    semester_label = serializers.CharField()
    avg_score = serializers.FloatField()
    is_current = serializers.BooleanField()


class CourseSectionSerializer(serializers.Serializer):
    section_id = serializers.IntegerField()
    section_number = serializers.CharField()
    shift = serializers.CharField()
    course_id = serializers.IntegerField()
    course_name = serializers.CharField()
    teacher_id = serializers.IntegerField(allow_null=True)
    teacher_name = serializers.CharField(allow_null=True)


class TopCourseSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()
    course_name = serializers.CharField()
    punteo = serializers.FloatField()
