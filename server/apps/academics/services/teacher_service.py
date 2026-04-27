from django.db.models import Avg, Count
from apps.evaluations.models import StudentEvaluation
from apps.historical.models import TeacherCourseHistory
from apps.academics.models import Contract, CourseSection, Teacher


def get_teachers_stats(faculty_id):
    teacher_ids = Contract.objects.filter(
        faculty_id=faculty_id, is_active=True
    ).values_list("teacher_id", flat=True)

    teachers = Teacher.objects.filter(id__in=teacher_ids)

    result = []

    promedio_global = (
        StudentEvaluation.objects.aggregate(m=Avg("score"))["m"] or 0.0
    )

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
                "tendencia_mejora": round(tendencia, 2),
                "evaluaciones_total": total,
                "recomendado_vs_otros": round(recomendado, 2)
                if promedio > 0
                else None,
            }
        )

    return result