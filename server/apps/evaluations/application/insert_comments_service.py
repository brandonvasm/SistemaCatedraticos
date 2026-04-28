from apps.academics.models import Course, CourseSection, Semester
from apps.evaluations.models import Comment


class InsertCommentsService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        """
        Expects rows from ComentariosValidator output. Key field names:
          "Curso", "Catedrático", "Comentario"

        Note: the comments file does not include Sección/Jornada, so the lookup
        is by course name + teacher name. If a teacher has multiple sections of
        the same course, a comment is created for each matching section.
        """
        created = 0
        errors = []

        for i, row in enumerate(rows):
            try:
                course_name = str(row.get("Curso", "")).strip()
                teacher_name = str(row.get("Catedrático", "")).strip()
                content = str(row.get("Comentario", "")).strip()

                if not course_name or not content:
                    errors.append(f"Row {i}: Curso and Comentario are required")
                    continue

                try:
                    course = Course.objects.get(name=course_name, faculty_id=faculty_id)
                except Course.DoesNotExist:
                    errors.append(f"Row {i}: course '{course_name}' not found in faculty {faculty_id}")
                    continue
                except Course.MultipleObjectsReturned:
                    errors.append(f"Row {i}: multiple courses named '{course_name}' in faculty {faculty_id}")
                    continue

                sections = CourseSection.objects.filter(
                    course=course,
                    teacher__name=teacher_name,
                )

                if not sections.exists():
                    errors.append(
                        f"Row {i}: no section found for course '{course_name}' and teacher '{teacher_name}'"
                    )
                    continue

                for section in sections:
                    Comment.objects.create(course_section=section, content=content)
                    created += 1

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        Semester.objects.filter(id=semester_id).update(comments_loaded=True)

        return {"created": created, "errors": errors}
