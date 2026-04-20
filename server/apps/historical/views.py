# views.py
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from django.db.models import Subquery, OuterRef
from itertools import groupby

from .models import CourseHistory
from .domain.courses_history_serializers import CourseEvolutionSerializer


class CourseHistoryViewSet(viewsets.ViewSet):
    @extend_schema(
        summary="Course evolution",
        responses={
            200: OpenApiResponse(
                response=CourseEvolutionSerializer(many=True),
                description="Courses and scores list",
                examples=[
                    OpenApiExample(
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
        last_3_semester_ids = (
            CourseHistory.objects
            .values_list("semester_id", flat=True)
            .distinct()
            .order_by("-semester__year", "-semester__number")
            [:3]
        )

        histories = (
            CourseHistory.objects
            .filter(semester_id__in=last_3_semester_ids)
            .select_related("course", "semester")
            .order_by("course_id", "-semester__year", "-semester__number")
        )

        data = []
        for course_id, group in groupby(histories, key=lambda h: h.course_id):
            entries = list(group)
            data.append(
                {
                    "course_id": course_id,
                    "course_name": entries[0].course.name,  
                    "semester_ratings": [
                        {
                            "rating": entry.control_high_count,
                            "semester_year": entry.semester.year,
                            "semester_number": entry.semester.number,
                        }
                        for entry in entries
                    ],
                }
            )

        serializer = CourseEvolutionSerializer(data, many=True)
        return Response(serializer.data)
    