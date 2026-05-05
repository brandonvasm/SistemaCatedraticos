from rest_framework.exceptions import ValidationError, APIException

from apps.academics.utils import get_historical_semesters
from apps.analytics.models import TeacherCommentsAnalysisAI
from apps.analytics.infrastructure.gemini_ai_client import GeminiAIClient


class GetTeacherCommentsAnalysisUseCase:
    def execute(self, teacher_id: int, comments: list[str], faculty_id: int) -> TeacherCommentsAnalysisAI:
        semesters = get_historical_semesters(faculty_id)
        if not semesters:
            raise ValidationError("No historical semesters found for the user's faculty")

        current_semester_id = semesters[0].id

        analysis = TeacherCommentsAnalysisAI.objects.filter(
            teacher_id=teacher_id, semester_id=current_semester_id
        ).first()

        if not analysis:
            try:
                ai_client = GeminiAIClient()
                analysis_result = ai_client.generate_teacher_comment_analysis(comments)
            except Exception as e:
                raise APIException(detail=str(e))

            analysis = TeacherCommentsAnalysisAI.objects.create(
                teacher_id=teacher_id,
                ai_score=analysis_result["ai_score"],
                comment_overview=analysis_result["comment_overview"],
                comment=analysis_result["comment"],
                model_version=ai_client.model_version,
                perception=analysis_result["perception"],
                positive_percentage=analysis_result["positive_percentage"],
                negative_percentage=analysis_result["negative_percentage"],
                neutral_percentage=analysis_result["neutral_percentage"],
                semester_id=current_semester_id,
            )

        return analysis
