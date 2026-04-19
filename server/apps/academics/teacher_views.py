from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Contract, Teacher
from .serializers import TeacherSerializer


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
