from collections import defaultdict

from django.db import transaction, connection

from django.db.models import Avg, Count, OuterRef, Subquery, Q
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from django.db.models.functions import Coalesce
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.core.cache import cache

# Intentamos importar el modelo de analítica si existe
try:
    from apps.analytics.models import (
        CourseAnalysisAI,
        CourseGeneralRecomendationsAI,
        TeacherAnalysisAI,
        TeacherCommentsAnalysisAI,
        TeacherGeneralRecomendationsAI,
        TeacherProfileAnalysisAI,
    )
except ImportError:
    CourseAnalysisAI = None
    CourseGeneralRecomendationsAI = None
    TeacherAnalysisAI = None
    TeacherCommentsAnalysisAI = None
    TeacherGeneralRecomendationsAI = None
    TeacherProfileAnalysisAI = None

from apps.evaluations.models import Comment, SectionControl, StudentEvaluation, TrainingHours
from apps.historical.models import TeacherCourseHistory

from .models import Contract, Course, CourseSection, Faculty, Semester, Teacher
from .serializers import (
    CourseSectionSerializer,
    FacultySerializer,
    SemesterHistoricalSerializer,
    SemesterSerializer,
    TeacherStatsSerializer,
    TopCourseSerializer,
)
from .utils import get_historical_semesters


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
    permission_classes = [IsAuthenticated]

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
        faculty_id = request.user.faculty_id_id
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
        # Asegurar que el semestre se cree para la facultad del usuario
        if 'faculty' not in request.data and request.user.faculty_id_id:
            request.data['faculty'] = request.user.faculty_id_id
            
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SemesterDetailView(APIView):
    permission_classes = [IsAuthenticated]

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


class CurrentSemesterView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Obtener el semestre actual de la facultad del usuario",
        responses={200: SemesterSerializer},
    )
    def get(self, request):
        faculty_id = request.user.faculty_id_id
        if not faculty_id:
            return Response(
                {"error": "El usuario no tiene facultad asignada"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Buscamos el semestre más reciente (asumido como el actual) para la facultad
        semester = Semester.objects.filter(
            faculty_id=faculty_id
        ).order_by("-year", "-number").first()

        if not semester:
            return Response(
                {"error": "No se encontró ningún semestre registrado para esta facultad"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = SemesterSerializer(semester)
        return Response(serializer.data)


class CloseSemesterView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Cerrar el semestre actual",
        description="Marca el semestre más reciente como 'ARCHIVED' y elimina Evaluaciones, SectionControl (Analytics) y Secciones asociadas.",
        responses={200: OpenApiTypes.OBJECT, 400: OpenApiTypes.OBJECT, 404: OpenApiTypes.OBJECT},
    )
    def post(self, request):
        faculty_id = request.user.faculty_id_id
        if not faculty_id:
            return Response(
                {"error": "El usuario no tiene facultad asignada"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Identificamos el semestre actual (el más reciente)
        semester = Semester.objects.filter(
            faculty_id=faculty_id
        ).order_by("-year", "-number").first()

        if not semester:
            return Response(
                {"error": "No se encontró ningún semestre para cerrar"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if semester.status == "archived":
            return Response(
                {"error": "El semestre actual ya se encuentra archivado"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                semester.status = "archived"
                semester.save()

                sections_qs = CourseSection.objects.filter(semester=semester)

                StudentEvaluation.objects.filter(course_section__in=sections_qs).delete()
                SectionControl.objects.filter(course_section__in=sections_qs).delete()
                Comment.objects.filter(course_section__in=sections_qs).delete()
                TrainingHours.objects.filter(semester=semester).delete()
                Contract.objects.filter(faculty_id=faculty_id, is_active=True).update(is_active=False)
                Course.objects.filter(faculty_id=faculty_id, is_active=True).update(is_active=False)

                # 5. Eliminar análisis de IA asociados al semestre
                analytics_models = [
                    (CourseAnalysisAI, "analytics_courseanalysisai"),
                    (CourseGeneralRecomendationsAI, "analytics_coursegeneralrecomendationsai"),
                    (TeacherCommentsAnalysisAI, "analytics_teachercommentsanalysisai"),
                    (TeacherGeneralRecomendationsAI, "analytics_teachergeneralrecomendationsai"),
                    (TeacherProfileAnalysisAI, "analytics_teacherprofileanalysisai"),
                    (TeacherAnalysisAI, "analytics_teacheranalysisai"), # El que causaba el error
                ]

                existing_tables = connection.introspection.table_names()

                for model, table_name in analytics_models:
                    if model and table_name in existing_tables:
                        model.objects.filter(semester=semester).delete()
                
                with connection.cursor() as cursor:
                    cursor.execute(
                        f'DELETE FROM "{CourseSection._meta.db_table}" WHERE "semester_id" = %s',
                        [semester.id]
                    )

            
            from django.core.cache import cache
            cache_key = f"teacher_stats_full_data_fac_{faculty_id}_sem_{semester.id}"
            cache.delete(cache_key)


            return Response(
                {"message": f"Semestre {semester.year}-{semester.number} cerrado y datos limpiados exitosamente."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": f"Error al procesar el cierre de semestre: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TeacherStatsDetailView(APIView):
    @extend_schema(
        summary="Estadísticas de un docente",
        responses={200: TeacherStatsSerializer},
    )
    def get(self, request, pk):
        from django.shortcuts import get_object_or_404

        teacher = get_object_or_404(Teacher, pk=pk)
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
        return Response(TeacherStatsSerializer(data).data)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 8 
    page_size_query_param = 'page_size'
    max_page_size = 100

class TeacherStatsListView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

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
        faculty_id = request.user.faculty_id_id
        if not faculty_id:
            return Response(
                {"error": "El usuario no tiene facultad asignada"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    
        semester_id = request.query_params.get('semester_id')
        cache_key = f"teacher_stats_full_data_fac_{faculty_id}_sem_{semester_id}"
        cached_data = cache.get(cache_key)

        if not cached_data:
            promedio_global_facultad = StudentEvaluation.objects.filter(
                course_section__semester__faculty_id=faculty_id
            ).aggregate(m=Avg("score"))["m"] or 0.0

            teachers_qs = Teacher.objects.filter(
                contract__faculty_id=faculty_id,
                contract__is_active=True
            ).distinct().order_by('id')

            eval_subquery = StudentEvaluation.objects.filter(
                course_section__teacher_id=OuterRef("pk"),
                course_section__semester__faculty_id=faculty_id
            ).values("course_section__teacher_id").annotate(
                avg_score=Avg("score"),
                total=Count("id")
            )

            teachers_annotated = teachers_qs.annotate(
                promedio=Coalesce(Subquery(eval_subquery.values("avg_score")[:1]), 0.0),
                total_evals=Coalesce(Subquery(eval_subquery.values("total")[:1]), 0),
            )

            cursos_qs = CourseSection.objects.select_related("course").filter(
                semester__faculty_id=faculty_id
            ).values("teacher_id", "course__name").distinct()
            
            cursos_map = {}
            for c in cursos_qs:
                cursos_map.setdefault(c["teacher_id"], []).append(c["course__name"])

            history_qs = TeacherCourseHistory.objects.filter(
                semester__faculty_id=faculty_id
            ).values("teacher_id", "semester_id").annotate(
                avg_score=Avg("student_score")
            ).order_by("teacher_id", "-semester_id")

            history_map = {}
            for h in history_qs:
                history_map.setdefault(h["teacher_id"], []).append(h)

            all_teachers_data = []
            for teacher in teachers_annotated:
                historico = history_map.get(teacher.id, [])[:2]
                tendencia = 0.0
                if len(historico) == 2 and historico[1]["avg_score"] > 0:
                    tendencia = ((historico[0]["avg_score"] - historico[1]["avg_score"]) / historico[1]["avg_score"]) * 100

                recomendado = 0.0
                if promedio_global_facultad > 0 and teacher.promedio > 0:
                    recomendado = ((teacher.promedio - promedio_global_facultad) / promedio_global_facultad) * 100

                all_teachers_data.append({
                    "teacher_id": teacher.id,
                    "teacher_name": teacher.name,
                    "cursos_impartidos": cursos_map.get(teacher.id, []),
                    "promedio_general": round(teacher.promedio, 2),
                    "tendencia_mejora": f"{round(tendencia, 2)}%",
                    "evaluaciones_total": teacher.total_evals,
                    "recomendado_vs_otros": f"{round(recomendado, 2)}%" if teacher.promedio > 0 else "Sin datos"
                })

            cached_data = {
                "all_teachers_data": all_teachers_data,
                "promedio_global": promedio_global_facultad
            }
            cache.set(cache_key, cached_data, 60) 
        
        all_teachers_data = cached_data["all_teachers_data"]
        promedio_global_facultad = cached_data["promedio_global"]

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(all_teachers_data, request)
        
        response = paginator.get_paginated_response(page)

        final_data = {
            "count": response.data["count"],
            "next": response.data["next"],
            "previous": response.data["previous"],
            "teachers": all_teachers_data, 
            "teachers_paginated": response.data["results"], 
            "promedio_global_facultad": round(promedio_global_facultad, 2)
        }

        return Response(final_data)
      
class FacultyHistoricalView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Evolución histórica de docentes por facultad",
        parameters=[
            OpenApiParameter(
                name="faculty",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="ID de la facultad",
                required=True,
            )
        ],
        responses={200: SemesterHistoricalSerializer(many=True)},
    )
    def get(self, request):
        faculty_id = request.user.faculty_id_id
        if not faculty_id:
            return Response(
                {"error": "El usuario no tiene facultad asignada"},
                status=400,
            )

        semesters = get_historical_semesters(faculty_id)
        if not semesters:
            return Response([])

        current_id = semesters[0].id

        teacher_ids = Contract.objects.filter(
            faculty_id=faculty_id, is_active=True
        ).values_list("teacher_id", flat=True)

        teachers = Teacher.objects.filter(id__in=teacher_ids)
        result = []

        for teacher in teachers:
            teacher_data = {
                "teacher_id": teacher.id,
                "teacher_name": teacher.name,
                "semesters": [],
            }
            for semester in semesters:
                avg = TeacherCourseHistory.objects.filter(
                    teacher_id=teacher.id, semester_id=semester.id
                ).aggregate(avg_score=Avg("student_score"))["avg_score"]
                teacher_data["semesters"].append(
                    {
                        "semester_id": semester.id,
                        "semester_label": f"{semester.year} - {semester.number}",
                        "avg_score": round(avg, 2) if avg is not None else None,
                        "is_current": semester.id == current_id,
                    }
                )
            result.append(teacher_data)

        return Response(result)


class CourseSectionByFacultyView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Docentes asignados a cada sección por facultad y semestre",
        parameters=[
            OpenApiParameter(
                name="semester",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="ID del semestre",
                required=True,
            ),
        ],
        responses={200: CourseSectionSerializer(many=True)},
    )
    def get(self, request):
        faculty_id = request.user.faculty_id_id
        semester_id = request.query_params.get("semester")

        if not faculty_id:
            return Response(
                {"error": "El usuario no tiene facultad asignada"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not semester_id:
            return Response(
                {"error": "El parámetro semester es requerido"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sections = (
            CourseSection.objects.filter(
                semester_id=semester_id,
                course__faculty_id=faculty_id,
            )
            .select_related("course", "teacher")
            .order_by("section_number")
        )

        result = [
            {
                "section_id": section.id,
                "section_number": section.section_number,
                "shift": section.shift,
                "course_id": section.course.id,
                "course_name": section.course.name,
                "teacher_id": section.teacher.id if section.teacher else None,
                "teacher_name": section.teacher.name if section.teacher else None,
            }
            for section in sections
        ]

        serializer = CourseSectionSerializer(result, many=True)
        return Response(serializer.data)


class TopCoursesByScoreView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Top 4 cursos con mejores punteos de control docente",
        parameters=[
            OpenApiParameter(
                name="semester",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="ID del semestre",
                required=True,
            ),
        ],
        responses={200: TopCourseSerializer(many=True)},
    )
    def get(self, request):
        faculty_id = request.user.faculty_id_id
        semester_id = request.query_params.get("semester")

        if not faculty_id:
            return Response(
                {"error": "El usuario no tiene facultad asignada"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not semester_id:
            return Response(
                {"error": "El parámetro semester es requerido"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sections = CourseSection.objects.filter(
            semester_id=semester_id,
            course__faculty_id=faculty_id,
            control_score__isnull=False,
        ).select_related("course")

        course_scores: dict[int, list[float]] = {}
        course_names: dict[int, str] = {}

        for section in sections:
            course = section.course
            if course.id not in course_scores:
                course_scores[course.id] = []
                course_names[course.id] = course.name
            course_scores[course.id].append(section.control_score)

        result = [
            {
                "course_id": course_id,
                "course_name": course_names[course_id],
                "punteo": round(sum(scores) / len(scores), 2),
            }
            for course_id, scores in course_scores.items()
        ]

        result.sort(key=lambda x: x["punteo"], reverse=True)
        top4 = result[:4]

        serializer = TopCourseSerializer(top4, many=True)
        return Response(serializer.data)


class TeacherCourseListView(APIView):
    @extend_schema(summary="Cursos asignados por docente")
    def get(self, request, pk):
        sections = CourseSection.objects.filter(teacher_id=pk).select_related("course")

        courses_map = {}
        for s in sections:
            if s.course:
                courses_map[s.course.id] = {
                    "id": s.course.id,
                    "code": getattr(s.course, "code", f"C-{s.course.id}"),
                    "name": s.course.name,
                    "credits": getattr(s.course, "credits", 0),
                    "score": round(s.control_score, 2) if s.control_score is not None else 0.0,
                }

        course_ids = list(courses_map.keys())

        histories = TeacherCourseHistory.objects.filter(
            teacher_id=pk, course_id__in=course_ids
        ).order_by("course_id", "-semester_id")

        history_map = defaultdict(list)
        for h in histories:
            history_map[h.course_id].append(h.control_avg_score)

        result = []
        for c_id, info in courses_map.items():
            trend_str = "N/A"
            c_hist = [s for s in history_map.get(c_id, []) if s is not None]
            if len(c_hist) >= 2 and c_hist[1] > 0:
                diff = round(((c_hist[0] - c_hist[1]) / c_hist[1]) * 100, 2)
                trend_str = f"{diff}%"

            result.append(
                {
                    "id": info["id"],
                    "code": info["code"],
                    "name": info["name"],
                    "credits": info["credits"],
                    "score": info["score"],
                    "trend": trend_str,
                }
            )

        return Response({"total": len(result), "courses": result})


class CourseTeachersStatsView(APIView):
    @extend_schema(
        summary="Estadísticas de docentes por curso individual",
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request, pk):
        teachers = (
            CourseSection.objects
            .filter(course_id=pk)
            .values(
                "teacher_id",
                "teacher__name",
            )
            .annotate(
                average_rating=Avg("studentevaluation__score")
            )
            .order_by("-average_rating")
        )

        result = [
            {
                "teacher_id": t["teacher_id"],
                "teacher_name": f"{t['teacher__name']}",
                "average_rating": round(t["average_rating"], 2) if t["average_rating"] else 0,
            }
            for t in teachers
        ]

        return Response(result, status=status.HTTP_200_OK)
