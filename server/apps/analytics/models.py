from django.db import models

class PerceptionChoices(models.TextChoices):
    POSITIVE = "positive", "Positive"
    NEUTRAL = "neutral", "Neutral"
    NEGATIVE = "negative", "Negative"

# Create your models here.
class TeacherCommentAnalysisAI(models.Model):
    course_section = models.ForeignKey("academics.CourseSection", on_delete=models.CASCADE)
    ai_score = models.FloatField()
    comment_overview = models.TextField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True, max_length=50)
    model_version = models.CharField(max_length=50)
    perception = models.CharField(max_length=20, choices=PerceptionChoices.choices, default="neutral")
    created_at = models.DateTimeField(auto_now_add=True)

class TeacherProfileAnalysisAI(models.Model):
    teacher = models.ForeignKey("academics.Teacher", on_delete=models.CASCADE)
    title = models.CharField(max_length=40)
    profile_overview = models.TextField(blank=True, null=True, max_length=50)
    model_version = models.CharField(max_length=50)
    perception = models.CharField(max_length=20, choices=PerceptionChoices.choices, default="neutral")
    created_at = models.DateTimeField(auto_now_add=True)

class CourseAnalysisAI(models.Model):
    course = models.ForeignKey("academics.Course", on_delete=models.CASCADE)
    title = models.CharField(max_length=40)
    course_overview = models.TextField(blank=True, null=True, max_length=50)
    model_version = models.CharField(max_length=50)
    perception = models.CharField(max_length=20, choices=PerceptionChoices.choices, default="neutral")
    created_at = models.DateTimeField(auto_now_add=True)
