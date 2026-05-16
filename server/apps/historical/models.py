from django.db import models

# Create your models here.
class CourseHistory(models.Model):
    course = models.ForeignKey("academics.Course", on_delete=models.CASCADE)
    semester = models.ForeignKey("academics.Semester", on_delete=models.CASCADE)
    avg_student_score = models.FloatField(null=True, blank=True)
    control_avg_score = models.FloatField(null=True, blank=True)
    section_count = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['course', 'semester'], name='chist_crs_sem_idx'),
        ]


class TeacherLoadHistory(models.Model):
    teacher = models.ForeignKey("academics.Teacher", on_delete=models.CASCADE)
    semester = models.ForeignKey("academics.Semester", on_delete=models.CASCADE)
    managed_credits = models.IntegerField(null=True, blank=True)
    total_training_hours = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['teacher', 'semester'], name='tlhist_tchr_sem_idx'),
        ]


class TeacherCourseHistory(models.Model):
    teacher = models.ForeignKey("academics.Teacher", on_delete=models.CASCADE)
    semester = models.ForeignKey("academics.Semester", on_delete=models.CASCADE)
    course = models.ForeignKey("academics.Course", on_delete=models.CASCADE)
    student_score = models.FloatField(null=True, blank=True)
    control_avg_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['teacher', 'semester'], name='tchist_tchr_sem_idx'),
            models.Index(fields=['teacher', 'course'], name='tchist_tchr_crs_idx'),
        ]


class SemesterHistory(models.Model):
    semester = models.ForeignKey("academics.Semester", on_delete=models.CASCADE)
    avg_score = models.FloatField(null=True, blank=True)
    teacher_count = models.IntegerField(null=True, blank=True)
    section_count = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)