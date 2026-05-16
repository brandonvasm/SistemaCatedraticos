import datetime

from apps.academics.models import (
    CostCenter,
    Course,
    CourseSection,
    Faculty,
    Semester,
    Teacher,
)
from apps.evaluations.models import StudentEvaluation
from apps.historical.models import TeacherCourseHistory
from django.utils import timezone


def run_seed():
    print("Iniciando carga de datos de prueba...")

    # 1. Crear Facultad y Centro de Costo
    fac, _ = Faculty.objects.get_or_create(name="Ingeniería en Sistemas")
    cc, _ = CostCenter.objects.get_or_create(name="CC-Sistemas-01", faculty=fac)

    # 2. Crear Curso
    curso, _ = Course.objects.get_or_create(
        code="SIS-101", name="Programación I", credits=5, cost_center=cc
    )

    # 3. Crear Semestres (Necesitamos 2 para calcular tendencia)
    s1, _ = Semester.objects.get_or_create(year=2025, number=1, faculty=fac)
    s2, _ = Semester.objects.get_or_create(year=2025, number=2, faculty=fac)

    # 4. Crear Docente
    docente, _ = Teacher.objects.get_or_create(
        identity_code="ID-999",
        defaults={
            "name": "Guillermo Sistemas",
            "created_at": datetime.date(2025, 1, 1),
            "is_active": True,
        },
    )

    # 5. Crear Secciones de Curso
    sec1, _ = CourseSection.objects.get_or_create(
        course=curso, section_number="A", semester=s1, teacher=docente, shift="matutina"
    )
    sec2, _ = CourseSection.objects.get_or_create(
        course=curso, section_number="B", semester=s2, teacher=docente, shift="matutina"
    )

    # 6. Crear Evaluaciones (Para el promedio general)
    # Semestre 1: Notas bajas (80)
    StudentEvaluation.objects.get_or_create(
        course_section=sec1, score=80.0, submitted_count=20, assigned_students=25
    )
    # Semestre 2: Notas altas (95) - Esto genera tendencia positiva
    StudentEvaluation.objects.get_or_create(
        course_section=sec2, score=95.0, submitted_count=20, assigned_students=25
    )

    # 7. Crear Historial (Para el cálculo de tendencia en views.py)
    # Historial Semestre 1
    TeacherCourseHistory.objects.get_or_create(
        teacher=docente,
        semester=s1,
        course=curso,
        ai_score=85.0,
        student_score=80.0,
        control_avg_score=10.0,
    )
    # Historial Semestre 2
    TeacherCourseHistory.objects.get_or_create(
        teacher=docente,
        semester=s2,
        course=curso,
        ai_score=90.0,
        student_score=95.0,
        control_avg_score=10.5,
    )

    print(f"Éxito. Docente creado con ID: {docente.id}")


if __name__ == "__main__":
    run_seed()
