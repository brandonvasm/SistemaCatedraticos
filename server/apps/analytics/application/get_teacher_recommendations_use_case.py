from apps.academics.utils import get_historical_semesters
from apps.analytics.models import TeacherGeneralRecomendationsAI


class GetTeacherRecommendationsUseCase:
    def execute(self, faculty_id: int) -> list[str]:
        semesters = get_historical_semesters(faculty_id)
        recommendations = TeacherGeneralRecomendationsAI.objects.filter(
            semester_id=semesters[0].id
        )
        return [rec.recomendation for rec in recommendations]
