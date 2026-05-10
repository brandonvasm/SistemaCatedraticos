import django.db.models.deletion
from django.db import migrations, models


def migrate_cost_center_to_m2m(apps, schema_editor):
    Course = apps.get_model("academics", "Course")
    for course in Course.objects.select_related("cost_center").filter(cost_center__isnull=False):
        course.careers.add(course.cost_center)


class Migration(migrations.Migration):

    dependencies = [
        ("academics", "0016_alter_faculty_name"),
    ]

    operations = [
        # 1. Add M2M while cost_center still exists
        migrations.AddField(
            model_name="course",
            name="careers",
            field=models.ManyToManyField(blank=True, to="academics.career"),
        ),
        # 2. Add career FK on CourseSection (nullable)
        migrations.AddField(
            model_name="coursesection",
            name="career",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="academics.career",
            ),
        ),
        # 3. Copy cost_center → careers M2M
        migrations.RunPython(
            migrate_cost_center_to_m2m,
            reverse_code=migrations.RunPython.noop,
        ),
        # 4. Remove cost_center FK
        migrations.RemoveField(
            model_name="course",
            name="cost_center",
        ),
    ]
