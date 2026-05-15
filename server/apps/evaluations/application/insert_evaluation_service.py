import math

from django.db.models import Avg

from apps.academics.models import CourseSection, Semester, Teacher
from apps.analytics.infrastructure.gemini_ai_client import GeminiAIClient
from apps.analytics.models import TeacherProfileAnalysisAI, TeacherGeneralRecomendationsAI
from apps.evaluations.models import StudentEvaluation
from apps.historical.models import TeacherCourseHistory, TeacherLoadHistory

_SHIFT_MAP = {
    "matutina": "matutina",
    "vespertina": "vespertina",
    "fin de semana": "fin de semana",
    "sabatina": "fin de semana",
}


def _normalize_shift(raw: str) -> str:
    return _SHIFT_MAP.get(raw.strip().lower(), raw.strip().lower())


def _performance_level(score: float) -> str:
    if score < 60:
        return "low"
    if score <= 80:
        return "medium"
    return "high"


def _limit_text(value: object, max_length: int) -> str:
    return str(value or "").strip()[:max_length]


def _float_or_zero(value, field_name: str) -> float:
    if value in (None, "") or (isinstance(value, float) and math.isnan(value)):
        return 0.0

    try:
        return float(value)
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} debe ser numérico.")


def _int_or_zero(value, field_name: str) -> int:
    return int(_float_or_zero(value, field_name))


def _trigger_teacher_ai_analysis(processed_teachers: set[int], semester_id: int) -> list[str]:
    errors = []
    try:
        current_semester = Semester.objects.get(id=semester_id)
        prev_semester = (
            Semester.objects.filter(faculty_id=current_semester.faculty_id)
            .exclude(id=semester_id)
            .order_by("-year", "-number")
            .first()
        )

        teachers_data = []
        for teacher_id in processed_teachers:
            current_avg = TeacherCourseHistory.objects.filter(
                teacher_id=teacher_id,
                semester_id=semester_id,
                student_score__isnull=False,
            ).aggregate(avg=Avg("student_score"))["avg"]

            if current_avg is None:
                continue

            current_score = round(current_avg, 2)

            if current_score > 85:
                continue

            tendency = None
            if prev_semester:
                prev_avg = TeacherCourseHistory.objects.filter(
                    teacher_id=teacher_id,
                    semester_id=prev_semester.id,
                    student_score__isnull=False,
                ).aggregate(avg=Avg("student_score"))["avg"]
                if prev_avg:
                    tendency = round(
                        (current_score - prev_avg) / prev_avg * 100, 2
                    )

            load = TeacherLoadHistory.objects.filter(
                teacher_id=teacher_id, semester_id=semester_id
            ).first()

            teachers_data.append({
                "id_teacher": teacher_id,
                "score": current_score,
                "tendency": tendency,
                "managed_credits": load.managed_credits if load else None,
            })

        if not teachers_data:
            return errors

        ai_client = GeminiAIClient()
        response = ai_client.generate_teacher_profile_analysis(teachers_data)
        for recomendation in response["recomendations"]:
            try:
                TeacherGeneralRecomendationsAI.objects.create(
                    semester_id=semester_id,
                    recomendation=_limit_text(recomendation, 100),
                    model_version=ai_client.model_version,
                )
            except Exception as e:
                errors.append(f"No se pudo guardar la recomendación general generada por IA: {e}")

        for analysis in response["analyses"]:
            try:
                TeacherProfileAnalysisAI.objects.create(
                    teacher_id=analysis["teacher_id"],
                    semester_id=semester_id,
                    title=_limit_text(analysis.get("title"), 40),
                    profile_overview=_limit_text(analysis.get("profile_recomendation"), 100),
                    perception=_limit_text(analysis.get("perception"), 20) or "neutral",
                    model_version=ai_client.model_version,
                )
            except Exception as e:
                errors.append(f"No se pudo guardar el análisis de IA del docente {analysis['teacher_id']}: {e}")
    except Exception as e:
        errors.append(f"No se pudo generar el análisis de docentes con IA: {e}")

    return errors


class InsertEvaluationService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        errors = []
        processed_teachers: set[int] = set()

        teacher_codes = {str(row.get("Código", "")).strip() for row in rows}
        appointment_numbers = {str(row.get("No. Nombramiento", "")).strip() for row in rows}

        teachers_map = {
            t.identity_code: t
            for t in Teacher.objects.filter(identity_code__in=teacher_codes)
        }
        sections_map = {
            s.appointment_number: s
            for s in CourseSection.objects.filter(
                semester_id=semester_id,
                appointment_number__in=appointment_numbers,
            ).select_related("course")
        }

        evaluations_to_create = []
        history_scores: dict[tuple[int, int], float] = {}

        for i, row in enumerate(rows, start=1):
            row_number = row.get("__excel_row__", i)
            try:
                teacher_code = str(row.get("Código", "")).strip()
                appointment_number = str(row.get("No. Nombramiento", "")).strip()
                score_raw = row.get("Resultado")
                submitted_raw = row.get("Estudiantes que realizaron la evaluación")
                assigned_raw = row.get("Estudiantes Asignados")

                if not teacher_code or not appointment_number:
                    errors.append(f"Fila {row_number}: Código y No. Nombramiento son obligatorios.")
                    continue

                score = _float_or_zero(score_raw, "Resultado")
                submitted = _int_or_zero(submitted_raw, "Estudiantes que realizaron la evaluación")
                assigned = _int_or_zero(assigned_raw, "Estudiantes Asignados")

                teacher = teachers_map.get(teacher_code)
                if teacher is None:
                    errors.append(f"Fila {row_number}: no se encontró el docente con código '{teacher_code}'. Cargue la nómina antes de procesar evaluaciones.")
                    continue

                section = sections_map.get(appointment_number)
                if section is None:
                    errors.append(
                        f"Fila {row_number}: no se encontró una sección para el nombramiento '{appointment_number}'. Cargue la nómina antes de procesar evaluaciones."
                    )
                    continue

                evaluations_to_create.append(StudentEvaluation(
                    course_section=section,
                    score=score,
                    submitted_count=submitted,
                    assigned_students=assigned,
                    performance_level=_performance_level(score),
                ))

                history_scores[(teacher.id, section.course_id)] = score
                processed_teachers.add(teacher.id)

            except Exception as e:
                errors.append(f"Fila {row_number}: {e}")

        if evaluations_to_create:
            StudentEvaluation.objects.bulk_create(evaluations_to_create)
            created = len(evaluations_to_create)

        if history_scores:
            teacher_ids = {k[0] for k in history_scores}
            course_ids = {k[1] for k in history_scores}
            existing_map = {
                (r.teacher_id, r.course_id): r
                for r in TeacherCourseHistory.objects.filter(
                    semester_id=semester_id,
                    teacher_id__in=teacher_ids,
                    course_id__in=course_ids,
                )
            }
            to_create = []
            to_update = []
            for (teacher_id, course_id), score in history_scores.items():
                record = existing_map.get((teacher_id, course_id))
                if record:
                    record.student_score = score
                    to_update.append(record)
                else:
                    to_create.append(TeacherCourseHistory(
                        teacher_id=teacher_id,
                        semester_id=semester_id,
                        course_id=course_id,
                        student_score=score,
                    ))
            if to_update:
                TeacherCourseHistory.objects.bulk_update(to_update, ["student_score"])
            if to_create:
                TeacherCourseHistory.objects.bulk_create(to_create)

        Semester.objects.filter(id=semester_id).update(evaluation_loaded=True)

        if processed_teachers:
            errors.extend(_trigger_teacher_ai_analysis(processed_teachers, semester_id))

        return {"created": created, "errors": errors}
