from apps.academics.models import Course, CourseSection, Semester, Teacher
from apps.evaluations.models import StudentEvaluation
from apps.historical.models import TeacherCourseHistory

_SHIFT_MAP = {
    "Matutina": "matutina",
    "Vespertina": "vespertina",
    "Fin de semana": "fin de semana",
    "Sabatina": "fin de semana",
}


def _normalize_shift(raw: str) -> str:
    return _SHIFT_MAP.get(raw.strip().lower(), raw.strip().lower())


def _performance_level(score: float) -> str:
    if score < 60:
        return "low"
    if score <= 80:
        return "medium"
    return "high"


class InsertEvaluationService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        """
        Expects rows from EvaluacionDocenteValidator output. Key field names:
          "Código", "Catedrático", "Resultado", "No. Nombramiento",
          "Jornada", "Curso", "Sección",
          "Estudiantes que realizaron la evaluación", "Estudiantes Asignados"
        """
        created = 0
        errors = []

        for i, row in enumerate(rows):
            try:
                teacher_code = str(row.get("Código", "")).strip()
                course_name = str(row.get("Curso", "")).strip()
                section_number = str(row.get("Sección", "")).strip()
                shift = _normalize_shift(str(row.get("Jornada", "")))
                score_raw = row.get("Resultado")
                submitted_raw = row.get("Estudiantes que realizaron la evaluación")
                assigned_raw = row.get("Estudiantes Asignados")

                if not teacher_code or not course_name or not section_number:
                    errors.append(f"Row {i}: Código, Curso and Sección are required")
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
                    course = Course.objects.get(name=course_name, faculty_id=faculty_id)
                except Course.DoesNotExist:
                    errors.append(f"Row {i}: course '{course_name}' not found in faculty {faculty_id}")
                    continue
                except Course.MultipleObjectsReturned:
                    errors.append(f"Row {i}: multiple courses named '{course_name}' in faculty {faculty_id}")
                    continue

                try:
                    section = CourseSection.objects.get(
                        course=course,
                        section_number=section_number,
                        shift=shift,
                    )
                except CourseSection.DoesNotExist:
                    errors.append(
                        f"Row {i}: section {section_number}/{shift} for '{course_name}' not found — upload nomina first"
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

                # Historical: update student_score for this teacher+course in this semester
                TeacherCourseHistory.objects.update_or_create(
                    teacher=teacher,
                    semester_id=semester_id,
                    course=course,
                    defaults={"student_score": score},
                )

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        Semester.objects.filter(id=semester_id).update(evaluation_loaded=True)

        return {"created": created, "errors": errors}
