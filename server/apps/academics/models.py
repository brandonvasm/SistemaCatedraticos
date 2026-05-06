from django.db import models


class Faculty(models.Model):
    name = models.CharField(max_length=200)


class Career(models.Model):
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, blank=True, default='')
    abbreviation = models.CharField(max_length=20, blank=True, default='')
    pensum_loaded = models.BooleanField(default=False)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)

    class Meta:
        indexes = [
            models.Index(fields=['faculty', 'abbreviation'], name='career_faculty_abbr_idx'),
        ]


class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    credits = models.IntegerField(default=0)
    cost_center = models.ForeignKey(Career, on_delete=models.CASCADE)
    faculty = models.ForeignKey(Faculty, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['faculty', 'name'], name='course_faculty_name_idx'),
        ]


class Teacher(models.Model):
    identity_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    created_at = models.DateField()


class Semester(models.Model):
    STATUS_CHOICES = [
        ("uploading", "Uploading"),
        ("processed", "Processed"),
        ("archived", "Archived"),
    ]
    year = models.IntegerField()
    number = models.IntegerField()
    roster_loaded = models.BooleanField(default=False)
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

    class Meta:
        indexes = [
            models.Index(fields=['faculty', 'year', 'number'], name='sem_fac_yr_num_idx'),
        ]


class CourseSection(models.Model):
    SHIFT_CHOICES = [
        ("matutina", "Matutina"),
        ("vespertina", "Vespertina"),
        ("fin de semana", "Fin de Semana"),
    ]
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    section_number = models.CharField(max_length=20)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    teacher = models.ForeignKey(
        Teacher, on_delete=models.SET_NULL, null=True, blank=True
    )
    control_score = models.FloatField(null=True, blank=True)
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)
    appointment_number = models.CharField(max_length=50, blank=True, default='')
    credits = models.IntegerField(null=True, blank=True)

    class Meta:
        unique_together = (('course', 'section_number', 'shift'),)
        indexes = [
            models.Index(fields=['course', 'semester'], name='cs_crs_sem_idx'),
            models.Index(fields=['appointment_number'], name='coursesection_appointment_idx'),
        ]


class Contract(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=['teacher', 'faculty'], name='contract_teacher_faculty_idx'),
            models.Index(fields=['faculty', 'is_active'], name='contract_faculty_active_idx'),
        ]
