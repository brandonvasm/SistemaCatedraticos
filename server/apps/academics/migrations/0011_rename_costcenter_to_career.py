from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('academics', '0010_coursesection_control_score_semester_roster_loaded'),
    ]

    operations = [
        migrations.RenameModel('CostCenter', 'Career'),
        migrations.AddField(
            model_name='career',
            name='code',
            field=models.CharField(blank=True, default='', max_length=20),
        ),
        migrations.AddField(
            model_name='career',
            name='abbreviation',
            field=models.CharField(blank=True, default='', max_length=20),
        ),
        migrations.AddField(
            model_name='career',
            name='pensum_loaded',
            field=models.BooleanField(default=False),
        ),
        migrations.RemoveField(
            model_name='faculty',
            name='pensum_loaded',
        ),
    ]
