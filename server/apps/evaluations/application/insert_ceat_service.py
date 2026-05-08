from datetime import date

from django.db.models import Sum

from apps.academics.models import Contract, CourseSection, Semester, Teacher
from apps.evaluations.models import TrainingHours
from apps.historical.models import TeacherLoadHistory

# CeatValidator builds headers by joining top and bottom rows with " - "
_LEVEL1 = "Horas de Formación CEAT - Nivel 1 (iniciación)"
_LEVEL2 = "Horas de Formación CEAT - Nivel 2 (transición)"
_LEVEL3 = "Horas de Formación CEAT - Nivel 3 (autonomía)"
_COMPLEMENTARY = "Horas de Formación CEAT - Complementarias"


class InsertCeatService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        errors = []

        for i, row in enumerate(rows):
            try:
                teacher_code = str(row.get("Código Docente", "")).strip()
                teacher_name = str(row.get("Nombre(s) y Apellidos", "")).strip()
                level1 = int(row.get(_LEVEL1) or 0)
                level2 = int(row.get(_LEVEL2) or 0)
                level3 = int(row.get(_LEVEL3) or 0)
                complementary = int(row.get(_COMPLEMENTARY) or 0)

                if not teacher_code:
                    errors.append(f"Row {i}: Código Docente is required")
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

                TrainingHours.objects.create(
                    teacher=teacher,
                    faculty_id=faculty_id,
                    initiation_count=level1,
                    transition_count=level2,
                    autonomy_count=level3,
                    complementary_count=complementary,
                    semester_id=semester_id,
                )
                created += 1

                managed_credits = (
                    CourseSection.objects.filter(
                        teacher=teacher,
                        semester_id=semester_id,
                        credits__isnull=False,
                    ).aggregate(total=Sum("credits"))["total"] or 0
                )

                total_hours = level1 + level2 + level3 + complementary

                TeacherLoadHistory.objects.update_or_create(
                    teacher=teacher,
                    semester_id=semester_id,
                    defaults={
                        "total_training_hours": total_hours,
                        "managed_credits": managed_credits,
                    },
                )

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        Semester.objects.filter(id=semester_id).update(ceat_loaded=True)

        return {"created": created, "errors": errors}
