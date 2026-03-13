from dataclasses import fields

from rest_framework import serializers

from ..academics.models import Semester


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = [
            "id",
            "year",
            "number",
            "ceat_loaded",
            "comments_loaded",
            "control_loaded",
            "evaluation_loaded",
            "status",
        ]
        read_only_field = [
            "ceat_loaded",
            "comments_loaded",
            "control_loaded",
            "evaluation_loaded",
        ]
