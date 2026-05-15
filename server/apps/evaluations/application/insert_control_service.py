from django.db.models import Avg, Count

from apps.academics.models import Course, CourseSection, Semester
from apps.analytics.infrastructure.gemini_ai_client import GeminiAIClient
from apps.analytics.models import CourseAnalysisAI, CourseGeneralRecomendationsAI
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


def _bulk_upsert_teacher_course_history(semester_id: int, course_ids: set[int]) -> None:
    rows = list(
        CourseSection.objects.filter(
            semester_id=semester_id,
            course_id__in=course_ids,
            control_score__isnull=False,
            teacher__isnull=False,
        )
        .values("teacher_id", "course_id")
        .annotate(avg=Avg("control_score"))
    )
    if not rows:
        return

    teacher_ids = {r["teacher_id"] for r in rows}
    c_ids = {r["course_id"] for r in rows}
    existing_map = {
        (r.teacher_id, r.course_id): r
        for r in TeacherCourseHistory.objects.filter(
            semester_id=semester_id,
            teacher_id__in=teacher_ids,
            course_id__in=c_ids,
        )
    }
    to_create = []
    to_update = []
    for r in rows:
        avg = round(r["avg"], 2)
        record = existing_map.get((r["teacher_id"], r["course_id"]))
        if record:
            record.control_avg_score = avg
            to_update.append(record)
        else:
            to_create.append(TeacherCourseHistory(
                teacher_id=r["teacher_id"],
                semester_id=semester_id,
                course_id=r["course_id"],
                control_avg_score=avg,
            ))
    if to_update:
        TeacherCourseHistory.objects.bulk_update(to_update, ["control_avg_score"])
    if to_create:
        TeacherCourseHistory.objects.bulk_create(to_create)


def _bulk_upsert_course_history(semester_id: int, course_ids: set[int]) -> None:
    control_stats = {
        d["course_id"]: {"control_avg": d["control_avg"], "section_count": d["section_count"]}
        for d in CourseSection.objects.filter(
            semester_id=semester_id,
            course_id__in=course_ids,
        )
        .values("course_id")
        .annotate(control_avg=Avg("control_score"), section_count=Count("id"))
    }

    student_avgs = {
        d["course_section__course_id"]: d["avg"]
        for d in StudentEvaluation.objects.filter(
            course_section__semester_id=semester_id,
            course_section__course_id__in=course_ids,
        )
        .values("course_section__course_id")
        .annotate(avg=Avg("score"))
    }

    existing_map = {
        r.course_id: r
        for r in CourseHistory.objects.filter(semester_id=semester_id, course_id__in=course_ids)
    }

    to_create = []
    to_update = []
    for course_id in course_ids:
        stats = control_stats.get(course_id, {})
        control_avg = stats.get("control_avg")
        section_count = stats.get("section_count", 0)
        student_avg = student_avgs.get(course_id)

        record = existing_map.get(course_id)
        if record:
            record.control_avg_score = round(control_avg, 2) if control_avg is not None else None
            record.avg_student_score = round(student_avg, 2) if student_avg is not None else None
            record.section_count = section_count
            to_update.append(record)
        else:
            to_create.append(CourseHistory(
                course_id=course_id,
                semester_id=semester_id,
                control_avg_score=round(control_avg, 2) if control_avg is not None else None,
                avg_student_score=round(student_avg, 2) if student_avg is not None else None,
                section_count=section_count,
            ))
    if to_update:
        CourseHistory.objects.bulk_update(to_update, ["control_avg_score", "avg_student_score", "section_count"])
    if to_create:
        CourseHistory.objects.bulk_create(to_create)


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

            if current_score > 85:
                continue

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

        for recomendation in response["recomendations"]:
            try:
                CourseGeneralRecomendationsAI.objects.create(
                    semester_id=semester_id,
                    recomendation=recomendation,
                    model_version=ai_client.model_version,
                )
            except Exception as e:
                errors.append(f"AI save for general recommendation: {e}")

        for analysis in response["analyses"]:
            try:
                CourseAnalysisAI.objects.create(
                    course_id=analysis["course_id"],
                    semester_id=semester_id,
                    title=analysis["title"],
                    course_overview=analysis["course_recomendation"],
                    perception=analysis["perception"],
                    model_version=ai_client.model_version,
                )
            except Exception as e:
                errors.append(f"AI save for course {analysis['course_id']}: {e}")
    except Exception as e:
        errors.append(f"AI course analysis: {e}")

    return errors


class InsertControlService:
    @staticmethod
    def execute(rows: list[dict], semester_id: int, faculty_id: int) -> dict:
        created = 0
        errors = []
        processed_courses: set[int] = set()

        course_names = {str(row.get("Curso", "")).strip() for row in rows}
        courses_map = {
            c.name: c
            for c in Course.objects.filter(name__in=course_names, faculty_id=faculty_id)
        }

        sections_map: dict[tuple[int, str], CourseSection] = {
            (s.course_id, s.section_number): s
            for s in CourseSection.objects.filter(
                semester_id=semester_id,
                course__name__in=course_names,
            )
        }

        controls_to_create = []
        section_score_updates: dict[int, tuple[CourseSection, float | None]] = {}

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

                course = courses_map.get(course_name)
                if course is None:
                    errors.append(f"Row {i}: course '{course_name}' not found in faculty {faculty_id}")
                    continue

                section = sections_map.get((course.id, section_number))
                if section is None:
                    errors.append(
                        f"Row {i}: section {section_number}/{shift} for '{course_name}' not found"
                    )
                    continue

                controls_to_create.append(SectionControl(
                    course_section=section,
                    high_count=high,
                    medium_count=medium,
                    low_count=low,
                ))
                created += 1

                score = _control_score(high, medium, low)
                section.control_score = score
                section_score_updates[section.id] = section

                processed_courses.add(course.id)

            except Exception as e:
                errors.append(f"Row {i}: {e}")

        if controls_to_create:
            SectionControl.objects.bulk_create(controls_to_create)

        if section_score_updates:
            CourseSection.objects.bulk_update(
                list(section_score_updates.values()), ["control_score"]
            )

        if processed_courses:
            try:
                _bulk_upsert_teacher_course_history(semester_id, processed_courses)
            except Exception as e:
                errors.append(f"TeacherCourseHistory bulk update: {e}")

            try:
                _bulk_upsert_course_history(semester_id, processed_courses)
            except Exception as e:
                errors.append(f"CourseHistory bulk update: {e}")

            try:
                _update_semester_history(semester_id)
            except Exception as e:
                errors.append(f"SemesterHistory update: {e}")

        Semester.objects.filter(id=semester_id).update(control_loaded=True)

        if processed_courses:
            errors.extend(_trigger_course_ai_analysis(processed_courses, semester_id))

        return {"created": created, "errors": errors}
