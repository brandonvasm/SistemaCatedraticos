from apps.academics.models import Course, CourseSection, Semester
from apps.evaluations.models import Comment


class InsertCommentsService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        errors = []

        for i, row in enumerate(rows):
            try:
                course_name = str(row.get("Curso", "")).strip()
                section_number = str(row.get("Sección", "")).strip()
                teacher_code = str(row.get("Código Docente", "")).strip()
                comments: list[str] = row.get("Comentarios", [])

                if not course_name or not comments:
                    errors.append(f"Row {i}: Curso and Comentarios are required")
                    continue

                try:
                    course = Course.objects.get(name=course_name, faculty_id=faculty_id)
                except Course.DoesNotExist:
                    errors.append(f"Row {i}: course '{course_name}' not found in faculty {faculty_id}")
                    continue
                except Course.MultipleObjectsReturned:
                    errors.append(f"Row {i}: multiple courses named '{course_name}' in faculty {faculty_id}")
                    continue

                section_filter = {
                    "course": course,
                    "semester_id": semester_id,
                }

                sections = None

                if section_number:
                    section_filter["section_number"] = section_number
                    sections = CourseSection.objects.filter(**section_filter)

                elif teacher_code:
                    section_filter["teacher__code"] = teacher_code
                    sections = CourseSection.objects.filter(**section_filter)
                

                if not sections.exists():
                    errors.append(
                        f"Row {i}: section for '{course_name}' "
                        f"(sección={section_number}, código={teacher_code}) not found"
                    )
                    continue

                for section in sections:
                    for content in comments:
                        Comment.objects.create(course_section=section, content=content)
                        created += 1

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        Semester.objects.filter(id=semester_id).update(comments_loaded=True)

        return {"created": created, "errors": errors}
