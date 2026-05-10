from datetime import date

from django.test import TestCase

from apps.academics.models import (
    Career, Contract, Course, CourseSection, Faculty, Semester, Teacher,
)
from apps.evaluations.models import Comment, SectionControl, StudentEvaluation, TrainingHours
from apps.evaluations.application.insert_evaluation_service import InsertEvaluationService
from apps.evaluations.application.insert_comments_service import InsertCommentsService
from apps.evaluations.application.insert_control_service import InsertControlService
from apps.evaluations.application.insert_ceat_service import InsertCeatService
from apps.historical.models import (
    CourseHistory, SemesterHistory, TeacherCourseHistory, TeacherLoadHistory,
)


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

def make_faculty(name="Ingeniería") -> Faculty:
    return Faculty.objects.create(name=name)


def make_career(faculty, name="Informática", code="0001", abbreviation="IIS") -> Career:
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
# InsertEvaluationService
# ---------------------------------------------------------------------------

class InsertEvaluationServiceTest(TestCase):
    def setUp(self):
        self.faculty = make_faculty()
        self.career = make_career(self.faculty)
        self.course = make_course(self.career, self.faculty)
        self.semester = make_semester(self.faculty)
        self.teacher = make_teacher()
        Contract.objects.create(teacher=self.teacher, faculty=self.faculty)
        self.section = make_section(self.course, self.semester, teacher=self.teacher)

    def _row(self, **kwargs):
        base = {
            "Código": "27128",
            "Catedrático": "González, Freddy",
            "Resultado": "90",
            "No. Nombramiento": "999925",
            "Jornada": "Matutina",
            "Sección": "01",
            "Curso": "Álgebra Lineal",
            "Estudiantes que realizaron la evaluación": "40",
            "Estudiantes Asignados": "45",
        }
        base.update(kwargs)
        return base

    def test_creates_student_evaluation(self):
        result = InsertEvaluationService.execute([self._row()], self.semester.id, self.faculty.id)
        self.assertEqual(result["created"], 1)
        self.assertEqual(result["errors"], [])
        self.assertEqual(StudentEvaluation.objects.count(), 1)

    def test_performance_level_high(self):
        InsertEvaluationService.execute([self._row(Resultado="90")], self.semester.id, self.faculty.id)
        self.assertEqual(StudentEvaluation.objects.first().performance_level, "high")

    def test_performance_level_medium(self):
        InsertEvaluationService.execute([self._row(Resultado="70")], self.semester.id, self.faculty.id)
        self.assertEqual(StudentEvaluation.objects.first().performance_level, "medium")

    def test_performance_level_low(self):
        InsertEvaluationService.execute([self._row(Resultado="50")], self.semester.id, self.faculty.id)
        self.assertEqual(StudentEvaluation.objects.first().performance_level, "low")

    def test_creates_teacher_course_history(self):
        InsertEvaluationService.execute([self._row(Resultado="85")], self.semester.id, self.faculty.id)
        history = TeacherCourseHistory.objects.get(
            teacher=self.teacher, semester=self.semester, course=self.course
        )
        self.assertEqual(history.student_score, 85.0)

    def test_marks_semester_evaluation_loaded(self):
        InsertEvaluationService.execute([self._row()], self.semester.id, self.faculty.id)
        self.semester.refresh_from_db()
        self.assertTrue(self.semester.evaluation_loaded)

    def test_error_teacher_not_found(self):
        result = InsertEvaluationService.execute(
            [self._row(Código="99999")], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertIn("99999", result["errors"][0])

    def test_error_appointment_not_found(self):
        result = InsertEvaluationService.execute(
            [self._row(**{"No. Nombramiento": "000000"})], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertIn("000000", result["errors"][0])

    def test_error_missing_appointment_number(self):
        result = InsertEvaluationService.execute(
            [self._row(**{"No. Nombramiento": ""})], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_error_missing_required_fields(self):
        result = InsertEvaluationService.execute(
            [self._row(Código="")], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_continues_after_row_error(self):
        rows = [self._row(Código=""), self._row()]
        result = InsertEvaluationService.execute(rows, self.semester.id, self.faculty.id)
        self.assertEqual(result["created"], 1)
        self.assertEqual(len(result["errors"]), 1)


# ---------------------------------------------------------------------------
# InsertCommentsService
# ---------------------------------------------------------------------------

class InsertCommentsServiceTest(TestCase):
    def setUp(self):
        self.faculty = make_faculty()
        self.career = make_career(self.faculty)
        self.course = make_course(self.career, self.faculty)
        self.semester = make_semester(self.faculty)
        self.teacher = make_teacher()
        self.section = make_section(self.course, self.semester, teacher=self.teacher)

    def _row(self, **kwargs):
        base = {
            "Curso": "Álgebra Lineal",
            "Sección": "01",
            "Jornada": "Matutina",
            "Catedrático": "González, Freddy",
            "Comentario": "Excelente docente.",
        }
        base.update(kwargs)
        return base

    def test_creates_comment(self):
        result = InsertCommentsService.execute([self._row()], self.semester.id, self.faculty.id)
        self.assertEqual(result["created"], 1)
        self.assertEqual(result["errors"], [])
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(Comment.objects.first().content, "Excelente docente.")

    def test_marks_semester_comments_loaded(self):
        InsertCommentsService.execute([self._row()], self.semester.id, self.faculty.id)
        self.semester.refresh_from_db()
        self.assertTrue(self.semester.comments_loaded)

    def test_error_course_not_found(self):
        result = InsertCommentsService.execute(
            [self._row(Curso="Inexistente")], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_error_section_not_found(self):
        result = InsertCommentsService.execute(
            [self._row(**{"Sección": "99", "Jornada": "vespertina"})],
            self.semester.id, self.faculty.id,
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_error_missing_comment(self):
        result = InsertCommentsService.execute(
            [self._row(Comentario="")], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_error_missing_section_number(self):
        result = InsertCommentsService.execute(
            [self._row(**{"Sección": ""})], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_multiple_comments_same_section(self):
        rows = [self._row(Comentario="Comentario 1"), self._row(Comentario="Comentario 2")]
        result = InsertCommentsService.execute(rows, self.semester.id, self.faculty.id)
        self.assertEqual(result["created"], 2)
        self.assertEqual(Comment.objects.count(), 2)


# ---------------------------------------------------------------------------
# InsertControlService
# ---------------------------------------------------------------------------

class InsertControlServiceTest(TestCase):
    def setUp(self):
        self.faculty = make_faculty()
        self.career = make_career(self.faculty)
        self.course = make_course(self.career, self.faculty)
        self.semester = make_semester(self.faculty)
        self.teacher = make_teacher()
        Contract.objects.create(teacher=self.teacher, faculty=self.faculty)
        self.section = make_section(self.course, self.semester, teacher=self.teacher)

    def _row(self, **kwargs):
        base = {
            "Docente": "González, Freddy",
            "Curso": "Álgebra Lineal",
            "Jornada": "Matutina",
            "Sección": "01",
            "cantidad_1": 8,
            "cantidad_0_5": 2,
            "cantidad_0": 0,
        }
        base.update(kwargs)
        return base

    def test_creates_section_control(self):
        result = InsertControlService.execute([self._row()], self.semester.id, self.faculty.id)
        self.assertEqual(result["created"], 1)
        self.assertEqual(result["errors"], [])
        self.assertEqual(SectionControl.objects.count(), 1)

    def test_control_score_stored_on_section(self):
        InsertControlService.execute(
            [self._row(cantidad_1=10, cantidad_0_5=0, cantidad_0=0)],
            self.semester.id, self.faculty.id,
        )
        self.section.refresh_from_db()
        self.assertEqual(self.section.control_score, 100.0)

    def test_control_score_calculation(self):
        # high=8, medium=2, low=0 → 8/10 * 100 = 80.0
        InsertControlService.execute([self._row()], self.semester.id, self.faculty.id)
        self.section.refresh_from_db()
        self.assertEqual(self.section.control_score, 80.0)

    def test_zero_total_leaves_score_null(self):
        InsertControlService.execute(
            [self._row(cantidad_1=0, cantidad_0_5=0, cantidad_0=0)],
            self.semester.id, self.faculty.id,
        )
        self.section.refresh_from_db()
        self.assertIsNone(self.section.control_score)

    def test_creates_teacher_course_history(self):
        InsertControlService.execute([self._row()], self.semester.id, self.faculty.id)
        history = TeacherCourseHistory.objects.get(
            teacher=self.teacher, semester=self.semester, course=self.course
        )
        self.assertIsNotNone(history.control_avg_score)

    def test_creates_course_history(self):
        InsertControlService.execute([self._row()], self.semester.id, self.faculty.id)
        self.assertTrue(
            CourseHistory.objects.filter(course=self.course, semester=self.semester).exists()
        )

    def test_creates_semester_history(self):
        InsertControlService.execute([self._row()], self.semester.id, self.faculty.id)
        self.assertTrue(SemesterHistory.objects.filter(semester=self.semester).exists())

    def test_semester_history_section_and_teacher_count(self):
        InsertControlService.execute([self._row()], self.semester.id, self.faculty.id)
        history = SemesterHistory.objects.get(semester=self.semester)
        self.assertEqual(history.section_count, 1)
        self.assertEqual(history.teacher_count, 1)

    def test_marks_semester_control_loaded(self):
        InsertControlService.execute([self._row()], self.semester.id, self.faculty.id)
        self.semester.refresh_from_db()
        self.assertTrue(self.semester.control_loaded)

    def test_error_course_not_found(self):
        result = InsertControlService.execute(
            [self._row(Curso="Inexistente")], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_error_section_not_found(self):
        result = InsertControlService.execute(
            [self._row(Sección="99")], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_course_history_integrates_student_scores(self):
        # Pre-insert a student evaluation so CourseHistory.avg_student_score is populated
        StudentEvaluation.objects.create(
            course_section=self.section,
            score=88.0,
            submitted_count=30,
            assigned_students=35,
            performance_level="high",
        )
        InsertControlService.execute([self._row()], self.semester.id, self.faculty.id)
        history = CourseHistory.objects.get(course=self.course, semester=self.semester)
        self.assertEqual(history.avg_student_score, 88.0)


# ---------------------------------------------------------------------------
# InsertCeatService
# ---------------------------------------------------------------------------

class InsertCeatServiceTest(TestCase):
    def setUp(self):
        self.faculty = make_faculty()
        self.career = make_career(self.faculty)
        self.course = make_course(self.career, self.faculty)
        self.semester = make_semester(self.faculty)
        self.teacher = make_teacher()
        Contract.objects.create(teacher=self.teacher, faculty=self.faculty)
        self.section = make_section(self.course, self.semester, teacher=self.teacher)

    def _row(self, **kwargs):
        base = {
            "Código Docente": "27128",
            "Nombre(s) y Apellidos": "González, Freddy",
            "Horas de Formación CEAT - Nivel 1 (iniciación)": 5,
            "Horas de Formación CEAT - Nivel 2 (transición)": 4,
            "Horas de Formación CEAT - Nivel 3 (autonomía)": 3,
            "Horas de Formación CEAT - Complementarias": 2,
        }
        base.update(kwargs)
        return base

    def test_creates_training_hours(self):
        result = InsertCeatService.execute([self._row()], self.semester.id, self.faculty.id)
        self.assertEqual(result["created"], 1)
        self.assertEqual(result["errors"], [])
        th = TrainingHours.objects.get(teacher=self.teacher)
        self.assertEqual(th.initiation_count, 5)
        self.assertEqual(th.transition_count, 4)
        self.assertEqual(th.autonomy_count, 3)
        self.assertEqual(th.complementary_count, 2)

    def test_creates_teacher_load_history(self):
        InsertCeatService.execute([self._row()], self.semester.id, self.faculty.id)
        history = TeacherLoadHistory.objects.get(teacher=self.teacher, semester=self.semester)
        self.assertEqual(history.total_training_hours, 14)  # 5+4+3+2
        self.assertEqual(history.managed_credits, 5)  # from section.credits

    def test_creates_teacher_if_not_exists(self):
        result = InsertCeatService.execute(
            [self._row(**{"Código Docente": "99999", "Nombre(s) y Apellidos": "Nuevo Docente"})],
            self.semester.id, self.faculty.id,
        )
        self.assertEqual(result["created"], 1)
        self.assertTrue(Teacher.objects.filter(identity_code="99999").exists())

    def test_creates_contract_if_not_exists(self):
        InsertCeatService.execute(
            [self._row(**{"Código Docente": "88888"})], self.semester.id, self.faculty.id
        )
        self.assertTrue(
            Contract.objects.filter(teacher__identity_code="88888", faculty=self.faculty).exists()
        )

    def test_marks_semester_ceat_loaded(self):
        InsertCeatService.execute([self._row()], self.semester.id, self.faculty.id)
        self.semester.refresh_from_db()
        self.assertTrue(self.semester.ceat_loaded)

    def test_error_missing_teacher_code(self):
        result = InsertCeatService.execute(
            [self._row(**{"Código Docente": ""})], self.semester.id, self.faculty.id
        )
        self.assertEqual(result["created"], 0)
        self.assertEqual(len(result["errors"]), 1)

    def test_managed_credits_zero_when_no_sections(self):
        teacher2 = make_teacher(identity_code="55555", name="Otro Docente")
        result = InsertCeatService.execute(
            [self._row(**{"Código Docente": "55555"})], self.semester.id, self.faculty.id
        )
        history = TeacherLoadHistory.objects.get(teacher=teacher2, semester=self.semester)
        self.assertEqual(history.managed_credits, 0)
