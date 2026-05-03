from rest_framework import serializers

from .models import TeacherCommentsAnalysisAI, TeacherProfileAnalysisAI, CourseAnalysisAI

class TeacherCommentsAnalysisAISerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherCommentsAnalysisAI
        fields = "__all__"

class TeacherProfileAnalysisAISerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfileAnalysisAI
        fields = "__all__"

class CourseAnalysisAISerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseAnalysisAI
        fields = "__all__"

class CommentsRequestSerializer(serializers.Serializer):
    teacher_id = serializers.IntegerField()
    comments = serializers.ListField(
            child=serializers.CharField(),
            allow_empty=True
        )