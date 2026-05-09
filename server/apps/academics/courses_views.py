from collections import defaultdict
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.historical.models import CourseHistory
from apps.users.infrastructure.authentication import CookieJWTAuthentication
from apps.users.infrastructure.permissions import IsSysAdminOrCoordinator

from .models import Course, CourseSection
from .serializers import CourseListResponseSerializer


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 100

class CourseListView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsSysAdminOrCoordinator]

    @extend_schema(
        summary="List courses with evaluation score and performance trend",
        responses={200: CourseListResponseSerializer},
    )
    def get(self, request):
        queryset = Course.objects.filter(
            cost_center__faculty=request.user.faculty_id
        ).select_related('cost_center').order_by('id')
        
        courses = list(queryset)
        course_ids = [c.id for c in courses]

        sections = CourseSection.objects.filter(
            course_id__in=course_ids, control_score__isnull=False
        ).values("course_id", "control_score")

        section_scores = defaultdict(list)
        for section in sections:
            section_scores[section["course_id"]].append(section["control_score"])

        histories = (
            CourseHistory.objects.filter(course_id__in=course_ids)
            .order_by("course_id", "semester__year", "semester__number")
            .values("course_id", "control_avg_score")
        )

        history_by_course = defaultdict(list)
        for h in histories:
            history_by_course[h["course_id"]].append(h["control_avg_score"])

        courses_data = []
        for course in courses:
            scores = section_scores.get(course.id, [])
            course_score = round(sum(scores) / len(scores), 2) if scores else None

            trend = None
            hist = history_by_course.get(course.id, [])
            if len(hist) >= 2 and hist[-2] != 0:
                trend = round(((hist[-1] - hist[-2]) / hist[-2]) * 100, 2)

            courses_data.append(
                {
                    "id": course.id,
                    "code": course.code,
                    "name": course.name,
                    "credits": course.credits,
                    "cost_center_id": course.cost_center.id,
                    "cost_center_name": course.cost_center.name,
                    "score": course_score,
                    "trend": trend,
                }
            )

        page_param = request.query_params.get('page')
        
        if page_param:
            paginator = StandardResultsSetPagination()
            paginated_data = paginator.paginate_queryset(courses_data, request)
            return paginator.get_paginated_response(paginated_data)

        return Response({
            "total": len(courses_data), 
            "courses": courses_data
        })
    
class CourseDetailView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsSysAdminOrCoordinator]

    @extend_schema(
        summary="detalles de cursos individuales",
    )

    def get(self, request, pk):
        course = get_object_or_404(
            Course, 
            id=pk, 
            cost_center__faculty_id=request.user.faculty_id
        )

        sections = CourseSection.objects.filter(
            course_id=course.id,
            control_score__isnull=False
        ).values("control_score")

        scores = [section["control_score"] for section in sections]
        course_score = round(sum(scores) / len(scores), 2) if scores else None

        histories = (
            CourseHistory.objects.filter(course_id=course.id)
            .order_by("semester__year", "semester__number")
            .values("control_avg_score")
        )

        hist = [h["control_avg_score"] for h in histories]
        
        trend = None

        if len(hist) >= 2:
            last_score = hist[-1]
            previous_score = hist[-2]
            if previous_score != 0:
                trend = round(((last_score - previous_score) / previous_score) * 100, 2)

        return Response({
            "id": course.id,
            "code": course.code,
            "name": course.name,
            "credits": course.credits,
            "cost_center_id": course.cost_center.id,
            "cost_center_name": course.cost_center.name,
            "score": course_score,
            "trend": trend,
        })
