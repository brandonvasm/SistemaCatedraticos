import re
import unicodedata
import math

from apps.academics.models import Career, Course


def _normalize_name(name: str) -> str:
    return re.sub(r'\s+', ' ', name.strip())

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


def _int_or_zero(value, field_name: str) -> int:
    if value in (None, "") or (isinstance(value, float) and math.isnan(value)):
        return 0

    try:
        return int(float(value))
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} debe ser numérico.")


class InsertPensumService:
    @staticmethod
    def execute(rows: list[dict], faculty_id: int) -> dict:
        created = 0
        updated = 0
        errors = []
        processed_career_codes: set[str] = set()

        career_codes = {str(row.get("No_Carrera", "")).strip() for row in rows if row.get("No_Carrera")}
        course_names = {str(row.get("Nombre_Curso", "")).strip() for row in rows if row.get("Nombre_Curso")}

        existing_careers: dict[tuple[str, int], Career] = {
            (c.code, c.faculty_id): c
            for c in Career.objects.filter(code__in=career_codes, faculty_id=faculty_id)
        }

        desired_careers: dict[str, str] = {}
        for row in rows:
            row_number = row.get("__excel_row__", i)
            code = str(row.get("No_Carrera", "")).strip()
            name = str(row.get("Nombre_Carrera", "")).strip()
            if code and name:
                desired_careers[code] = name
            else:
                errors.append(f"Fila {row_number}: No_Carrera y No_Carrera son obligatorios.")
                continue

        new_career_codes = set(desired_careers) - {k[0] for k in existing_careers}
        if new_career_codes:
            Career.objects.bulk_create(
                [
                    Career(
                        code=code,
                        faculty_id=faculty_id,
                        name=desired_careers[code],
                        abbreviation=_career_key(desired_careers[code]),
                    )
                    for code in new_career_codes
                ],
                ignore_conflicts=True,
            )
            existing_careers = {
                (c.code, c.faculty_id): c
                for c in Career.objects.filter(code__in=career_codes, faculty_id=faculty_id)
            }

        careers_name_update = []
        for code, name in desired_careers.items():
            career = existing_careers.get((code, faculty_id))
            if career and name and career.name != name:
                career.name = name
                careers_name_update.append(career)
        if careers_name_update:
            Career.objects.bulk_update(careers_name_update, ["name"])

        careers_map = existing_careers  

        existing_courses: dict[tuple[str, int], Course] = {
            (c.name, c.faculty_id): c
            for c in Course.objects.filter(name__in=course_names, faculty_id=faculty_id)
        }

        desired_courses: dict[str, dict] = {}
        for i, row in enumerate(rows):
            name = str(row.get("Nombre_Curso", "")).strip()
            code = str(row.get("No_Curso", "")).strip()
            cred_teo = _int_or_zero(row.get("Cred_Teo"), "Cred_Teo")
            cred_pra = _int_or_zero(row.get("Cred_Pra"), "Cred_Pra")
            if name and code:
                desired_courses[name] = {"code": code, "credits": cred_teo + cred_pra}
            else:
                errors.append(f"Fila {i}: Nombre_Curso y No_Curso son obligatorios.")
                continue

        new_course_names = set(desired_courses) - {k[0] for k in existing_courses}
        if new_course_names:
            Course.objects.bulk_create(
                [
                    Course(
                        name=name,
                        faculty_id=faculty_id,
                        code=desired_courses[name]["code"],
                        credits=desired_courses[name]["credits"],
                    )
                    for name in new_course_names
                ],
                ignore_conflicts=True,
            )
            created = len(new_course_names)
            existing_courses = {
                (c.name, c.faculty_id): c
                for c in Course.objects.filter(name__in=course_names, faculty_id=faculty_id)
            }

        courses_to_update = []
        for name, data in desired_courses.items():
            course = existing_courses.get((name, faculty_id))
            if course and (course.code != data["code"] or course.credits != data["credits"]):
                course.code = data["code"]
                course.credits = data["credits"]
                courses_to_update.append(course)
                updated += 1
        if courses_to_update:
            Course.objects.bulk_update(courses_to_update, ["code", "credits"])

        m2m_pairs: set[tuple[int, int]] = set()
        for i, row in enumerate(rows):
            career_code = str(row.get("No_Carrera", "")).strip()
            course_name = str(row.get("Nombre_Curso", "")).strip()
            if not career_code or not course_name:
                errors.append(f"Fila {i}: No_Carrera y Nombre_Curso son obligatorios.")
                continue
            career = careers_map.get((career_code, faculty_id))
            course = existing_courses.get((course_name, faculty_id))
            if career and course:
                m2m_pairs.add((course.id, career.id))
                processed_career_codes.add(career_code)
            else:
                errors.append(f"Fila {i}: La carrera o el curso no se encontró")
                continue

        if m2m_pairs:
            Through = Course.careers.through
            course_ids = {p[0] for p in m2m_pairs}
            career_ids = {p[1] for p in m2m_pairs}
            existing_m2m = set(
                Through.objects.filter(
                    course_id__in=course_ids,
                    career_id__in=career_ids,
                ).values_list("course_id", "career_id")
            )
            new_links = [
                Through(course_id=cid, career_id=carid)
                for (cid, carid) in m2m_pairs
                if (cid, carid) not in existing_m2m
            ]
            if new_links:
                Through.objects.bulk_create(new_links, ignore_conflicts=True)

        if processed_career_codes:
            Career.objects.filter(
                code__in=processed_career_codes,
                faculty_id=faculty_id,
            ).update(pensum_loaded=True)

        return {"created": created, "updated": updated, "errors": errors}
