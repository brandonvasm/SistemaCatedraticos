from rest_framework.exceptions import NotFound

from apps.academics.utils import get_historical_semesters
from apps.analytics.models import TeacherProfileAnalysisAI


class GetTeacherProfileAnalysisUseCase:
    def execute(self, teacher_id: int, faculty_id: int) -> TeacherProfileAnalysisAI:
        semesters = get_historical_semesters(faculty_id)
        result = TeacherProfileAnalysisAI.objects.filter(
            teacher_id=teacher_id,
            semester_id=semesters[0].id,
        ).first()
        if not result:
            raise NotFound("Teacher profile analysis not found")
        return result
