from collections import defaultdict

from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.historical.models import CourseHistory
from apps.users.infrastructure.authentication import CookieJWTAuthentication
from apps.users.infrastructure.permissions import IsSysAdminOrCoordinator

from .models import Course, CourseSection
from .serializers import CourseListResponseSerializer


class CourseListView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsSysAdminOrCoordinator]

    @extend_schema(
        summary="List courses with evaluation score and performance trend",
        responses={200: CourseListResponseSerializer},
    )
    def get(self, request):
        courses = list(Course.objects.filter(cost_center__faculty=request.user.faculty_id))
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
                    "score": course_score,
                    "trend": trend,
                }
            )

        return Response({"total": len(courses_data), "courses": courses_data})
