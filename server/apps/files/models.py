from django.db import models

# Create your models here.
class File(models.Model):

    FILE_FORMATS = [
        ("ceat", "CEAT"),
        ("comments", "Comentarios"),
        ("control", "Control docente"),
        ("evaluation", "Evaluacion docente"),
    ]

    url = models.URLField(max_length=500, null=False)

    size = models.IntegerField()

    uploaded_at = models.DateTimeField(auto_now_add=True)

    format = models.CharField(
        max_length=20,
        choices=FILE_FORMATS
    )

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE
    )

    semester = models.ForeignKey(
        "academics.Semester",
        on_delete=models.CASCADE
    )

    processed = models.BooleanField(default=False)

    processed_at = models.DateTimeField(null=True, blank=True)