from apps.academics.models import Contract, Teacher


class TeacherUpsertService:
    @staticmethod
    def execute(
        identity_code: str,
        name: str,
        faculty_id: int,
        created_at=None,
        is_active: bool = True,
    ) -> tuple[Teacher, bool]:

        # 🔥 Buscar por identity_code (CLAVE ÚNICA)
        teacher = Teacher.objects.filter(identity_code=identity_code).first()

        if teacher:
            # ✅ UPDATE
            teacher.name = name
            teacher.is_active = is_active

            if created_at:
                teacher.created_at = created_at

            teacher.save()

            # actualizar contrato
            Contract.objects.update_or_create(
                teacher=teacher,
                defaults={
                    "faculty_id": faculty_id,
                    "is_active": is_active,
                },
            )

            return teacher, False

        else:
            # ✅ CREATE
            if not created_at:
                from datetime import date

                created_at = date.today()

            teacher = Teacher.objects.create(
                identity_code=identity_code,
                name=name,
                created_at=created_at,
                is_active=is_active,
            )

            Contract.objects.create(
                teacher=teacher,
                faculty_id=faculty_id,
                is_active=is_active,
            )

            return teacher, True
