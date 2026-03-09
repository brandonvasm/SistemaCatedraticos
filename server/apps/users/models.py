from django.db import models

# Create your models here.
class Faculty(models.Model):
    name = models.CharField(max_length=200)

class CostCenter(models.Model):
    name = models.CharField(max_length=200)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)

class Course(models.Model):
    code = models.CharField(max_length=20)
    name = models.CharField(max_length=200)
    cost_center = models.ForeignKey(CostCenter, on_delete=models.CASCADE)
    