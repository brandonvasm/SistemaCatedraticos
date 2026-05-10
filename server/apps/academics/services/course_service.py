from collections import defaultdict
from apps.historical.models import CourseHistory
from apps.academics.models import Course, CourseSection


def get_courses_data(faculty_id):
    try:
        if hasattr(faculty_id, "id"):
            faculty_id = faculty_id.id
        faculty_id = int(faculty_id)
    except:
        return []

    courses = list(
        Course.objects.filter(faculty_id=faculty_id)
    )

    course_ids = [c.id for c in courses]

    sections = CourseSection.objects.filter(
        course_id__in=course_ids
    ).values("course_id", "control_score")

    section_scores = defaultdict(list)
    for s in sections:
        if s["control_score"] is not None:
            section_scores[s["course_id"]].append(s["control_score"])

    histories = (
        CourseHistory.objects.filter(course_id__in=course_ids)
        .order_by("course_id", "semester__year", "semester__number")
        .values("course_id", "control_avg_score")
    )

    history_by_course = defaultdict(list)
    for h in histories:
        if h["control_avg_score"] is not None:
            history_by_course[h["course_id"]].append(h["control_avg_score"])

    result = []

    for course in courses:
        scores = section_scores.get(course.id, [])
        score = round(sum(scores) / len(scores), 2) if scores else 0

        trend = 0
        hist = history_by_course.get(course.id, [])

        if len(hist) >= 2 and hist[-2] != 0:
            trend = round(((hist[-1] - hist[-2]) / hist[-2]) * 100, 2)

        result.append({
            "id": course.id,
            "code": course.code,
            "name": course.name,
            "credits": course.credits,
            "score": score,
            "trend": trend,
        })

    return result