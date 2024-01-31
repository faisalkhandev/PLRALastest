# Generated by Django 5.0 on 2023-12-29 05:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('competent_authority', '0004_alter_competentauthority_designation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='competentauthority',
            name='designation',
            field=models.CharField(choices=[('DG', 'DG'), ('HR ADMIN', 'HR ADMIN'), ('LEAVE SUPER APPROVAL', 'LEAVE SUPER APPROVAL')], default='ADG ADMIN', max_length=30),
        ),
    ]
