from datetime import date
import math

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
        if value not in (None, "") and not _is_empty_number(value):
            return value
    return None


def _is_empty_number(value) -> bool:
    return isinstance(value, float) and math.isnan(value)


def _optional_int(value, field_name: str) -> int | None:
    if value in (None, "") or _is_empty_number(value):
        return None

    try:
        return int(float(value))
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} debe ser numérico.")


class InsertNominaService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        updated = 0
        errors = []
        active_teacher_codes: set[str] = set()
        active_course_ids: set[int] = set()

        for i, row in enumerate(rows, start=1):
            row_number = row.get("__excel_row__", i)
            try:
                teacher_name = str(row.get("Docente", "")).strip()
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
                credits_raw = _first_value(
                    row,
                    "Total de créditos",
                    "Total de Creditos",
                )
                credits = _optional_int(credits_raw, "Total de créditos")

                if not teacher_code or not course_name or not section_number:
                    errors.append(f"Fila {row_number}: Docente, Curso y Sección son obligatorios.")
                    continue

                try:
                    course = Course.objects.get(name=course_name, faculty_id=faculty_id)
                except Course.DoesNotExist:
                    errors.append(f"Fila {row_number}: no se encontró el curso '{course_name}' en la facultad {faculty_id}.")
                    continue
                except Course.MultipleObjectsReturned:
                    errors.append(f"Fila {row_number}: hay varios cursos llamados '{course_name}' en la facultad {faculty_id}.")
                    continue

                career = course.careers.filter(abbreviation=career_abbr).first()
                if career is None:
                    errors.append(
                        f"Fila {row_number}: la carrera con abreviatura '{career_abbr}' no existe en el pensum para el curso '{course_name}'. "
                        "Cargue el pensum antes de subir la nómina."
                    )
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
                        "career": career,
                    },
                )

                active_teacher_codes.add(teacher_code)
                active_course_ids.add(course.id)

                if s_created:
                    created += 1
                else:
                    updated += 1

            except Exception as e:
                errors.append(f"Fila {row_number}: {e}")

        if active_teacher_codes:
            Contract.objects.filter(
                faculty_id=faculty_id,
                teacher__identity_code__in=active_teacher_codes,
            ).update(is_active=True)

        if active_course_ids:
            Course.objects.filter(id__in=active_course_ids).update(is_active=True)

        Semester.objects.filter(id=semester_id).update(roster_loaded=True)

        return {"created": created, "updated": updated, "errors": errors}
