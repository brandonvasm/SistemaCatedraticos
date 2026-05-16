from apps.academics.services.course_service import get_courses_data
from apps.academics.services.teacher_service import get_teachers_stats
from apps.users.service.user_service import get_users_data

def get_general_data(faculty_id=None):
    return {
        "teachers": get_teachers_stats(faculty_id),
        "courses": get_courses_data(faculty_id),
        "users": get_users_data()
    }