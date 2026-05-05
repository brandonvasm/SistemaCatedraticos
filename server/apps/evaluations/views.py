from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import TrainingHours
from .serializers import TrainingHoursSerializer


class TrainingHoursByFacultyView(APIView):
    @extend_schema(
        summary="Horas de formación CEAT por facultad",
        parameters=[
            OpenApiParameter(
                name="faculty",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="ID de la facultad",
                required=True,
            )
        ],
        responses={200: TrainingHoursSerializer(many=True)},
    )
    def get(self, request):
        faculty_id = request.query_params.get("faculty")
        if not faculty_id:
            return Response(
                {"error": "El parámetro faculty es requerido"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        training_hours = TrainingHours.objects.filter(faculty_id=faculty_id)
        serializer = TrainingHoursSerializer(training_hours, many=True)
        return Response(serializer.data)


class TrainingHoursByTeacherView(APIView):
    @extend_schema(
        summary="Horas de formación CEAT de un docente específico",
        parameters=[
            OpenApiParameter(
                name="teacher_id",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH,
                description="ID del docente",
                required=True,
            )
        ],
        responses={200: TrainingHoursSerializer(many=True)},
    )
    def get(self, request, teacher_id):
        training_hours = TrainingHours.objects.filter(teacher_id=teacher_id)
        if not training_hours.exists():
            return Response(
                {"error": "No se encontraron horas de formación para este docente"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = TrainingHoursSerializer(training_hours, many=True)
        return Response(serializer.data)
