from apps.academics.utils import get_historical_semesters
from apps.analytics.models import CourseGeneralRecomendationsAI


class GetCourseRecommendationsUseCase:
    def execute(self, faculty_id: int) -> list[str]:
        semesters = get_historical_semesters(faculty_id)
        recommendations = CourseGeneralRecomendationsAI.objects.filter(
            semester_id=semesters[0].id
        )
        return [rec.recomendation for rec in recommendations]
