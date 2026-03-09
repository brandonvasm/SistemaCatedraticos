from django.db import models

# Create your models here.
class Faculty(models.Model):
    name = models.CharField(max_length=200)

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
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="uploading")
