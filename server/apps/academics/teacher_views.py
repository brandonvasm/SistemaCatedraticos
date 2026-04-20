from django.db.models import Avg
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.historical.models import TeacherCourseHistory

from .models import Contract, Teacher
from .serializers import SemesterHistoricalSerializer, TeacherSerializer
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
            teachers = Teacher.objects.filter(id__in=teacher_ids)
        else:
            teachers = Teacher.objects.all()
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
