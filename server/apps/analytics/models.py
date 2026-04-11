from django.db import models

# Create your models here.
class TeacherAnalysisAI(models.Model):
    PERCEPTION_CHOICES = [
        ("positive", "Positive"),
        ("neutral", "Neutral"),
        ("negative", "Negative"),
    ]

    course_section = models.ForeignKey("academics.CourseSection", on_delete=models.CASCADE)
    ai_score = models.FloatField()
    comment_overview = models.TextField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    model_version = models.CharField(max_length=50)
    perception = models.CharField(max_length=20, choices=PERCEPTION_CHOICES, default="neutral")
    created_at = models.DateTimeField(auto_now_add=True)
