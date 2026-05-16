from django.db import models

# Create your models here.
class StudentEvaluation(models.Model):

    PERFORMANCE_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    course_section = models.ForeignKey("academics.CourseSection", on_delete=models.CASCADE)
    score = models.FloatField()
    submitted_count = models.IntegerField()
    assigned_students = models.IntegerField()
    performance_level = models.CharField(max_length=20, blank=True, null=True, choices=PERFORMANCE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    course_section = models.ForeignKey("academics.CourseSection", on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class SectionControl(models.Model):
    course_section = models.ForeignKey("academics.CourseSection", on_delete=models.CASCADE)
    high_count = models.IntegerField()
    medium_count = models.IntegerField()
    low_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

class TrainingHours(models.Model):
    teacher = models.ForeignKey("academics.Teacher", on_delete=models.CASCADE)
    faculty = models.ForeignKey("academics.Faculty", on_delete=models.CASCADE)
    initiation_count = models.IntegerField()
    transition_count = models.IntegerField()
    autonomy_count = models.IntegerField()
    complementary_count = models.IntegerField()
    semester = models.ForeignKey("academics.Semester", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)