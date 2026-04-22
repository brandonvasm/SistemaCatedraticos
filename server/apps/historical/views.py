from collections import defaultdict

from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

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

        histories = (
            CourseHistory.objects.filter(course__cost_center__faculty=user_faculty)
            .select_related("course", "semester")
            .order_by("course_id", "-semester__year", "-semester__number")
        )

        course_names = {}
        ratings_by_course = defaultdict(list)

        for entry in histories:
            print(entry.course_id, entry.control_avg_score, entry.semester.year, entry.semester.number)
            course_names[entry.course_id] = entry.course.name
            ratings_by_course[entry.course_id].append(
                {
                    "rating": entry.control_avg_score,
                    "semester_year": entry.semester.year,
                    "semester_number": entry.semester.number,
                }
            )

        data = [
            {
                "course_id": course_id,
                "course_name": course_names[course_id],
                "semester_ratings": ratings,
            }
            for course_id, ratings in ratings_by_course.items()
        ]

        return Response(CourseEvolutionSerializer(data, many=True).data)
