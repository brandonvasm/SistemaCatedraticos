from apps.academics.models import CourseSection, Semester, Teacher
from apps.evaluations.models import StudentEvaluation
from apps.historical.models import TeacherCourseHistory


def _performance_level(score: float) -> str:
    if score < 60:
        return "low"
    if score <= 80:
        return "medium"
    return "high"


class InsertEvaluationService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        errors = []

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

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        Semester.objects.filter(id=semester_id).update(evaluation_loaded=True)

        return {"created": created, "errors": errors}
