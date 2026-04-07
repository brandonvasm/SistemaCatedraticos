from django.db.models import Avg, Count
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.evaluations.models import StudentEvaluation
from apps.historical.models import TeacherCourseHistory

from .models import Contract, CourseSection, Faculty, Semester, Teacher
from .serializers import FacultySerializer, SemesterSerializer, TeacherStatsSerializer


class FacultyCreateView(APIView):
    def get(self, request):
        faculties = Faculty.objects.all()
        serializer = FacultySerializer(faculties, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

    def get(self, request, pk):
        faculty = self.get_object(pk)
        if not faculty:
            return Response(
                {"detail": "Faculty not found."}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(FacultySerializer(faculty).data)

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

    def delete(self, request, pk):
        faculty = self.get_object(pk)
        if faculty:
            faculty.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SemesterListCreateView(APIView):
    def get(self, request):
        semesters = Semester.objects.all().order_by("-year", "-number")
        faculty_id = request.query_params.get("faculty")
        if faculty_id:
            semesters = semesters.filter(faculty_id=faculty_id)
        return Response(SemesterSerializer(semesters, many=True).data)

    def post(self, request):
        serializer = SemesterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeacherStatsDetailView(APIView):
    def get(self, request, pk):
        # 📌 Cursos impartidos
        secciones = CourseSection.objects.filter(teacher_id=pk).select_related("course")
        cursos = list(set([s.course.name for s in secciones if s.course]))

        # 📊 Promedio general y total evaluaciones
        evaluaciones_qs = StudentEvaluation.objects.filter(
            course_section__teacher_id=pk
        )

        stats = evaluaciones_qs.aggregate(promedio=Avg("score"), total=Count("id"))

        promedio = stats["promedio"] or 0.0
        total = stats["total"] or 0

        # 📈 Tendencia (por semestre real)
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

        # 📊 Comparación con TODOS los docentes (más consistente)
        promedio_global = (
            StudentEvaluation.objects.aggregate(m=Avg("score"))["m"] or 0.0
        )

        recomendado = (
            ((promedio - promedio_global) / promedio_global * 100)
            if promedio_global > 0
            else 0.0
        )

        # 📦 Respuesta final
        data = {
            "cursos_impartidos": cursos,
            "promedio_general": round(promedio, 2),
            "tendencia_mejora": f"{round(tendencia, 2)}%",
            "evaluaciones_total": total,
            "recomendado_vs_otros": f"{round(recomendado, 2)}%",
        }

        return Response(TeacherStatsSerializer(data).data)
