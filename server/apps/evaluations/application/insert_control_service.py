from django.db.models import Avg, Count

from apps.academics.models import Course, CourseSection, Semester
from apps.analytics.infrastructure.gemini_ai_client import GeminiAIClient
from apps.analytics.models import CourseAnalysisAI
from apps.evaluations.models import SectionControl, StudentEvaluation
from apps.historical.models import CourseHistory, SemesterHistory, TeacherCourseHistory



_SHIFT_MAP = {
    "Matutina": "matutina",
    "Vespertina": "vespertina",
    "Fin de semana": "fin de semana",
    "Sabatina": "fin de semana",
}


def _normalize_shift(raw: str) -> str:
    return _SHIFT_MAP.get(raw.strip().lower(), raw.strip().lower())


def _control_score(high: int, medium: int, low: int) -> float | None:
    total = high + medium + low
    if total == 0:
        return None
    return round(high / total * 100, 2)


def _update_teacher_course_history(teacher, semester_id: int, course) -> None:
    sections = CourseSection.objects.filter(
        course=course,
        teacher=teacher,
        semester_id=semester_id,
        control_score__isnull=False,
    )
    avg = sections.aggregate(avg=Avg("control_score"))["avg"]
    if avg is None:
        return
    TeacherCourseHistory.objects.update_or_create(
        teacher=teacher,
        semester_id=semester_id,
        course=course,
        defaults={"control_avg_score": round(avg, 2)},
    )


def _update_course_history(course, semester_id: int) -> None:
    sections = CourseSection.objects.filter(course=course, semester_id=semester_id)
    section_ids = list(sections.values_list("id", flat=True))
    section_count = len(section_ids)

    control_avg = (
        sections.filter(control_score__isnull=False)
        .aggregate(avg=Avg("control_score"))["avg"]
    )
    student_avg = (
        StudentEvaluation.objects.filter(course_section_id__in=section_ids)
        .aggregate(avg=Avg("score"))["avg"]
    )

    CourseHistory.objects.update_or_create(
        course=course,
        semester_id=semester_id,
        defaults={
            "control_avg_score": round(control_avg, 2) if control_avg is not None else None,
            "avg_student_score": round(student_avg, 2) if student_avg is not None else None,
            "section_count": section_count,
        },
    )


def _update_semester_history(semester_id: int) -> None:
    sections = CourseSection.objects.filter(semester_id=semester_id)
    section_count = sections.count()
    teacher_count = (
        sections.exclude(teacher__isnull=True)
        .values("teacher_id")
        .distinct()
        .count()
    )
    avg_score = (
        sections.filter(control_score__isnull=False)
        .aggregate(avg=Avg("control_score"))["avg"]
    )

    SemesterHistory.objects.update_or_create(
        semester_id=semester_id,
        defaults={
            "avg_score": round(avg_score, 2) if avg_score is not None else None,
            "section_count": section_count,
            "teacher_count": teacher_count,
        },
    )


def _trigger_course_ai_analysis(processed_courses: set[int], semester_id: int) -> list[str]:
    errors = []
    try:
        current_semester = Semester.objects.get(id=semester_id)
        prev_semester = (
            Semester.objects.filter(faculty_id=current_semester.faculty_id)
            .exclude(id=semester_id)
            .order_by("-year", "-number")
            .first()
        )

        courses_data = []
        for course_id in processed_courses:
            current_history = CourseHistory.objects.filter(
                course_id=course_id, semester_id=semester_id
            ).first()
            if not current_history or current_history.control_avg_score is None:
                continue

            current_score = current_history.control_avg_score
            tendency = None
            if prev_semester:
                prev_history = CourseHistory.objects.filter(
                    course_id=course_id, semester_id=prev_semester.id
                ).first()
                if prev_history and prev_history.control_avg_score:
                    tendency = round(
                        (current_score - prev_history.control_avg_score)
                        / prev_history.control_avg_score * 100,
                        2,
                    )

            courses_data.append({
                "id_course": course_id,
                "score": current_score,
                "tendency": tendency,
            })

        if not courses_data:
            return errors

        ai_client = GeminiAIClient()
        response = ai_client.generate_course_analysis(courses_data)
        for analysis in response.analyses:
            try:
                CourseAnalysisAI.objects.create(
                    course_id=analysis.course_id,
                    semester_id=semester_id,
                    title=analysis.title,
                    course_overview=analysis.course_overview,
                    perception=analysis.perception,
                    model_version=ai_client.model_version,
                )
            except Exception as e:
                errors.append(f"AI save for course {analysis.course_id}: {e}")
    except Exception as e:
        errors.append(f"AI course analysis: {e}")

    return errors


class InsertControlService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        errors = []

        processed_courses: set[int] = set()

        for i, row in enumerate(rows):
            try:
                course_name = str(row.get("Curso", "")).strip()
                section_number = str(row.get("Sección", "")).strip()
                shift = _normalize_shift(str(row.get("Jornada", "")))
                high = int(row.get("cantidad_1") or 0)
                medium = int(row.get("cantidad_0_5") or 0)
                low = int(row.get("cantidad_0") or 0)

                if not course_name or not section_number:
                    errors.append(f"Row {i}: Curso and Sección are required")
                    continue

                try:
                    course = Course.objects.get(name=course_name, faculty_id=faculty_id)
                except Course.DoesNotExist:
                    errors.append(f"Row {i}: course '{course_name}' not found in faculty {faculty_id}")
                    continue
                except Course.MultipleObjectsReturned:
                    errors.append(f"Row {i}: multiple courses named '{course_name}' in faculty {faculty_id}")
                    continue

                try:
                    section = CourseSection.objects.get(
                        course=course,
                        section_number=section_number,
                        shift=shift,
                    )
                except CourseSection.DoesNotExist:
                    errors.append(
                        f"Row {i}: section {section_number}/{shift} for '{course_name}' not found"
                    )
                    continue

                SectionControl.objects.create(
                    course_section=section,
                    high_count=high,
                    medium_count=medium,
                    low_count=low,
                )
                created += 1

                score = _control_score(high, medium, low)
                section.control_score = score
                section.save(update_fields=["control_score"])

                if section.teacher:
                    _update_teacher_course_history(section.teacher, semester_id, course)

                processed_courses.add(course.id)

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        for course_id in processed_courses:
            try:
                course = Course.objects.get(id=course_id)
                _update_course_history(course, semester_id)
            except Exception as e:
                errors.append(f"CourseHistory update for course {course_id}: {e}")

        if processed_courses:
            try:
                _update_semester_history(semester_id)
            except Exception as e:
                errors.append(f"SemesterHistory update: {e}")

        Semester.objects.filter(id=semester_id).update(control_loaded=True)

        if processed_courses:
            errors.extend(_trigger_course_ai_analysis(processed_courses, semester_id))

        return {"created": created, "errors": errors}
