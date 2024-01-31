# Generated by Django 4.2.3 on 2023-11-16 07:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('employee_basic_information', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='LeaveApply',
            fields=[
                ('leave_request_id', models.AutoField(primary_key=True, serialize=False)),
                ('hr_year_id', models.IntegerField(blank=True, null=True)),
                ('apply_date', models.DateField(auto_now_add=True)),
                ('from_date', models.DateField()),
                ('to_date', models.DateField(blank=True, null=True)),
                ('days_count', models.IntegerField(blank=True)),
                ('status', models.CharField(choices=[('In Process', 'In Process'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='In Process', max_length=20)),
                ('approved_date', models.DateField(blank=True, null=True)),
                ('report_back_date', models.DateField(blank=True, null=True)),
                ('notes', models.TextField()),
                ('attachment', models.FileField(blank=True, null=True, upload_to='leave_attachments/')),
                ('employee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='LeaveType',
            fields=[
                ('leave_id', models.AutoField(primary_key=True, serialize=False)),
                ('leave_type', models.CharField(max_length=50)),
                ('leave_description', models.CharField(max_length=255)),
                ('visible_at_leave_apply_time', models.BooleanField()),
                ('gender_eligibility', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('All', 'All')], max_length=20)),
                ('accrue', models.BooleanField()),
                ('prorate_calculation', models.BooleanField(blank=True, null=True)),
                ('accrue_annual_limit', models.DecimalField(blank=True, decimal_places=0, max_digits=5, null=True)),
                ('accrue_per_month', models.DecimalField(blank=True, decimal_places=0, max_digits=5, null=True)),
                ('add_in_first_hr_month', models.IntegerField(blank=True, null=True)),
                ('balance_paid_annually', models.BooleanField(blank=True, null=True)),
                ('earning_code', models.CharField(blank=True, max_length=50, null=True)),
                ('entire_service_validity', models.BooleanField()),
                ('avail_number_of_times', models.IntegerField(blank=True, null=True)),
                ('one_time_avail_limit', models.IntegerField(blank=True, null=True)),
                ('entire_service_limit', models.IntegerField(blank=True, null=True)),
                ('leave_dependency', models.BooleanField()),
                ('salary_deduction_eligibility_rule', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='LeaveNonDependableDetail',
            fields=[
                ('l_n_d_rec_id', models.AutoField(primary_key=True, serialize=False)),
                ('hr_year_id', models.IntegerField()),
                ('apply_date', models.DateField()),
                ('leave_from_date', models.DateField()),
                ('leave_to_date', models.DateField()),
                ('status', models.CharField(max_length=20)),
                ('leave_type_allowed', models.IntegerField(blank=True, null=True)),
                ('leave_type_used', models.IntegerField(blank=True, null=True)),
                ('leave_type_remaning', models.IntegerField(blank=True, null=True)),
                ('employee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('leave_request', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='leave_setup.leaveapply')),
                ('leave_type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='leave_non_dependable_headers', to='leave_setup.leavetype')),
            ],
        ),
        migrations.CreateModel(
            name='LeaveDependableDetail',
            fields=[
                ('l_d_d_rec_id', models.AutoField(primary_key=True, serialize=False)),
                ('hr_year_id', models.IntegerField()),
                ('apply_date', models.DateField()),
                ('leave_date', models.DateField()),
                ('status', models.CharField(max_length=20)),
                ('attendance_validation', models.BooleanField(default=False)),
                ('employee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('leave_deduction_bucket', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='leave_dependable_deduction_headers', to='leave_setup.leavetype')),
                ('leave_request', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='leave_setup.leaveapply')),
                ('leave_type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='leave_dependable_headers', to='leave_setup.leavetype')),
            ],
        ),
        migrations.CreateModel(
            name='LeaveDependableBucket',
            fields=[
                ('l_d_b_rec_id', models.AutoField(primary_key=True, serialize=False)),
                ('leave_deduction_bucket_allowed', models.IntegerField(blank=True, default=0, null=True)),
                ('leave_deduction_used', models.IntegerField(blank=True, default=0, null=True)),
                ('leave_type_used', models.IntegerField(blank=True, default=0, null=True)),
                ('leave_deduction_running_balance', models.IntegerField(blank=True, default=0, null=True)),
                ('leave_date', models.DateField(blank=True, null=True)),
                ('LeaveDependableDetail', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='leave_setup.leavedependabledetail')),
                ('employee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('leave_deduction_bucket', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='leave_dependable_deduction_headers_bucket', to='leave_setup.leavetype')),
                ('leave_type', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='leave_dependable_headers_bucket', to='leave_setup.leavetype')),
            ],
        ),
        migrations.AddField(
            model_name='leaveapply',
            name='leave_deduction_bucket_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='leave_apply_deduction_headers', to='leave_setup.leavetype'),
        ),
        migrations.AddField(
            model_name='leaveapply',
            name='leave_type',
            field=models.ForeignKey(limit_choices_to={'visible_at_leave_apply_time': True}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='leave_apply_type_headers', to='leave_setup.leavetype'),
        ),
        migrations.CreateModel(
            name='AccrueTable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('month', models.DateField()),
                ('hr_year', models.IntegerField()),
                ('accrued_leaves', models.IntegerField()),
                ('employee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('leave_bucket', models.ForeignKey(limit_choices_to={'visible_at_leave_apply_time': True}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='leave_apply_type_headers_accrue', to='leave_setup.leavetype')),
            ],
        ),
        migrations.CreateModel(
            name='SalaryDeductible',
            fields=[
                ('s_rec_id', models.AutoField(primary_key=True, serialize=False)),
                ('leave_type', models.ForeignKey(limit_choices_to={'salary_deduction_eligibility_rule': True}, on_delete=django.db.models.deletion.PROTECT, related_name='salary_deductible_leave_types', to='leave_setup.leavetype')),
                ('ppg_level', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='employee_basic_information.ppg_level_setup')),
            ],
            options={
                'unique_together': {('leave_type', 'ppg_level')},
            },
        ),
        migrations.CreateModel(
            name='LeaveDependency',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('priority', models.IntegerField(default=1)),
                ('depends_upon', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='dependency_of_leaves', to='leave_setup.leavetype')),
                ('leave_with_adjustable', models.ForeignKey(limit_choices_to={'leave_dependency': True}, on_delete=django.db.models.deletion.PROTECT, related_name='dependent_leaves', to='leave_setup.leavetype')),
            ],
            options={
                'unique_together': {('leave_with_adjustable', 'depends_upon')},
            },
        ),
    ]
