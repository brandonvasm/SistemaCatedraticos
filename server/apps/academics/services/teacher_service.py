from django.db.models import Avg, Count
from apps.evaluations.models import StudentEvaluation
from apps.historical.models import TeacherCourseHistory
from apps.academics.models import CourseSection


def get_teachers_stats(faculty_id):
    if hasattr(faculty_id, "id"):
        faculty_id = faculty_id.id

    faculty_id = int(faculty_id)

    secciones = CourseSection.objects.filter(
        course__faculty_id=faculty_id
    ).select_related("teacher", "course")

    teacher_map = {}

    for s in secciones:
        if not s.teacher:
            continue

        t_id = s.teacher.id

        if t_id not in teacher_map:
            teacher_map[t_id] = {
                "teacher": s.teacher,
                "courses": set()
            }

        if s.course:
            teacher_map[t_id]["courses"].add(s.course.name)

    promedio_global = (
        StudentEvaluation.objects.filter(
            course_section__course__faculty_id=faculty_id
        ).aggregate(m=Avg("score"))["m"] or 0.0
    )

    result = []

    for t_id, data in teacher_map.items():
        teacher = data["teacher"]
        cursos = list(data["courses"])

        stats = StudentEvaluation.objects.filter(
            course_section__teacher_id=t_id,
            course_section__course__faculty_id=faculty_id
        ).aggregate(
            promedio=Avg("score"),
            total=Count("id")
        )

        promedio = stats["promedio"] or 0.0
        total = stats["total"] or 0

        if total == 0:
            continue

        historico = (
            TeacherCourseHistory.objects.filter(
                teacher_id=t_id,
                course__faculty_id=faculty_id
            )
            .values("semester_id")
            .annotate(avg_score=Avg("student_score"))
            .order_by("-semester_id")[:2]
        )

        tendencia = 0.0
        if len(historico) == 2 and historico[1]["avg_score"]:
            tendencia = (
                (historico[0]["avg_score"] - historico[1]["avg_score"])
                / historico[1]["avg_score"]
            ) * 100

        recomendado = (
            ((promedio - promedio_global) / promedio_global * 100)
            if promedio_global > 0 and promedio > 0
            else 0.0
        )

        result.append({
            "teacher_id": t_id,
            "teacher_name": teacher.name,
            "cursos_impartidos": cursos,
            "promedio_general": round(promedio, 2),
            "tendencia_mejora": round(tendencia, 2),
            "evaluaciones_total": total,
            "recomendado_vs_otros": round(recomendado, 2),
        })

    return result