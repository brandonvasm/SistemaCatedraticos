from django.db.models import Avg, Count
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.evaluations.models import StudentEvaluation
from apps.historical.models import TeacherCourseHistory

from .models import Contract, CourseSection, Faculty, Semester, Teacher
from .serializers import FacultySerializer, SemesterSerializer, TeacherStatsSerializer


class FacultyCreateView(APIView):
    @extend_schema(
        summary="Listar facultades",
        responses={200: FacultySerializer(many=True)},
    )
    def get(self, request):
        faculties = Faculty.objects.all()
        serializer = FacultySerializer(faculties, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Crear facultad",
        request=FacultySerializer,
        responses={201: FacultySerializer},
    )
    def post(self, request):
        serializer = FacultySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FacultyDetailView(APIView):
    def get_object(self, pk):
        try:
            return Faculty.objects.get(pk=pk)
        except Faculty.DoesNotExist:
            return None

    @extend_schema(
        summary="Obtener facultad por ID",
        responses={200: FacultySerializer, 404: None},
    )
    def get(self, request, pk):
        faculty = self.get_object(pk)
        if not faculty:
            return Response(
                {"detail": "Faculty not found."}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(FacultySerializer(faculty).data)

    @extend_schema(
        summary="Actualizar parcialmente una facultad",
        request=FacultySerializer,
        responses={200: FacultySerializer, 404: None},
    )
    def patch(self, request, pk):
        faculty = self.get_object(pk)
        if not faculty:
            return Response(
                {"detail": "Faculty not found."}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = FacultySerializer(faculty, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="Eliminar facultad",
        responses={204: None, 404: None},
    )
    def delete(self, request, pk):
        faculty = self.get_object(pk)
        if faculty:
            faculty.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SemesterListCreateView(APIView):
    @extend_schema(
        summary="Listar semestres",
        parameters=[
            OpenApiParameter(
                name="faculty",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="Filtrar semestres por ID de facultad",
                required=False,
            )
        ],
        responses={200: SemesterSerializer(many=True)},
    )
    def get(self, request):
        semesters = Semester.objects.all().order_by("-year", "-number")
        faculty_id = request.query_params.get("faculty")
        if faculty_id:
            semesters = semesters.filter(faculty_id=faculty_id)
        return Response(SemesterSerializer(semesters, many=True).data)

    @extend_schema(
        summary="Crear semestre",
        request=SemesterSerializer,
        responses={201: SemesterSerializer},
    )
    def post(self, request):
        serializer = SemesterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SemesterDetailView(APIView):
    def get_object(self, pk):
        try:
            return Semester.objects.get(pk=pk)
        except Semester.DoesNotExist:
            return None

    @extend_schema(
        summary="Actualizar booleanos de un semestre",
        request=SemesterSerializer,
        responses={200: SemesterSerializer, 404: None},
    )
    def patch(self, request, pk):
        semester = self.get_object(pk)
        if semester is None:
            return Response(
                {"error": "Semester not found"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = SemesterSerializer(semester, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeacherStatsDetailView(APIView):
    @extend_schema(
        summary="Estadísticas de un docente",
        responses={200: TeacherStatsSerializer},
    )
    def get(self, request, pk):
        secciones = CourseSection.objects.filter(teacher_id=pk).select_related("course")
        cursos = list(set([s.course.name for s in secciones if s.course]))

        evaluaciones_qs = StudentEvaluation.objects.filter(
            course_section__teacher_id=pk
        )
        stats = evaluaciones_qs.aggregate(promedio=Avg("score"), total=Count("id"))
        promedio = stats["promedio"] or 0.0
        total = stats["total"] or 0

        historico = (
            TeacherCourseHistory.objects.filter(teacher_id=pk)
            .values("semester_id")
            .annotate(avg_score=Avg("student_score"))
            .order_by("-semester_id")[:2]
        )
        tendencia = 0.0
        if len(historico) == 2 and historico[1]["avg_score"] > 0:
            tendencia = (
                (historico[0]["avg_score"] - historico[1]["avg_score"])
                / historico[1]["avg_score"]
            ) * 100

        promedio_global = (
            StudentEvaluation.objects.aggregate(m=Avg("score"))["m"] or 0.0
        )
        recomendado = (
            ((promedio - promedio_global) / promedio_global * 100)
            if promedio_global > 0 and promedio > 0
            else 0.0
        )

        data = {
            "cursos_impartidos": cursos,
            "promedio_general": round(promedio, 2),
            "tendencia_mejora": f"{round(tendencia, 2)}%",
            "evaluaciones_total": total,
            "recomendado_vs_otros": f"{round(recomendado, 2)}%"
            if promedio > 0
            else "Sin datos",
        }
        return Response(TeacherStatsSerializer(data).data)


class TeacherStatsListView(APIView):
    @extend_schema(
        summary="Estadísticas de docentes por facultad",
        parameters=[
            OpenApiParameter(
                name="faculty",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="ID de la facultad para filtrar docentes",
                required=True,
            )
        ],
        responses={200: TeacherStatsSerializer(many=True)},
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
            secciones = CourseSection.objects.filter(
                teacher_id=teacher.id
            ).select_related("course")
            cursos = list(set([s.course.name for s in secciones if s.course]))

            stats = StudentEvaluation.objects.filter(
                course_section__teacher_id=teacher.id
            ).aggregate(promedio=Avg("score"), total=Count("id"))

            promedio = stats["promedio"] or 0.0
            total = stats["total"] or 0

            historico = (
                TeacherCourseHistory.objects.filter(teacher_id=teacher.id)
                .values("semester_id")
                .annotate(avg_score=Avg("student_score"))
                .order_by("-semester_id")[:2]
            )
            tendencia = 0.0
            if len(historico) == 2 and historico[1]["avg_score"] > 0:
                tendencia = (
                    (historico[0]["avg_score"] - historico[1]["avg_score"])
                    / historico[1]["avg_score"]
                ) * 100

            promedio_global = (
                StudentEvaluation.objects.aggregate(m=Avg("score"))["m"] or 0.0
            )
            recomendado = (
                ((promedio - promedio_global) / promedio_global * 100)
                if promedio_global > 0 and promedio > 0
                else 0.0
            )

            result.append(
                {
                    "teacher_id": teacher.id,
                    "teacher_name": teacher.name,
                    "cursos_impartidos": cursos,
                    "promedio_general": round(promedio, 2),
                    "tendencia_mejora": f"{round(tendencia, 2)}%",
                    "evaluaciones_total": total,
                    "recomendado_vs_otros": f"{round(recomendado, 2)}%"
                    if promedio > 0
                    else "Sin datos",
                }
            )

        return Response(result)
