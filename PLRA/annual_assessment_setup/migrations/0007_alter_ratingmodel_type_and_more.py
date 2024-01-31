# Generated by Django 5.0 on 2023-12-29 05:57

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HR_Setups', '0001_initial'),
        ('annual_assessment_setup', '0006_aarcompetentauthorityapproval_status'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='ratingmodel',
            name='type',
            field=models.CharField(choices=[('Points', 'Points'), ('Likert Scale', 'Likert Scale')], default=1, max_length=50),
            preserve_default=False,
        ),
        migrations.RenameField(
            model_name='aarcounterassigningofficerapproval',
            old_name='pen_picture_countersigning_officer',
            new_name='compentent_authority_remarks',
        ),
        migrations.RemoveField(
            model_name='aarcounterassigningofficerapproval',
            name='honest',
        ),
        migrations.RemoveField(
            model_name='aarcounterassigningofficerapproval',
            name='reported_as_corrupt',
        ),
        migrations.RemoveField(
            model_name='aarcounterassigningofficerapproval',
            name='service_level',
        ),
        migrations.RemoveField(
            model_name='aarcounterassigningofficerapproval',
            name='useful',
        ),
        migrations.RemoveField(
            model_name='aarcounterassigningofficerapproval',
            name='visible',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='area_and_level_of_expertise',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='compentent_authority_remarks',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='fitness_for_retention',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='frequency_of_work',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='integrity_general',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='integrity_intellectual',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='know_the_officer',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='officer_performance',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='output_of_work',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='overall_grading',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='pen_picture_reporting_officer',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='quality_of_assessment',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='quality_of_work',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='recommendation_for_retention',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='refer_to_compentent_authority',
        ),
        migrations.RemoveField(
            model_name='aarprocessho',
            name='training_and_development_need',
        ),
        migrations.AlterUniqueTogether(
            name='ratingmodel',
            unique_together={('year', 'type')},
        ),
        migrations.RemoveField(
            model_name='ratingmodelassignment',
            name='job',
        ),
        migrations.AddField(
            model_name='aarcounterassigningofficerapproval',
            name='frequency_of_work',
            field=models.CharField(blank=True, choices=[('very frequently', 'Very Frequently'), ('frequently', 'Frequently'), ('rarely', 'Rarely'), ('never', 'Never')], max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='aarcounterassigningofficerapproval',
            name='know_the_officer',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='aarcounterassigningofficerapproval',
            name='quality_of_assessment',
            field=models.CharField(blank=True, choices=[('exaggerated', 'Exaggerated'), ('fair', 'Fair'), ('biased', 'Biased')], max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='aarcounterassigningofficerapproval',
            name='recommendation_for_retention',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='aarcounterassigningofficerapproval',
            name='refer_to_compentent_authority',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AlterField(
            model_name='ratingtypelikertscale',
            name='rating_model',
            field=models.ForeignKey(blank=True, limit_choices_to={'type': 'Likert Scale'}, null=True, on_delete=django.db.models.deletion.PROTECT, to='annual_assessment_setup.ratingmodel'),
        ),
        migrations.AlterField(
            model_name='ratingtypepoints',
            name='rating_model',
            field=models.ForeignKey(blank=True, limit_choices_to={'type': 'Points'}, null=True, on_delete=django.db.models.deletion.PROTECT, to='annual_assessment_setup.ratingmodel'),
        ),
        migrations.CreateModel(
            name='AARHOReportingOfficerApproval',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visible', models.BooleanField(default=False)),
                ('officer_performance', models.TextField(blank=True, null=True)),
                ('quality_of_work', models.CharField(blank=True, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')], max_length=1, null=True)),
                ('output_of_work', models.CharField(blank=True, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')], max_length=1, null=True)),
                ('integrity_general', models.CharField(blank=True, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')], max_length=1, null=True)),
                ('integrity_intellectual', models.CharField(blank=True, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')], max_length=1, null=True)),
                ('pen_picture_reporting_officer', models.TextField(blank=True, null=True)),
                ('area_and_level_of_expertise', models.TextField(blank=True, null=True)),
                ('training_and_development_need', models.BooleanField(blank=True, default=False, null=True)),
                ('overall_grading', models.CharField(blank=True, choices=[('very good', 'Very Good'), ('good', 'Good'), ('average', 'Average'), ('below average', 'Below Average')], max_length=15, null=True)),
                ('fitness_for_retention', models.TextField(blank=True, null=True)),
                ('status', models.CharField(choices=[('In Process', 'In Process'), ('Approved', 'Approved')], default='In Process', max_length=20)),
                ('aar_process', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='annual_assessment_setup.aarprocess')),
                ('reporting_officer', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='AARHOReportingOfficerApproval', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.DeleteModel(
            name='RatingModelType',
        ),
        migrations.RemoveField(
            model_name='ratingmodel',
            name='reporting_officer',
        ),
    ]
