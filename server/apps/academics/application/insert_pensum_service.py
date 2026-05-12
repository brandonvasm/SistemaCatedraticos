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

        for i, row in enumerate(rows, start=1):
            row_number = row.get("__excel_row__", i)
            try:
                career_name = str(row.get("Nombre_Carrera", "")).strip()
                career_code = str(row.get("No_Carrera", "")).strip()
                course_code = str(row.get("No_Curso", "")).strip()
                course_name = str(row.get("Nombre_Curso", "")).strip()
                cred_teo = _int_or_zero(row.get("Cred_Teo"), "Cred_Teo")
                cred_pra = _int_or_zero(row.get("Cred_Pra"), "Cred_Pra")
                credits = cred_teo + cred_pra

                if not career_code or not course_code:
                    errors.append(f"Fila {row_number}: No_Carrera y No_Curso son obligatorios.")
                    continue

                career, _ = Career.objects.get_or_create(
                    code=career_code,
                    faculty_id=faculty_id,
                    defaults={"name": career_name, "abbreviation": _career_key(career_name)},
                )
                if career.name != career_name and career_name:
                    career.name = career_name
                    career.save(update_fields=["name"])

                processed_career_codes.add(career_code)

                course, c_created = Course.objects.update_or_create(
                    code=course_code,
                    faculty_id=faculty_id,
                    defaults={
                        "name": course_name,
                        "credits": credits,
                    },
                )
                course.careers.add(career)

                if c_created:
                    created += 1
                else:
                    updated += 1

            except Exception as e:
                errors.append(f"Fila {row_number}: {e}")

        if processed_career_codes:
            Career.objects.filter(
                code__in=processed_career_codes,
                faculty_id=faculty_id,
            ).update(pensum_loaded=True)

        return {"created": created, "updated": updated, "errors": errors}
