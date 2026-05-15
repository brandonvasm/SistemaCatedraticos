from datetime import date

from apps.academics.models import Contract, Course, CourseSection, Semester, Teacher

_SHIFT_MAP = {
    "Matutina": "matutina",
    "Vespertina": "vespertina",
    "Fin de semana": "fin de semana",
    "Sabatina": "fin de semana",
}


def _normalize_shift(raw: str) -> str:
    return _SHIFT_MAP.get(raw.strip().lower(), raw.strip().lower())


def _first_value(row: dict, *keys: str):
    for key in keys:
        value = row.get(key)
        if value not in (None, ""):
            return value
    return None


class InsertNominaService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        updated = 0
        errors = []

        course_names = {str(row.get("Curso", "")).strip() for row in rows}
        teacher_codes = {
            str(_first_value(row, "Código docente", "Código  docente") or "").strip()
            for row in rows
        }
        teacher_codes.discard("")

        courses_map = {
            c.name: c
            for c in Course.objects.filter(
                name__in=course_names, faculty_id=faculty_id
            ).prefetch_related("careers")
        }
        career_by_course_abbr: dict[tuple[int, str], object] = {}
        for course in courses_map.values():
            for career in course.careers.all():
                career_by_course_abbr[(course.id, career.abbreviation)] = career

        existing_teachers = {
            t.identity_code: t
            for t in Teacher.objects.filter(identity_code__in=teacher_codes)
        }
        new_codes = teacher_codes - existing_teachers.keys()
        if new_codes:
            names_by_code = {}
            for row in rows:
                code = str(_first_value(row, "Código docente", "Código  docente") or "").strip()
                if code in new_codes:
                    names_by_code[code] = str(row.get("Docente", "")).strip()
            Teacher.objects.bulk_create(
                [
                    Teacher(identity_code=code, name=names_by_code.get(code, ""), created_at=date.today())
                    for code in new_codes
                ],
                ignore_conflicts=True,
            )
            existing_teachers = {
                t.identity_code: t
                for t in Teacher.objects.filter(identity_code__in=teacher_codes)
            }

        all_teacher_ids = {t.id for t in existing_teachers.values()}

        existing_contract_teacher_ids = set(
            Contract.objects.filter(
                teacher_id__in=all_teacher_ids, faculty_id=faculty_id
            ).values_list("teacher_id", flat=True)
        )
        new_contracts = [
            Contract(teacher=t, faculty_id=faculty_id, is_active=True)
            for t in existing_teachers.values()
            if t.id not in existing_contract_teacher_ids
        ]
        if new_contracts:
            Contract.objects.bulk_create(new_contracts, ignore_conflicts=True)

        all_appointment_numbers = {
            str(row.get("Nombramiento", "")).strip()
            for row in rows
            if str(row.get("Nombramiento", "")).strip()
        }
        existing_sections = {
            s.appointment_number: s
            for s in CourseSection.objects.filter(
                semester_id=semester_id,
                appointment_number__in=all_appointment_numbers,
            )
        }

        sections_to_create = []
        sections_to_update = []
        active_teacher_codes: set[str] = set()
        active_course_ids: set[int] = set()

        for i, row in enumerate(rows):
            try:
                teacher_code = str(
                    _first_value(row, "Código docente", "Código  docente") or ""
                ).strip()
                appointment_number = str(row.get("Nombramiento", "")).strip()
                career_abbr = str(
                    _first_value(row, "Clave Carrera", "Carrera") or ""
                ).strip()
                course_name = str(row.get("Curso", "")).strip()
                section_number = str(row.get("Sección", "")).strip()
                shift = _normalize_shift(str(row.get("Jornada", "")))
                credits_raw = _first_value(row, "Total de créditos", "Total de Creditos")
                credits = int(credits_raw) if credits_raw is not None else None

                if not teacher_code or not course_name or not section_number:
                    errors.append(f"Row {i}: Docente, Curso and Sección are required")
                    continue

                course = courses_map.get(course_name)
                if course is None:
                    errors.append(f"Row {i}: course '{course_name}' not found in faculty {faculty_id}")
                    continue

                career = career_by_course_abbr.get((course.id, career_abbr))
                if career is None:
                    errors.append(
                        f"Row {i}: career with abbreviation '{career_abbr}' not found in pensum for course '{course_name}'. "
                        "Load the pensum before uploading the nomina."
                    )
                    continue

                teacher = existing_teachers.get(teacher_code)
                if teacher is None:
                    errors.append(f"Row {i}: teacher '{teacher_code}' could not be resolved")
                    continue

                section_data = {
                    "section_number": section_number,
                    "course_id": course.id,
                    "shift": shift,
                    "teacher_id": teacher.id,
                    "credits": credits,
                    "career_id": career.id,
                }

                existing = existing_sections.get(appointment_number)
                if existing:
                    existing.section_number = section_number
                    existing.course_id = course.id
                    existing.shift = shift
                    existing.teacher_id = teacher.id
                    existing.credits = credits
                    existing.career_id = career.id
                    sections_to_update.append(existing)
                    updated += 1
                else:
                    sections_to_create.append(CourseSection(
                        appointment_number=appointment_number,
                        semester_id=semester_id,
                        **section_data,
                    ))
                    created += 1

                active_teacher_codes.add(teacher_code)
                active_course_ids.add(course.id)

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        if sections_to_create:
            CourseSection.objects.bulk_create(sections_to_create, ignore_conflicts=True)

        if sections_to_update:
            CourseSection.objects.bulk_update(
                sections_to_update,
                ["section_number", "course_id", "shift", "teacher_id", "credits", "career_id"],
            )

        if active_teacher_codes:
            Contract.objects.filter(
                faculty_id=faculty_id,
                teacher__identity_code__in=active_teacher_codes,
            ).update(is_active=True)

        if active_course_ids:
            Course.objects.filter(id__in=active_course_ids).update(is_active=True)

        Semester.objects.filter(id=semester_id).update(roster_loaded=True)

        return {"created": created, "updated": updated, "errors": errors}
