from apps.academics.models import Course, CourseSection, Semester
from apps.evaluations.models import Comment

_SHIFT_MAP = {
    "matutina": "matutina",
    "vespertina": "vespertina",
    "fin de semana": "fin de semana",
    "sabatina": "fin de semana",
}


def _normalize_shift(raw: str) -> str:
    return _SHIFT_MAP.get(raw.strip().lower(), raw.strip().lower())


class InsertCommentsService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        errors = []

        for i, row in enumerate(rows):
            try:
                course_name = str(row.get("Curso", "")).strip()
                section_number = str(row.get("Sección", "")).strip()
                shift = _normalize_shift(str(row.get("Jornada", "")))
                content = str(row.get("Comentario", "")).strip()

                if not course_name or not section_number or not content:
                    errors.append(f"Row {i}: Curso, Sección and Comentario are required")
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
                        f"Row {i}: section {section_number}/{shift} for '{course_name}' not found"
                    )
                    continue

                Comment.objects.create(course_section=section, content=content)
                created += 1

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        Semester.objects.filter(id=semester_id).update(comments_loaded=True)

        return {"created": created, "errors": errors}
