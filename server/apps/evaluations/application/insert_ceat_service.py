from datetime import date
import math

from django.db.models import Sum

from apps.academics.models import Contract, CourseSection, Semester, Teacher
from apps.evaluations.models import TrainingHours
from apps.historical.models import TeacherLoadHistory

_LEVEL1 = "Horas de Formación CEAT - Nivel 1 (iniciación)"
_LEVEL2 = "Horas de Formación CEAT - Nivel 2 (transición)"
_LEVEL3 = "Horas de Formación CEAT - Nivel 3 (autonomía)"
_COMPLEMENTARY = "Horas de Formación CEAT - Complementarias"


def _int_or_zero(value, field_name: str) -> int:
    if value in (None, "") or (isinstance(value, float) and math.isnan(value)):
        return 0

    try:
        return int(float(value))
    except (TypeError, ValueError):
        raise ValueError(f"{field_name} debe ser numérico.")


class InsertCeatService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        errors = []

        all_codes = {str(row.get("Código Docente", "")).strip() for row in rows if row.get("Código Docente")}

        existing_teachers = {
            t.identity_code: t
            for t in Teacher.objects.filter(identity_code__in=all_codes)
        }
        new_teacher_codes = all_codes - existing_teachers.keys()
        if new_teacher_codes:
            names_by_code = {
                str(row.get("Código Docente", "")).strip(): str(row.get("Nombre(s) y Apellidos", "")).strip()
                for row in rows
                if str(row.get("Código Docente", "")).strip() in new_teacher_codes
            }
            Teacher.objects.bulk_create(
                [
                    Teacher(identity_code=code, name=names_by_code.get(code, ""), created_at=date.today())
                    for code in new_teacher_codes
                ],
                ignore_conflicts=True,
            )
            existing_teachers = {
                t.identity_code: t
                for t in Teacher.objects.filter(identity_code__in=all_codes)
            }

        all_teacher_ids = {t.id for t in existing_teachers.values()}

        existing_contracts = set(
            Contract.objects.filter(
                teacher_id__in=all_teacher_ids, faculty_id=faculty_id
            ).values_list("teacher_id", flat=True)
        )
        new_contracts = [
            Contract(teacher=t, faculty_id=faculty_id, is_active=True)
            for t in existing_teachers.values()
            if t.id not in existing_contracts
        ]
        if new_contracts:
            Contract.objects.bulk_create(new_contracts, ignore_conflicts=True)

        credits_by_teacher = {
            d["teacher_id"]: d["total"] or 0
            for d in CourseSection.objects.filter(
                teacher_id__in=all_teacher_ids,
                semester_id=semester_id,
                credits__isnull=False,
            )
            .values("teacher_id")
            .annotate(total=Sum("credits"))
        }

        training_to_create = []
        load_data: dict[int, dict] = {}

        for i, row in enumerate(rows, start=1):
            row_number = row.get("__excel_row__", i)
            try:
                teacher_code = str(row.get("Código Docente", "")).strip()
                teacher_name = str(row.get("Nombre(s) y Apellidos", "")).strip()
                level1 = _int_or_zero(row.get(_LEVEL1), _LEVEL1)
                level2 = _int_or_zero(row.get(_LEVEL2), _LEVEL2)
                level3 = _int_or_zero(row.get(_LEVEL3), _LEVEL3)
                complementary = _int_or_zero(row.get(_COMPLEMENTARY), _COMPLEMENTARY)

                if not teacher_code:
                    errors.append(f"Fila {row_number}: Código Docente es obligatorio.")
                    continue

                teacher = existing_teachers.get(teacher_code)
                if teacher is None:
                    errors.append(f"Row {i}: teacher '{teacher_code}' could not be resolved")
                    continue

                training_to_create.append(TrainingHours(
                    teacher=teacher,
                    faculty_id=faculty_id,
                    initiation_count=level1,
                    transition_count=level2,
                    autonomy_count=level3,
                    complementary_count=complementary,
                    semester_id=semester_id,
                ))
                created += 1

                total_hours = level1 + level2 + level3 + complementary
                managed_credits = credits_by_teacher.get(teacher.id, 0)
                load_data[teacher.id] = {
                    "total_training_hours": total_hours,
                    "managed_credits": managed_credits,
                }

            except Exception as e:
                errors.append(f"Fila {row_number}: {e}")

        if training_to_create:
            TrainingHours.objects.bulk_create(training_to_create)

        if load_data:
            teacher_ids = set(load_data.keys())
            existing_loads = {
                r.teacher_id: r
                for r in TeacherLoadHistory.objects.filter(
                    semester_id=semester_id, teacher_id__in=teacher_ids
                )
            }
            to_create = []
            to_update = []
            for teacher_id, defaults in load_data.items():
                record = existing_loads.get(teacher_id)
                if record:
                    record.total_training_hours = defaults["total_training_hours"]
                    record.managed_credits = defaults["managed_credits"]
                    to_update.append(record)
                else:
                    to_create.append(TeacherLoadHistory(
                        teacher_id=teacher_id,
                        semester_id=semester_id,
                        **defaults,
                    ))
            if to_update:
                TeacherLoadHistory.objects.bulk_update(to_update, ["total_training_hours", "managed_credits"])
            if to_create:
                TeacherLoadHistory.objects.bulk_create(to_create)

        Semester.objects.filter(id=semester_id).update(ceat_loaded=True)

        return {"created": created, "errors": errors}
