from apps.academics.models import Course, CourseSection, Semester
from apps.evaluations.models import Comment


class InsertCommentsService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        errors = []

        course_names = {str(row.get("Curso", "")).strip() for row in rows}
        courses_map = {
            c.name: c
            for c in Course.objects.filter(name__in=course_names, faculty_id=faculty_id)
        }

        sections_qs = CourseSection.objects.filter(
            semester_id=semester_id,
            course__name__in=course_names,
        ).select_related("teacher")

        sections_by_number: dict[tuple[int, str], list] = {}
        sections_by_teacher: dict[tuple[int, str], list] = {}
        for s in sections_qs:
            sections_by_number.setdefault((s.course_id, s.section_number), []).append(s)
            if s.teacher:
                sections_by_teacher.setdefault((s.course_id, s.teacher.identity_code), []).append(s)

        comments_to_create = []

        for i, row in enumerate(rows, start=1):
            try:
                course_name = str(row.get("Curso", "")).strip()
                section_number = str(row.get("Sección", "")).strip()
                teacher_code = str(row.get("Código Docente", "")).strip()
                comments: list[str] = row.get("Comentarios", [])
                  
                if not course_name or not comments:
                    errors.append(f"Fila {i}: Curso y Comentario son obligatorios.")
                    continue

                course = courses_map.get(course_name)
                if course is None:
                    errors.append(f"Fila {i}: no se encontró el curso '{course_name}' en la facultad {faculty_id}.")
                    continue

                sections = []
                if section_number:
                    sections = sections_by_number.get((course.id, section_number), [])
                elif teacher_code:
                    sections = sections_by_teacher.get((course.id, teacher_code), [])

                if not sections:
                    errors.append(
                        f"Fila {i}: no se encontró una sección para el curso '{course_name}. (sección={section_number}, código={teacher_code}) no se encontró."
                    )
                    continue

                for section in sections:
                    for content in comments:
                        comments_to_create.append(Comment(course_section=section, content=content))
                        created += 1

            except Exception as e:
                errors.append(f"Fila {i}: {e}")

        if comments_to_create:
            Comment.objects.bulk_create(comments_to_create)

        Semester.objects.filter(id=semester_id).update(comments_loaded=True)

        return {"created": created, "errors": errors}
