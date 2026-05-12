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

        for i, row in enumerate(rows, start=1):
            row_number = row.get("__excel_row__", i)
            try:
                course_name = str(row.get("Curso", "")).strip()
                section_number = str(row.get("Sección", "")).strip()
                shift = _normalize_shift(str(row.get("Jornada", "")))
                teacher_name = str(row.get("Catedrático", "")).strip()
                content = str(row.get("Comentario", "")).strip()

                if not course_name or not content:
                    errors.append(f"Fila {row_number}: Curso y Comentario son obligatorios.")
                    continue

                try:
                    course = Course.objects.get(name=course_name, faculty_id=faculty_id)
                except Course.DoesNotExist:
                    errors.append(f"Fila {row_number}: no se encontró el curso '{course_name}' en la facultad {faculty_id}.")
                    continue
                except Course.MultipleObjectsReturned:
                    errors.append(f"Fila {row_number}: hay varios cursos llamados '{course_name}' en la facultad {faculty_id}.")
                    continue

                if section_number and shift:
                    sections = CourseSection.objects.filter(
                        course=course,
                        semester_id=semester_id,
                        section_number=section_number,
                        shift=shift,
                    )
                else:
                    sections = CourseSection.objects.filter(
                        course=course,
                        semester_id=semester_id,
                        teacher__name=teacher_name,
                    )

                if not sections.exists():
                    errors.append(
                        f"Fila {row_number}: no se encontró una sección para el curso '{course_name}'."
                    )
                    continue

                for section in sections:
                    Comment.objects.create(course_section=section, content=content)
                    created += 1

            except Exception as e:
                errors.append(f"Fila {row_number}: {e}")

        Semester.objects.filter(id=semester_id).update(comments_loaded=True)

        return {"created": created, "errors": errors}
