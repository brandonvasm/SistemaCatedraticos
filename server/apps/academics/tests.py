from datetime import date

from django.test import TestCase

from apps.academics.models import (
    Career, Contract, Course, CourseSection, Faculty, Semester, Teacher,
)
from apps.academics.application.insert_pensum_service import InsertPensumService
from apps.academics.application.insert_nomina_service import InsertNominaService


def make_faculty(name="Ingeniería") -> Faculty:
    return Faculty.objects.create(name=name)


def make_career(faculty, name="Informática y Sistemas", code="0001", abbreviation="IIS") -> Career:
    return Career.objects.create(
        name=name, code=code, abbreviation=abbreviation, faculty=faculty
    )


def make_course(career, faculty, name="Álgebra Lineal", code="000001", credits=5) -> Course:
    course = Course.objects.create(code=code, name=name, credits=credits, faculty=faculty)
    course.careers.add(career)
    return course


def make_semester(faculty, year=2026, number=1) -> Semester:
    return Semester.objects.create(year=year, number=number, faculty=faculty)


def make_teacher(identity_code="27128", name="González, Freddy") -> Teacher:
    return Teacher.objects.create(
        identity_code=identity_code, name=name, created_at=date.today()
    )


def make_section(course, semester, teacher=None, section_number="01", shift="matutina") -> CourseSection:
    return CourseSection.objects.create(
        course=course,
        section_number=section_number,
        shift=shift,
        semester=semester,
        teacher=teacher,
        appointment_number="999925",
        credits=5,
    )


# ---------------------------------------------------------------------------
# InsertPensumService
# ---------------------------------------------------------------------------

class InsertPensumServiceTest(TestCase):
    def setUp(self):
        self.faculty = make_faculty()

    def _row(self, **kwargs):
        base = {
            "Nombre_Carrera": "Informática y Sistemas",
            "No_Carrera": "0001",
            "No_Curso": "000393",
            "Nombre_Curso": "Bases de Investigación I",
            "Cred_Teo": "4",
            "Cred_Pra": "0",
        }
        base.update(kwargs)
        return base

    def test_creates_career_and_course(self):
        result = InsertPensumService.execute([self._row()], self.faculty.id)

        self.assertEqual(result["created"], 1)
        self.assertEqual(result["updated"], 0)
        self.assertEqual(result["errors"], [])
        self.assertTrue(Career.objects.filter(code="0001", faculty=self.faculty).exists())
        self.assertTrue(Course.objects.filter(code="000393").exists())

    def test_course_credits_summed(self):
        InsertPensumService.execute([self._row(Cred_Teo="3", Cred_Pra="2")], self.faculty.id)
        course = Course.objects.get(code="000393")
        self.assertEqual(course.credits, 5)

    def test_updates_existing_course(self):
        InsertPensumService.execute([self._row()], self.faculty.id)
        result = InsertPensumService.execute(
            [self._row(Nombre_Curso="Bases de Investigación I (rev)")], self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(result["updated"], 1)
        self.assertEqual(Course.objects.get(code="000393").name, "Bases de Investigación I (rev)")

    def test_marks_career_pensum_loaded(self):
        InsertPensumService.execute([self._row()], self.faculty.id)
        career = Career.objects.get(code="0001", faculty=self.faculty)
        self.assertTrue(career.pensum_loaded)

    def test_updates_career_name_if_changed(self):
        Career.objects.create(
            code="0001", name="Nombre Viejo", faculty=self.faculty
        )
        InsertPensumService.execute([self._row(Nombre_Carrera="Nombre Nuevo")], self.faculty.id)
        self.assertEqual(Career.objects.get(code="0001").name, "Nombre Nuevo")

    def test_skips_row_missing_no_carrera(self):
        result = InsertPensumService.execute([self._row(No_Carrera="")], self.faculty.id)
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_skips_row_missing_no_curso(self):
        result = InsertPensumService.execute([self._row(No_Curso="")], self.faculty.id)
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_multiple_rows_single_career(self):
        rows = [
            self._row(No_Curso="000001", Nombre_Curso="Curso A"),
            self._row(No_Curso="000002", Nombre_Curso="Curso B"),
        ]
        result = InsertPensumService.execute(rows, self.faculty.id)
        self.assertEqual(result["created"], 2)
        self.assertEqual(Career.objects.filter(faculty=self.faculty).count(), 1)


# ---------------------------------------------------------------------------
# InsertNominaService
# ---------------------------------------------------------------------------

class InsertNominaServiceTest(TestCase):
    def setUp(self):
        self.faculty = make_faculty()
        self.career = make_career(self.faculty)
        self.course = make_course(self.career, self.faculty)
        self.semester = make_semester(self.faculty)

    def _row(self, **kwargs):
        base = {
            "Docente": "González, Freddy",
            "Código  docente": "27128",
            "Nombramiento": "999925",
            "Carrera": "IIS",
            "Curso": "Álgebra Lineal",
            "Jornada": "Matutina",
            "Sección": "01",
            "Total de Creditos": "5",
        }
        base.update(kwargs)
        return base

    def test_creates_section_teacher_and_contract(self):
        result = InsertNominaService.execute([self._row()], self.semester.id, self.faculty.id)

        self.assertEqual(result["created"], 1)
        self.assertEqual(result["errors"], [])
        self.assertTrue(Teacher.objects.filter(identity_code="27128").exists())
        self.assertTrue(
            Contract.objects.filter(teacher__identity_code="27128", faculty=self.faculty).exists()
        )
        self.assertTrue(
            CourseSection.objects.filter(
                course=self.course, section_number="01", shift="matutina"
            ).exists()
        )

    def test_updates_existing_section(self):
        teacher = make_teacher()
        make_section(self.course, self.semester, teacher=teacher)
        new_teacher_row = self._row(**{"Código  docente": "99999", "Docente": "Nuevo Docente"})
        result = InsertNominaService.execute([new_teacher_row], self.semester.id, self.faculty.id)

        self.assertEqual(result["updated"], 1)
        section = CourseSection.objects.get(course=self.course, section_number="01", shift="matutina")
        self.assertEqual(section.teacher.identity_code, "99999")

    def test_section_stores_appointment_number_and_credits(self):
        InsertNominaService.execute([self._row()], self.semester.id, self.faculty.id)
        section = CourseSection.objects.get(course=self.course, section_number="01", shift="matutina")
        self.assertEqual(section.appointment_number, "999925")
        self.assertEqual(section.credits, 5)

    def test_section_stores_career_from_m2m(self):
        InsertNominaService.execute([self._row()], self.semester.id, self.faculty.id)
        section = CourseSection.objects.get(course=self.course, section_number="01", shift="matutina")
        self.assertEqual(section.career, self.career)

    def test_marks_semester_roster_loaded(self):
        InsertNominaService.execute([self._row()], self.semester.id, self.faculty.id)
        self.semester.refresh_from_db()
        self.assertTrue(self.semester.roster_loaded)

    def test_error_career_abbreviation_not_found(self):
        result = InsertNominaService.execute(
            [self._row(Carrera="XXX")], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)
        self.assertIn("XXX", result["errors"][0])

    def test_error_course_name_not_found(self):
        result = InsertNominaService.execute(
            [self._row(Curso="Curso Inexistente")], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_error_missing_required_fields(self):
        result = InsertNominaService.execute(
            [self._row(**{"Código  docente": ""})], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_shift_normalization(self):
        InsertNominaService.execute([self._row(Jornada="VESPERTINA")], self.semester.id, self.faculty.id)
        self.assertTrue(
            CourseSection.objects.filter(course=self.course, shift="vespertina").exists()
        )

    def test_reuses_existing_teacher(self):
        existing = make_teacher(identity_code="27128")
        InsertNominaService.execute([self._row()], self.semester.id, self.faculty.id)
        self.assertEqual(Teacher.objects.filter(identity_code="27128").count(), 1)
        self.assertEqual(Teacher.objects.get(identity_code="27128").id, existing.id)

    def test_activates_contract_for_teachers_in_nomina(self):
        teacher = make_teacher(identity_code="27128")
        Contract.objects.create(teacher=teacher, faculty=self.faculty, is_active=False)
        InsertNominaService.execute([self._row()], self.semester.id, self.faculty.id)
        contract = Contract.objects.get(teacher=teacher, faculty=self.faculty)
        self.assertTrue(contract.is_active)

    def test_deactivates_contracts_for_absent_teachers(self):
        absent = make_teacher(identity_code="99999", name="Docente Ausente")
        Contract.objects.create(teacher=absent, faculty=self.faculty, is_active=True)
        InsertNominaService.execute([self._row()], self.semester.id, self.faculty.id)
        absent_contract = Contract.objects.get(teacher=absent, faculty=self.faculty)
        self.assertFalse(absent_contract.is_active)

    def test_deactivation_only_affects_same_faculty(self):
        other_faculty = make_faculty(name="Otra Facultad")
        other_career = make_career(other_faculty, abbreviation="OTR")
        absent = make_teacher(identity_code="99999", name="Docente Otra Facultad")
        Contract.objects.create(teacher=absent, faculty=other_faculty, is_active=True)
        InsertNominaService.execute([self._row()], self.semester.id, self.faculty.id)
        # Contract in a different faculty must remain untouched
        cross_contract = Contract.objects.get(teacher=absent, faculty=other_faculty)
        self.assertTrue(cross_contract.is_active)
