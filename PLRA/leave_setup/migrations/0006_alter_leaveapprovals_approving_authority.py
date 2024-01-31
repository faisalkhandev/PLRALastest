# Generated by Django 5.0 on 2023-12-29 05:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leave_setup', '0005_alter_leavecount_max_count_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='leaveapprovals',
            name='approving_authority',
            field=models.CharField(choices=[('REPORTING OFFICER', 'REPORTING OFFICER'), ('DIRECTOR CONCERN', 'DIRECTOR CONCERN'), ('ADG ADMIN', 'ADG ADMIN'), ('DG', 'DG')], default='ADG ADMIN', max_length=20),
        ),
    ]
