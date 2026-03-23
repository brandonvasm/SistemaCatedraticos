from django.db import models


# Create your models here.
class Faculty(models.Model):
    name = models.CharField(max_length=200)
    pensum_loaded = models.BooleanField(default=False)

class CostCenter(models.Model):
    name = models.CharField(max_length=200)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)


class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    cost_center = models.ForeignKey(CostCenter, on_delete=models.CASCADE)

class Teacher(models.Model):
    identity_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    created_at = models.DateField()
    is_active = models.BooleanField(default=True)


class Semester(models.Model):
    STATUS_CHOICES = [
        ("uploading", "Uploading"),
        ("processed", "Processed"),
        ("archived", "Archived"),
    ]

    year = models.IntegerField()
    number = models.IntegerField()
    ceat_loaded = models.BooleanField(default=False)
    comments_loaded = models.BooleanField(default=False)
    control_loaded = models.BooleanField(default=False)
    evaluation_loaded = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="uploading"
    )
    faculty = models.ForeignKey(
        Faculty, on_delete=models.SET_NULL, null=True, blank=True
    )

class CourseSection(models.Model):

    SHIFT_CHOICES = [
        ("matutina", "Matutina"),
        ("vespertina", "Vespertina"),
        ("fin de semana", "Fin de Semana"),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    section_number = models.CharField(max_length=20)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True)
    assigned_students = models.IntegerField(default=0)
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)

class Contract(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    