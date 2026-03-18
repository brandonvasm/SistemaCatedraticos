from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):

    ROLE_CHOICES = [
        ("admin", "SysAdmin"),
        ("coordinator", "Coordinator"),
    ]

    faculty_id = models.ForeignKey("academics.Faculty", on_delete=models.SET_NULL, null=True, blank=True)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    evaluation_count = models.IntegerField(default=0)

    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username
    