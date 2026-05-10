import re

from apps.academics.models import Career, Course


def _normalize_name(name: str) -> str:
    return re.sub(r'\s+', ' ', name.strip())


class InsertPensumService:
    @staticmethod
    def execute(rows: list[dict], faculty_id: int) -> dict:
        created = 0
        updated = 0
        errors = []
        processed_career_codes: set[str] = set()

        for i, row in enumerate(rows):
            try:
                career_name = str(row.get("Nombre_Carrera", "")).strip()
                career_code = str(row.get("No_Carrera", "")).strip()
                course_code = str(row.get("No_Curso", "")).strip()
                course_name = str(row.get("Nombre_Curso", "")).strip()
                cred_teo = int(row.get("Cred_Teo") or 0)
                cred_pra = int(row.get("Cred_Pra") or 0)
                credits = cred_teo + cred_pra

                if not career_code or not course_code:
                    errors.append(f"Row {i}: No_Carrera and No_Curso are required")
                    continue

                career, _ = Career.objects.get_or_create(
                    code=career_code,
                    faculty_id=faculty_id,
                    defaults={"name": career_name},
                )
                if career.name != career_name and career_name:
                    career.name = career_name
                    career.save(update_fields=["name"])

                processed_career_codes.add(career_code)

                _, c_created = Course.objects.update_or_create(
                    code=course_code,
                    faculty_id=faculty_id,
                    defaults={
                        "name": course_name,
                        "credits": credits,
                        "cost_center": career,
                    },
                )

                if c_created:
                    created += 1
                else:
                    updated += 1

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        if processed_career_codes:
            Career.objects.filter(
                code__in=processed_career_codes,
                faculty_id=faculty_id,
            ).update(pensum_loaded=True)

        return {"created": created, "updated": updated, "errors": errors}
