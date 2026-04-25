from django.db import models

# Create your models here.
class CourseHistory(models.Model):
    course = models.ForeignKey("academics.Course", on_delete=models.CASCADE)
    semester = models.ForeignKey("academics.Semester", on_delete=models.CASCADE)
    avg_student_score = models.FloatField(null=True, blank=True)
    control_avg_score = models.FloatField(null=True, blank=True)
    section_count = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TeacherLoadHistory(models.Model):
    teacher = models.ForeignKey("academics.Teacher", on_delete=models.CASCADE)
    semester = models.ForeignKey("academics.Semester", on_delete=models.CASCADE)
    managed_credits = models.IntegerField(null=True, blank=True)
    total_training_hours = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TeacherCourseHistory(models.Model):
    teacher = models.ForeignKey("academics.Teacher", on_delete=models.CASCADE)
    semester = models.ForeignKey("academics.Semester", on_delete=models.CASCADE)
    course = models.ForeignKey("academics.Course", on_delete=models.CASCADE)
    student_score = models.FloatField(null=True, blank=True)
    control_avg_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class SemesterHistory(models.Model):
    semester = models.ForeignKey("academics.Semester", on_delete=models.CASCADE)
    avg_score = models.FloatField(null=True, blank=True)
    teacher_count = models.IntegerField(null=True, blank=True)
    section_count = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)