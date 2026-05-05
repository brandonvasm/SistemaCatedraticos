from django.db.models import Avg, Sum
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.evaluations.models import Comment
from apps.historical.models import TeacherCourseHistory

from .models import Contract, CourseSection, Teacher
from .serializers import (
    SemesterAvgSerializer,
    SemesterHistoricalSerializer,
    TeacherSerializer,
    TeacherWorkloadSerializer,
)
from .utils import get_historical_semesters


class TeacherListCreateView(APIView):
    @extend_schema(
        summary="Listar docentes",
        parameters=[
            OpenApiParameter(
                name="faculty",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="Filtrar docentes por ID de facultad",
                required=False,
            )
        ],
        responses={200: TeacherSerializer(many=True)},
    )
    def get(self, request):
        faculty_id = request.query_params.get("faculty")
        if faculty_id:
            teacher_ids = Contract.objects.filter(
                faculty_id=faculty_id, is_active=True
            ).values_list("teacher_id", flat=True)
        else:
            teacher_ids = Contract.objects.filter(is_active=True).values_list(
                "teacher_id", flat=True
            )

        teachers = Teacher.objects.filter(id__in=teacher_ids)
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Crear docente",
        request=TeacherSerializer,
        responses={201: TeacherSerializer},
    )
    def post(self, request):
        serializer = TeacherSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeacherHistoricalView(APIView):
    @extend_schema(
        summary="Evolución histórica de un docente",
        parameters=[
            OpenApiParameter(
                name="faculty",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="ID de la facultad para obtener los semestres",
                required=True,
            )
        ],
        responses={200: SemesterHistoricalSerializer(many=True)},
    )
    def get(self, request, pk):
        faculty_id = request.query_params.get("faculty")
        if not faculty_id:
            return Response(
                {"error": "El parámetro faculty es requerido"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        semesters = get_historical_semesters(faculty_id)
        if not semesters:
            return Response([])

        current_id = semesters[0].id
        result = []

        for semester in semesters:
            avg = TeacherCourseHistory.objects.filter(
                teacher_id=pk, semester_id=semester.id
            ).aggregate(avg_score=Avg("student_score"))["avg_score"]
            result.append(
                {
                    "semester_id": semester.id,
                    "semester_label": f"{semester.year} - {semester.number}",
                    "avg_score": round(avg, 2) if avg is not None else None,
                    "is_current": semester.id == current_id,
                }
            )

        serializer = SemesterHistoricalSerializer(result, many=True)
        return Response(serializer.data)


class TeacherCommentsListView(APIView):
    @extend_schema(
        summary="Obtener comentarios de todos los docentes",
        description="Devuelve todos los comentarios agrupados por docente.",
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request):
        comments = (
            Comment.objects.select_related(
                "course_section__teacher",
            )
            .filter(course_section__teacher__isnull=False)
            .order_by("-created_at")
        )

        comments_by_teacher: dict[str, list[str]] = {}
        for comment in comments:
            teacher_name = comment.course_section.teacher.name
            comments_by_teacher.setdefault(teacher_name, []).append(comment.content)

        result = [
            {
                "docente": teacher_name,
                "comentarios": teacher_comments,
            }
            for teacher_name, teacher_comments in comments_by_teacher.items()
        ]

        return Response(result)


class TeacherCommentsDetailView(APIView):
    @extend_schema(
        summary="Obtener comentarios de un docente",
        description="Devuelve todos los comentarios de un docente.",
        parameters=[
            OpenApiParameter(
                name="teacher_id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID del docente",
                required=True,
            )
        ],
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request, teacher_id):
        try:
            teacher = Teacher.objects.get(id=teacher_id)
        except Teacher.DoesNotExist:
            return Response(
                {"error": "Docente no encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        comments = Comment.objects.filter(
            course_section__teacher_id=teacher.id
        ).order_by("-created_at")
        teacher_comments = [comment.content for comment in comments]

        return Response(
            {
                "docente": teacher.name,
                "comentarios": teacher_comments,
            }
        )


class TeacherWorkloadView(APIView):
    @extend_schema(
        summary="Carga y rendimiento de docentes por facultad",
        parameters=[
            OpenApiParameter(
                name="faculty",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="ID de la facultad",
                required=True,
            )
        ],
        responses={200: TeacherWorkloadSerializer(many=True)},
    )
    def get(self, request):
        faculty_id = request.query_params.get("faculty")
        if not faculty_id:
            return Response(
                {"error": "El parámetro faculty es requerido"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        teacher_ids = Contract.objects.filter(
            faculty_id=faculty_id, is_active=True
        ).values_list("teacher_id", flat=True)

        teachers = Teacher.objects.filter(id__in=teacher_ids)

        result = []
        for teacher in teachers:
            total_credits = (
                CourseSection.objects.filter(
                    teacher_id=teacher.id,
                    credits__isnull=False,
                ).aggregate(total=Sum("credits"))["total"]
                or 0
            )

            avg_score = TeacherCourseHistory.objects.filter(
                teacher_id=teacher.id,
                student_score__isnull=False,
            ).aggregate(avg=Avg("student_score"))["avg"]

            result.append(
                {
                    "teacher_id": teacher.id,
                    "teacher_name": teacher.name,
                    "total_credits": total_credits,
                    "avg_score": round(avg_score, 2) if avg_score is not None else None,
                }
            )

        serializer = TeacherWorkloadSerializer(result, many=True)
        return Response(serializer.data)


class FacultyHistoricalTrendView(APIView):
    @extend_schema(
        summary="Tendencia histórica de calificaciones de docentes por facultad",
        parameters=[
            OpenApiParameter(
                name="faculty",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="ID de la facultad",
                required=True,
            )
        ],
        responses={200: SemesterAvgSerializer(many=True)},
    )
    def get(self, request):
        faculty_id = request.query_params.get("faculty")
        if not faculty_id:
            return Response(
                {"error": "El parámetro faculty es requerido"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        semesters = get_historical_semesters(faculty_id, limit=4)
        if not semesters:
            return Response([])

        current_id = semesters[0].id

        teacher_ids = Contract.objects.filter(
            faculty_id=faculty_id, is_active=True
        ).values_list("teacher_id", flat=True)

        result = []
        for semester in semesters:
            avg = TeacherCourseHistory.objects.filter(
                teacher_id__in=teacher_ids,
                semester_id=semester.id,
                student_score__isnull=False,
            ).aggregate(avg=Avg("student_score"))["avg"]

            result.append(
                {
                    "semester_id": semester.id,
                    "semester_label": f"{semester.year} - {semester.number}",
                    "avg_score": round(avg, 2) if avg is not None else None,
                    "is_current": semester.id == current_id,
                }
            )

        serializer = SemesterAvgSerializer(result, many=True)
        return Response(serializer.data)
