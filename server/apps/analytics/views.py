from celery.result import AsyncResult
from kombu.exceptions import OperationalError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema

from .serializers import (
    TeacherCommentsAnalysisAISerializer,
    CommentsRequestSerializer,
    RecommendationsResponseSerializer,
    TeacherProfileAnalysisAISerializer,
    CourseAnalysisAISerializer,
)
from .application.get_course_analysis_use_case import GetCourseAnalysisUseCase
from .application.get_course_recommendations_use_case import GetCourseRecommendationsUseCase
from .application.get_teacher_profile_analysis_use_case import GetTeacherProfileAnalysisUseCase
from .application.get_teacher_recommendations_use_case import GetTeacherRecommendationsUseCase
from .tasks import generate_teacher_comments_analysis_task


class TeacherCommentsAnalysisAIView(APIView):
    @extend_schema(
        request=CommentsRequestSerializer,
        responses={200: TeacherCommentsAnalysisAISerializer},
    )
    def post(self, request):
        serializer = CommentsRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        try:
            task = generate_teacher_comments_analysis_task.delay(
                teacher_id=serializer.validated_data["teacher_id"],
                comments=serializer.validated_data["comments"],
                faculty_id=request.user.faculty_id_id,
            )
            print(
                "[Celery][Analytics] API enqueued teacher_comments "
                f"teacher_id={serializer.validated_data['teacher_id']} into Redis "
                f"with task_id={task.id}"
            )
        except OperationalError as e:
            return Response({
                "error": "No se pudo enviar el análisis a la cola. Verifique que Redis/Celery esté disponible.",
                "detail": str(e),
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({
                "error": f"No se pudo iniciar el análisis de comentarios: {e}",
                "teacher_id": serializer.validated_data["teacher_id"],
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "detail": "El análisis de comentarios fue enviado a la cola.",
            "task_id": task.id,
            "teacher_id": serializer.validated_data["teacher_id"],
        }, status=status.HTTP_202_ACCEPTED)


class TeacherCommentsAnalysisTaskStatusView(APIView):
    def get(self, request, task_id: str):
        try:
            task_result = AsyncResult(task_id)
            task_state = task_result.state
            task_info = task_result.info
        except Exception as e:
            print(f"[Celery][Analytics] Could not read task status task_id={task_id}: {e}")
            return Response({
                "task_id": task_id,
                "state": "FAILURE",
                "status": "failed",
                "error": (
                    "No se pudo recuperar el detalle de este análisis. "
                    "Reinicie el worker de Celery y vuelva a intentarlo."
                ),
                "first_error": (
                    "El resultado guardado en Redis no tiene el formato esperado. "
                    "Esto puede pasar si la tarea fue procesada por un worker anterior."
                ),
            }, status=status.HTTP_200_OK)

        response_data = {
            "task_id": task_id,
            "state": task_state,
        }

        if isinstance(task_info, dict) and task_info.get("status") == "failed":
            response_data["state"] = "FAILURE"
            response_data.update(task_info)
            return Response(response_data, status=status.HTTP_200_OK)

        if task_state == "SUCCESS":
            response_data["result"] = task_result.result
        elif task_state == "FAILURE":
            if isinstance(task_info, dict):
                response_data.update(task_info)
            else:
                response_data["error"] = str(task_result.result)
        elif task_info:
            response_data["meta"] = task_info

        return Response(response_data, status=status.HTTP_200_OK)


class CourseAnalysisAIView(ViewSet):
    @extend_schema(responses={200: CourseAnalysisAISerializer()})
    @action(detail=True, methods=["get"], url_path="course-analysis")
    def course(self, request, pk=None):
        analysis = GetCourseAnalysisUseCase().execute(
            course_id=pk,
            faculty_id=request.user.faculty_id_id, 
        )
        return Response(CourseAnalysisAISerializer(analysis).data)

    @extend_schema(responses={200: RecommendationsResponseSerializer})
    @action(detail=False, methods=["get"], url_path="general-recommendations")
    def general_recommendations(self, request):
        recommendations = GetCourseRecommendationsUseCase().execute(
            faculty_id=request.user.faculty_id_id,
        )
        return Response(RecommendationsResponseSerializer({"recommendations": recommendations}).data)


class TeacherProfileAnalysisAIView(ViewSet):
    @extend_schema(responses={200: TeacherProfileAnalysisAISerializer})
    @action(detail=True, methods=["get"], url_path="teacher-analysis")
    def teacher(self, request, pk=None):
        analysis = GetTeacherProfileAnalysisUseCase().execute(
            teacher_id=pk,
            faculty_id=request.user.faculty_id_id,
        )
        return Response(TeacherProfileAnalysisAISerializer(analysis).data)

    @extend_schema(responses={200: RecommendationsResponseSerializer})
    @action(detail=False, methods=["get"], url_path="general-recommendations")
    def general_recommendations(self, request):
        recommendations = GetTeacherRecommendationsUseCase().execute(
            faculty_id=request.user.faculty_id_id,
        )
        return Response(RecommendationsResponseSerializer({"recommendations": recommendations}).data)
