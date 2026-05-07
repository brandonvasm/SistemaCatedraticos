
from django.db.models import Avg, Count, OuterRef, Subquery, Q
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from django.db.models.functions import Coalesce
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from collections import defaultdict
from django.db.models import Avg, Count
from rest_framework.pagination import PageNumberPagination
from django.core.cache import cache

from apps.evaluations.models import SectionControl, StudentEvaluation
from apps.historical.models import TeacherCourseHistory

from .models import Contract, CourseSection, Faculty, Semester, Teacher
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
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        faculty_id = request.query_params.get("faculty")
        page_number = request.query_params.get("page", 1)
        
        if not faculty_id:
            return Response({"error": "Faculty id requerido"}, status=400)

        cache_key = f"teacher_stats_fac_{faculty_id}_p{page_number}"
        cached_response = cache.get(cache_key)
        if cached_response:
            return Response(cached_response)

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

       
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(all_teachers_data, request)
        
        response_data = {
            "count": len(all_teachers_data),
            "teachers": all_teachers_data, 
            "teachers_paginated": page if page is not None else all_teachers_data[:8],
            "promedio_global_facultad": round(promedio_global_facultad, 2)
        }

        cache.set(cache_key, response_data, 600) 
        return Response(response_data)
      
class FacultyHistoricalView(APIView):
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
        faculty_id = request.query_params.get("faculty")
        if not faculty_id:
            return Response(
                {"error": "El parámetro faculty es requerido"},
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
    @extend_schema(
        summary="Docentes asignados a cada sección por facultad y semestre",
        parameters=[
            OpenApiParameter(
                name="faculty",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="ID de la facultad",
                required=True,
            ),
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
        faculty_id = request.query_params.get("faculty")
        semester_id = request.query_params.get("semester")

        if not faculty_id or not semester_id:
            return Response(
                {"error": "Los parámetros faculty y semester son requeridos"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sections = (
            CourseSection.objects.filter(
                semester_id=semester_id,
                course__cost_center__faculty_id=faculty_id,
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
    @extend_schema(
        summary="Top 4 cursos con mejores punteos de control docente",
        parameters=[
            OpenApiParameter(
                name="faculty",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                description="ID de la facultad",
                required=True,
            ),
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
        faculty_id = request.query_params.get("faculty")
        semester_id = request.query_params.get("semester")

        if not faculty_id or not semester_id:
            return Response(
                {"error": "Los parámetros faculty y semester son requeridos"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sections = CourseSection.objects.filter(
            semester_id=semester_id,
            course__cost_center__faculty_id=faculty_id,
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
    @extend_schema (
            summary = "Cursos asignados por docente"
            
    )
    def get(self, request, pk):
        sections = CourseSection.objects.filter(teacher_id=pk).select_related("course")
        
        courses_map = {}
        for s in sections:
            if s.course:
                courses_map[s.course.id] = {
                    "id": s.course.id,
                    "code": getattr(s.course, 'code', f"C-{s.course.id}"),
                    "name": s.course.name,
                    "credits": getattr(s.course, 'credits', 0)
                }

        course_ids = list(courses_map.keys())

        controls = SectionControl.objects.filter(
            course_section__teacher_id=pk
        ).select_related("course_section__course")

        scores_by_course = defaultdict(list)
        for ctrl in controls:
            high, mid, low = ctrl.high_count, ctrl.medium_count, ctrl.low_count
            total = high + mid + low
            score = (total / high * 100) if high > 0 else 0.0
            scores_by_course[ctrl.course_section.course_id].append(score)
        histories = TeacherCourseHistory.objects.filter(
            teacher_id=pk, 
            course_id__in=course_ids
        ).order_by("course_id", "-semester_id")

        history_map = defaultdict(list)
        for h in histories:
            history_map[h.course_id].append(h.student_score)

        result = []
        for c_id, info in courses_map.items():
            course_scores = scores_by_course.get(c_id, [])
            avg_score = sum(course_scores) / len(course_scores) if course_scores else 0.0
            
            trend_str = "N/A"
            c_hist = history_map.get(c_id, [])
            if len(c_hist) >= 2 and c_hist[1] > 0:
                diff = round(((c_hist[0] - c_hist[1]) / c_hist[1]) * 100, 2)
                trend_str = f"{diff}%"

            result.append({
                "id": info["id"],
                "code": info["code"],
                "name": info["name"],
                "credits": info["credits"],
                "score": round(avg_score, 2),
                "trend": trend_str
            })

        return Response({"total": len(result), "courses": result})


class CourseTeachersStatsView(APIView):
    @extend_schema(
        summary="Estadísticas de docentes por curso individual",
        responses={200: OpenApiTypes.OBJECT},
    )
    def get(self, request, pk):
        from django.shortcuts import get_object_or_404
        controls = SectionControl.objects.filter(
            course_section__course_id=pk
        ).select_related("course_section__teacher")

        teacher_scores = defaultdict(list)
        teacher_names = {}

        for control in controls:
            teacher = control.course_section.teacher
            if not teacher:
                continue
                
            high = control.high_count
            mid = control.medium_count
            low = control.low_count

            punteo = ((high + mid + low) / high) * 100 if high > 0 else 0.0

            if teacher.id not in teacher_scores:
                teacher_scores[teacher.id] = []
                teacher_names[teacher.id] = teacher.name

            teacher_scores[teacher.id].append(punteo)

        result = [
            {
                "teacher_id": t_id,
                "teacher_name": teacher_names[t_id],
                "average_rating": round(sum(scores) / len(scores), 2)
            }
            for t_id, scores in teacher_scores.items()
        ]

        result.sort(key=lambda x: x["average_rating"], reverse=True)

        return Response(result, status=status.HTTP_200_OK)