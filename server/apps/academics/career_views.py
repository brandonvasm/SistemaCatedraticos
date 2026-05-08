from django.db.models import Avg
from django.db.models.functions import Round
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Career


class CareerListView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Listar carreras de la facultad con promedios de evaluación",
        responses={
            200: {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {"type": "integer"},
                        "name": {"type": "string"},
                        "avg_teacher_score": {"type": "number", "nullable": True},
                        "avg_course_control_score": {"type": "number", "nullable": True},
                    },
                },
            }
        },
    )
    def get(self, request):
        faculty = request.user.faculty_id
        if faculty is None:
            return Response(
                {"detail": "Usuario sin facultad asignada."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        careers = list(
            Career.objects.filter(faculty=faculty)
            .annotate(
                avg_teacher_score=Round(Avg("course__coursesection__studentevaluation__score"), 2),
                avg_course_control_score=Round(Avg("course__coursesection__control_score"), 2),
            )
            .values("id", "name", "avg_teacher_score", "avg_course_control_score")
        )
    
        return Response(careers, status=status.HTTP_200_OK)
