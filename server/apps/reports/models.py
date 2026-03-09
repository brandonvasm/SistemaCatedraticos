from django.db import models

# Create your models here.
class Report(models.Model):
    subject = models.CharField(max_length=255)
    description = models.TextField()
    file_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Notification(models.Model):
    
    TYPE_CHOICES = [
        ("warning", "Warning"),
        ("info", "Information"),
        ("success", "Success"),
    ]
    
    subject = models.CharField(max_length=255)
    message = models.TextField()
    focus = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
