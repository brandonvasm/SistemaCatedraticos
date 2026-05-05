from django.db.models import Avg

from apps.academics.models import CourseSection, Semester, Teacher
from apps.analytics.infrastructure.gemini_ai_client import GeminiAIClient
from apps.analytics.models import TeacherProfileAnalysisAI, TeacherGeneralRecomendationsAI
from apps.evaluations.models import StudentEvaluation
from apps.historical.models import TeacherCourseHistory, TeacherLoadHistory


def _performance_level(score: float) -> str:
    if score < 60:
        return "low"
    if score <= 80:
        return "medium"
    return "high"


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
                    recomendation=recomendation,
                    model_version=ai_client.model_version,
                )
            except Exception as e:
                errors.append(f"AI save for general recommendation: {e}")

        for analysis in response["analyses"]:
            try:
                TeacherProfileAnalysisAI.objects.create(
                    teacher_id=analysis["teacher_id"],
                    semester_id=semester_id,
                    title=analysis["title"],
                    profile_overview=analysis["profile_overview"],
                    perception=analysis["perception"],
                    model_version=ai_client.model_version,
                )
            except Exception as e:
                errors.append(f"AI save for teacher {analysis['teacher_id']}: {e}")
    except Exception as e:
        errors.append(f"AI teacher analysis: {e}")

    return errors


class InsertEvaluationService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        errors = []
        processed_teachers: set[int] = set()

        for i, row in enumerate(rows):
            try:
                teacher_code = str(row.get("Código", "")).strip()
                appointment_number = str(row.get("No. Nombramiento", "")).strip()
                score_raw = row.get("Resultado")
                submitted_raw = row.get("Estudiantes que realizaron la evaluación")
                assigned_raw = row.get("Estudiantes Asignados")

                if not teacher_code or not appointment_number:
                    errors.append(f"Row {i}: Código and No. Nombramiento are required")
                    continue

                score = float(score_raw) if score_raw is not None else 0.0
                submitted = int(submitted_raw) if submitted_raw is not None else 0
                assigned = int(assigned_raw) if assigned_raw is not None else 0

                try:
                    teacher = Teacher.objects.get(identity_code=teacher_code)
                except Teacher.DoesNotExist:
                    errors.append(f"Row {i}: teacher '{teacher_code}' not found — upload nomina first")
                    continue

                try:
                    section = CourseSection.objects.get(appointment_number=appointment_number)
                except CourseSection.DoesNotExist:
                    errors.append(
                        f"Row {i}: section with appointment '{appointment_number}' not found — upload nomina first"
                    )
                    continue

                StudentEvaluation.objects.create(
                    course_section=section,
                    score=score,
                    submitted_count=submitted,
                    assigned_students=assigned,
                    performance_level=_performance_level(score),
                )
                created += 1

                TeacherCourseHistory.objects.update_or_create(
                    teacher=teacher,
                    semester_id=semester_id,
                    course=section.course,
                    defaults={"student_score": score},
                )
                processed_teachers.add(teacher.id)

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        Semester.objects.filter(id=semester_id).update(evaluation_loaded=True)

        if processed_teachers:
            errors.extend(_trigger_teacher_ai_analysis(processed_teachers, semester_id))

        return {"created": created, "errors": errors}
