from datetime import date

from apps.academics.models import Career, Contract, Course, CourseSection, Semester, Teacher

_SHIFT_MAP = {
    "Matutina": "matutina",
    "Vespertina": "vespertina",
    "Fin de semana": "fin de semana",
    "Sabatina": "fin de semana",
}


def _normalize_shift(raw: str) -> str:
    return _SHIFT_MAP.get(raw.strip().lower(), raw.strip().lower())


class InsertNominaService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        updated = 0
        errors = []

        for i, row in enumerate(rows):
            try:
                teacher_name = str(row.get("Docente", "")).strip()
                teacher_code = str(row.get("Código  docente", "")).strip()
                appointment_number = str(row.get("Nombramiento", "")).strip()
                career_abbr = str(row.get("Carrera", "")).strip()
                course_name = str(row.get("Curso", "")).strip()
                section_number = str(row.get("Sección", "")).strip()
                shift = _normalize_shift(str(row.get("Jornada", "")))
                credits_raw = row.get("Total de Creditos")
                credits = int(credits_raw) if credits_raw is not None else None

                if not teacher_code or not course_name or not section_number:
                    errors.append(f"Row {i}: Docente, Curso and Sección are required")
                    continue

                try:
                    career = Career.objects.get(abbreviation=career_abbr, faculty_id=faculty_id)
                except Career.DoesNotExist:
                    errors.append(
                        f"Row {i}: career with abbreviation '{career_abbr}' not found in faculty {faculty_id}. "
                        "Set the abbreviation on the career before uploading the nomina."
                    )
                    continue

                try:
                    course = Course.objects.get(name=course_name, faculty_id=faculty_id)
                except Course.DoesNotExist:
                    errors.append(f"Row {i}: course '{course_name}' not found in faculty {faculty_id}")
                    continue
                except Course.MultipleObjectsReturned:
                    errors.append(f"Row {i}: multiple courses named '{course_name}' in faculty {faculty_id}")
                    continue

                teacher, _ = Teacher.objects.get_or_create(
                    identity_code=teacher_code,
                    defaults={"name": teacher_name, "created_at": date.today()},
                )

                Contract.objects.get_or_create(
                    teacher=teacher,
                    faculty_id=faculty_id,
                    defaults={"is_active": True},
                )

                _, s_created = CourseSection.objects.update_or_create(
                    course=course,
                    section_number=section_number,
                    shift=shift,
                    defaults={
                        "semester_id": semester_id,
                        "teacher": teacher,
                        "appointment_number": appointment_number,
                        "credits": credits,
                    },
                )

                if s_created:
                    created += 1
                else:
                    updated += 1

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        Semester.objects.filter(id=semester_id).update(roster_loaded=True)

        return {"created": created, "updated": updated, "errors": errors}
