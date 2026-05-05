from rest_framework import serializers

from .models import TrainingHours


class TrainingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingHours
        fields = [
            "id",
            "teacher",
            "faculty",
            "initiation_count",
            "transition_count",
            "autonomy_count",
            "complementary_count",
            "created_at",
        ]
