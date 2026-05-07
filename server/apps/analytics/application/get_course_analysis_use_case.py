from rest_framework.exceptions import NotFound

from apps.academics.utils import get_historical_semesters
from apps.analytics.models import CourseAnalysisAI


class GetCourseAnalysisUseCase:
    def execute(self, course_id: int, faculty_id: int) -> CourseAnalysisAI:
        semesters = get_historical_semesters(faculty_id)
        result = CourseAnalysisAI.objects.filter(
            course_id=course_id,
            semester_id=semesters[0].id,
        ).first()
        if not result:
            raise NotFound("Course analysis not found")
        return result
