from django.db import models

# Create your models here.
class TeacherAnalysisAI(models.Model):
    course_section = models.ForeignKey("academics.CourseSection", on_delete=models.CASCADE)
    ai_score = models.FloatField()
    comment_overview = models.TextField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    model_version = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class SectionStats(models.Model):

    PERFORMANCE_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    course_section = models.ForeignKey("academics.CourseSection", on_delete=models.CASCADE)
    average_score = models.FloatField()
    median_score = models.FloatField()
    evaluation_count = models.IntegerField()
    submitted_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    performance_level = models.CharField(max_length=20, blank=True, null=True, choices=PERFORMANCE_CHOICES)