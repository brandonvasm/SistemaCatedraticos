from urllib import response

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
from .application.get_teacher_comments_analysis_use_case import GetTeacherCommentsAnalysisUseCase
from .application.get_course_analysis_use_case import GetCourseAnalysisUseCase
from .application.get_course_recommendations_use_case import GetCourseRecommendationsUseCase
from .application.get_teacher_profile_analysis_use_case import GetTeacherProfileAnalysisUseCase
from .application.get_teacher_recommendations_use_case import GetTeacherRecommendationsUseCase
from .test_ai import TestUC


class TeacherCommentsAnalysisAIView(APIView):
    @extend_schema(
        request=CommentsRequestSerializer,
        responses={200: TeacherCommentsAnalysisAISerializer},
    )
    def post(self, request):
        serializer = CommentsRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        analysis = GetTeacherCommentsAnalysisUseCase().execute(
            teacher_id=serializer.validated_data["teacher_id"],
            comments=serializer.validated_data["comments"],
            faculty_id=request.user.faculty_id_id,
        )
        return Response(TeacherCommentsAnalysisAISerializer(analysis).data)


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
        TestUC._trigger_teacher_ai_analysis(set(range(31, 50)), 1)
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
