from datetime import date
import re
import unicodedata

from apps.academics.models import Career, Contract, Course, CourseSection, Semester, Teacher

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


def _career_key(value: str) -> str:
    text = unicodedata.normalize("NFKD", value or "")
    text = "".join(character for character in text if not unicodedata.combining(character))
    text = re.sub(r"\s+", " ", text).strip()

    if not text:
        return ""

    if " " not in text and len(text) <= 8:
        return re.sub(r"\s+", "", text).upper()

    ignored_words = {
        "A",
        "DE",
        "DEL",
        "E",
        "EL",
        "EN",
        "LA",
        "LAS",
        "LOS",
        "PARA",
        "Y",
    }
    words = [word.upper() for word in re.findall(r"[A-Za-z0-9]+", text)]
    return "".join(word[0] for word in words if word not in ignored_words)


def _get_career(career_key: str, faculty_id: int) -> Career:
    try:
        return Career.objects.get(abbreviation=career_key, faculty_id=faculty_id)
    except Career.DoesNotExist:
        pass

    try:
        return Career.objects.get(code=career_key, faculty_id=faculty_id)
    except Career.DoesNotExist:
        pass

    matching_careers = [
        career
        for career in Career.objects.filter(faculty_id=faculty_id)
        if _career_key(career.name) == career_key
    ]

    if len(matching_careers) == 1:
        career = matching_careers[0]
        if not career.abbreviation:
            career.abbreviation = career_key
            career.save(update_fields=["abbreviation"])
        return career

    raise Career.DoesNotExist


class InsertNominaService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        updated = 0
        errors = []
        active_teacher_codes: set[str] = set()

        for i, row in enumerate(rows):
            try:
                teacher_name = str(row.get("Docente", "")).strip()
                teacher_code = str(
                    _first_value(row, "Código docente", "Código  docente") or ""
                ).strip()
                appointment_number = str(row.get("Nombramiento", "")).strip()
                career_key = str(
                    _first_value(row, "Clave Carrera", "Carrera") or ""
                ).strip()
                course_name = str(row.get("Curso", "")).strip()
                section_number = str(row.get("Sección", "")).strip()
                shift = _normalize_shift(str(row.get("Jornada", "")))
                credits_raw = _first_value(
                    row,
                    "Total de créditos",
                    "Total de Creditos",
                )
                credits = int(credits_raw) if credits_raw is not None else None

                if not teacher_code or not course_name or not section_number:
                    errors.append(f"Row {i}: Docente, Curso and Sección are required")
                    continue

                try:
                    career = _get_career(career_key, faculty_id)
                except Career.DoesNotExist:
                    errors.append(
                        f"Row {i}: career with key '{career_key}' not found in faculty {faculty_id}. "
                        "Set the abbreviation, code, or matching name on the career before uploading the nomina."
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

                active_teacher_codes.add(teacher_code)

                if s_created:
                    created += 1
                else:
                    updated += 1

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        if active_teacher_codes:
            Contract.objects.filter(
                faculty_id=faculty_id,
                teacher__identity_code__in=active_teacher_codes,
            ).update(is_active=True)

        Contract.objects.filter(
            faculty_id=faculty_id,
        ).exclude(
            teacher__identity_code__in=active_teacher_codes,
        ).update(is_active=False)

        Semester.objects.filter(id=semester_id).update(roster_loaded=True)

        return {"created": created, "updated": updated, "errors": errors}
