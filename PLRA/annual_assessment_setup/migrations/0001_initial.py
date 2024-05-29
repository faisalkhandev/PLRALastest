# Generated by Django 5.0 on 2024-05-20 05:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AARCompetentAuthorityApproval',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visible', models.BooleanField(default=False)),
                ('compentent_authority_remarks', models.TextField(blank=True, null=True)),
                ('status', models.CharField(choices=[('In Process', 'In Process'), ('Approved', 'Approved')], default='In Process', max_length=36)),
            ],
        ),
        migrations.CreateModel(
            name='AARCounterAssigningOfficerApproval',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('honest', models.BooleanField(blank=True, null=True)),
                ('visible', models.BooleanField(default=False)),
                ('reported_as_corrupt', models.BooleanField(blank=True, null=True)),
                ('service_level', models.CharField(blank=True, choices=[('Very Good', 'Very Good'), ('Good', 'Good'), ('Average', 'Average'), ('Below Average', 'Below Average')], max_length=50, null=True)),
                ('pen_picture_countersigning_officer', models.TextField(blank=True, null=True)),
                ('useful', models.BooleanField(blank=True, null=True)),
                ('status', models.CharField(choices=[('In Process', 'In Process'), ('Refer to Competent Authority', 'Refer to Competent Authority'), ('Approved', 'Approved')], default='In Process', max_length=36)),
            ],
        ),
        migrations.CreateModel(
            name='AARHOCounterAssigningOfficerApproval',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visible', models.BooleanField(default=False)),
                ('frequency_of_work', models.CharField(blank=True, choices=[('very frequently', 'Very Frequently'), ('frequently', 'Frequently'), ('rarely', 'Rarely'), ('never', 'Never')], max_length=20, null=True)),
                ('know_the_officer', models.TextField(blank=True, null=True)),
                ('recommendation_for_retention', models.TextField(blank=True, null=True)),
                ('quality_of_assessment', models.CharField(blank=True, choices=[('exaggerated', 'Exaggerated'), ('fair', 'Fair'), ('biased', 'Biased')], max_length=50, null=True)),
                ('status', models.CharField(choices=[('In Process', 'In Process'), ('Refer to Competent Authority', 'Refer to Competent Authority'), ('Approved', 'Approved')], default='In Process', max_length=36)),
            ],
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
            ],
        ),
        migrations.CreateModel(
            name='AARprescribedForm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('head_office', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='AARProcess',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('aar_apply_Date', models.DateField(auto_now=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('is_head_office', models.BooleanField(default=False)),
                ('attachments', models.ImageField(blank=True, null=True, upload_to='media/aar_process')),
                ('job_description', models.TextField(blank=True, null=True)),
                ('brief_achievements', models.TextField(blank=True, null=True)),
                ('status', models.CharField(choices=[('In process', 'In Process'), ('Completed', 'Completed')], default='In process', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='AARReportingOfficerApproval',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visible', models.BooleanField(default=False)),
                ('status', models.CharField(choices=[('In Process', 'In Process'), ('Approved', 'Approved')], default='In Process', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='RatingModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField()),
                ('active', models.BooleanField(default=True)),
                ('type', models.CharField(choices=[('Points', 'Points'), ('Likert Scale', 'Likert Scale')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='RatingTypeLikertScale',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('percentile_range', models.CharField(max_length=50)),
                ('grade', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='RatingTypePoints',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=70)),
                ('max_points', models.IntegerField()),
                ('type', models.CharField(choices=[('system generated', 'system generated'), ('reporting officer', 'reporting officer'), ('counter signing officer', 'counter signing officer')], max_length=50)),
                ('api', models.BooleanField(blank=True, default=False, null=True)),
                ('api_address', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='RatingTypePointsAssignment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=50)),
                ('max_points', models.IntegerField()),
                ('system_generated_points', models.IntegerField(blank=True, null=True)),
                ('point_earned', models.IntegerField(blank=True, null=True)),
            ],
        ),
    ]
