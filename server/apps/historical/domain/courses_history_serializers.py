# serializers.py
from rest_framework import serializers


class SemesterRatingSerializer(serializers.Serializer):
    rating = serializers.FloatField()
    semester_year = serializers.IntegerField()
    semester_number = serializers.IntegerField()


class CourseEvolutionSerializer(serializers.Serializer):
    course_id = serializers.IntegerField()
    course_name = serializers.CharField()
    semester_ratings = SemesterRatingSerializer(many=True)