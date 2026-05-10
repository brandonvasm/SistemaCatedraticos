from django.db.models import Avg, Count, OuterRef, Subquery
from django.db.models.functions import Coalesce

from apps.evaluations.models import StudentEvaluation
from apps.historical.models import TeacherCourseHistory
from apps.academics.models import CourseSection, Teacher
from apps.academics.models import Contract


def get_teachers_stats(faculty_id):
    if hasattr(faculty_id, "id"):
        faculty_id = faculty_id.id

    faculty_id = int(faculty_id)

    promedio_global_facultad = StudentEvaluation.objects.filter(
        course_section__semester__faculty_id=faculty_id
    ).aggregate(m=Avg("score"))["m"] or 0.0

    teachers_qs = Teacher.objects.filter(
        contract__faculty_id=faculty_id,
        contract__is_active=True
    ).distinct().order_by("id")

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

    result = []

    for teacher in teachers_annotated:
        historico = history_map.get(teacher.id, [])[:2]

        tendencia = 0.0

        if len(historico) == 2 and historico[1]["avg_score"]:
            tendencia = (
                (historico[0]["avg_score"] - historico[1]["avg_score"])
                / historico[1]["avg_score"]
            ) * 100

        recomendado = 0.0

        if promedio_global_facultad > 0 and teacher.promedio > 0:
            recomendado = (
                (teacher.promedio - promedio_global_facultad)
                / promedio_global_facultad
            ) * 100

        result.append({
            "teacher_id": teacher.id,
            "teacher_name": teacher.name,
            "cursos_impartidos": cursos_map.get(teacher.id, []),
            "promedio_general": round(teacher.promedio, 2),
            "tendencia_mejora": round(tendencia, 2),
            "evaluaciones_total": teacher.total_evals,
            "recomendado_vs_otros": round(recomendado, 2),
        })

    return result