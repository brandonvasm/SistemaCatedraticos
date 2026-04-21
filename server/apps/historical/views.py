from collections import defaultdict

from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.evaluations.models import SectionControl
from apps.users.infrastructure.authentication import CookieJWTAuthentication
from apps.users.infrastructure.permissions import IsSysAdminOrCoordinator

from .domain.courses_history_serializers import CourseEvolutionSerializer
from .models import CourseHistory


class CourseHistoryViewSet(viewsets.ViewSet):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsSysAdminOrCoordinator]

    @extend_schema(
        summary="Course evolution",
        responses={
            200: OpenApiResponse(
                response=CourseEvolutionSerializer(many=True),
                description="Courses and scores list",
                examples=[
                    OpenApiExample(
                        "course_evolution_example",
                        value=[
                            {
                                "course_id": 1,
                                "course_name": "Math",
                                "semester_ratings": [
                                    {"rating": 4.5, "semester_year": 2024, "semester_number": 1},
                                    {"rating": 3.8, "semester_year": 2024, "semester_number": 2},
                                    {"rating": 4.1, "semester_year": 2025, "semester_number": 1},
                                ],
                            }
                        ],
                    )
                ],
            )
        },
        tags=["Course History"],
    )
    @action(detail=False, methods=["get"], url_path="evolution")
    def evolution(self, request):
        user_faculty = request.user.faculty_id

        last_3_semester_ids = list(
            CourseHistory.objects.filter(course__cost_center__faculty=user_faculty)
            .values_list("semester_id", flat=True)
            .distinct()
            .order_by("-semester__year", "-semester__number")[:3]
        )

        controls = SectionControl.objects.filter(
            course_section__semester_id__in=last_3_semester_ids,
            course_section__course__cost_center__faculty=user_faculty,
        ).values(
            "course_section__course_id",
            "course_section__course__name",
            "course_section__semester__year",
            "course_section__semester__number",
            "high_count",
            "medium_count",
            "low_count",
        )

        course_names = {}
        section_scores = defaultdict(lambda: defaultdict(list))

        for ctrl in controls:
            course_id = ctrl["course_section__course_id"]
            course_names[course_id] = ctrl["course_section__course__name"]
            semester_key = (
                ctrl["course_section__semester__year"],
                ctrl["course_section__semester__number"],
            )
            total = ctrl["high_count"] + ctrl["medium_count"] + ctrl["low_count"]
            if total > 0:
                section_scores[course_id][semester_key].append(
                    (ctrl["high_count"] / total) * 100
                )

        data = [
            {
                "course_id": course_id,
                "course_name": course_names[course_id],
                "semester_ratings": [
                    {
                        "rating": round(sum(scores) / len(scores), 2),
                        "semester_year": year,
                        "semester_number": number,
                    }
                    for (year, number), scores in sorted(semester_data.items())
                ],
            }
            for course_id, semester_data in section_scores.items()
        ]

        return Response(CourseEvolutionSerializer(data, many=True).data)
