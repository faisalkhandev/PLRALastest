# Generated by Django 4.2.1 on 2023-11-22 07:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('employee_basic_information', '0004_alter_job_job_id'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='employee',
            options={'verbose_name': 'Employee', 'verbose_name_plural': 'Employees'},
        ),
    ]
