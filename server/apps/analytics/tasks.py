from celery import shared_task

from apps.analytics.application.get_teacher_comments_analysis_use_case import (
    GetTeacherCommentsAnalysisUseCase,
)
from apps.analytics.serializers import TeacherCommentsAnalysisAISerializer


def _fail_task(payload: dict) -> dict:
    print(f"[Celery][Analytics] Task failed: {payload}")
    return payload


@shared_task(bind=True)
def generate_teacher_comments_analysis_task(
    self,
    teacher_id: int,
    comments: list[str],
    faculty_id: int,
) -> dict:
    try:
        print(f"[Celery][Analytics] Worker received teacher_id={teacher_id}. Reading from Redis queue.")
        self.update_state(
            state="PROGRESS",
            meta={
                "step": "generating_teacher_comments_analysis",
                "teacher_id": teacher_id,
            },
        )

        analysis = GetTeacherCommentsAnalysisUseCase().execute(
            teacher_id=teacher_id,
            comments=comments,
            faculty_id=faculty_id,
        )

        result_payload = {
            "status": "completed",
            "analysis": TeacherCommentsAnalysisAISerializer(analysis).data,
        }
        print(f"[Celery][Analytics] Task completed. Result stored in Redis: {result_payload}")
        return result_payload
    except Exception as exc:
        return _fail_task({
            "status": "failed",
            "error": f"No se pudo generar el análisis de comentarios: {exc}",
            "teacher_id": teacher_id,
        })
