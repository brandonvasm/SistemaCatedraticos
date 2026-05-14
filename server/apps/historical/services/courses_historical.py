from collections import defaultdict
from apps.historical.models import CourseHistory


def get_courses_evolution_data_service(faculty_id: int):

    histories = (
        CourseHistory.objects.filter(
            course__faculty_id=faculty_id
        )
        .select_related("course", "semester")
        .order_by("course_id", "semester__year", "semester__number")
    )

    course_names = {}
    ratings_by_course = defaultdict(list)

    for entry in histories:

        course_id = entry.course_id

        course_names[course_id] = entry.course.name

        ratings_by_course[course_id].append({
            "rating": entry.control_avg_score,
            "semester_year": entry.semester.year,
            "semester_number": entry.semester.number,
        })

    return [
        {
            "course_id": course_id,
            "course_name": course_names[course_id],
            "semester_ratings": ratings,
        }
        for course_id, ratings in ratings_by_course.items()
    ]