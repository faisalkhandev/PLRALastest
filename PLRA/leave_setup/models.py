from django.db import models
from django.core.exceptions import ValidationError
from datetime import timedelta
from employee_basic_information.models import *
from competent_authority.models import *
from employee_master_data.models import PersonalInformation
from datetime import datetime, timedelta
from django.utils import timezone
from HR_Setups.models import HRCelanderYear
# Create your models here.
class LeaveType(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('All', 'All'),
    ]
    leave_id = models.AutoField(primary_key=True)
    leave_type = models.CharField(max_length=50)
    leave_description = models.CharField(max_length=255)
    visible_at_leave_apply_time = models.BooleanField()
    gender_eligibility = models.CharField(max_length=20, choices=GENDER_CHOICES)
    accrue = models.BooleanField()
    prorate_calculation = models.BooleanField(null=True, blank=True)
    accrue_annual_limit = models.DecimalField(max_digits=5, decimal_places=0, null=True, blank=True)
    accrue_per_month = models.DecimalField(max_digits=5, decimal_places=0, null=True, blank=True)
    add_in_first_hr_month = models.IntegerField(blank=True, null=True)
    balance_paid_annually = models.BooleanField(null=True, blank=True)
    earning_code = models.CharField(max_length=50, null=True, blank=True)
    entire_service_validity = models.BooleanField()
    avail_number_of_times = models.IntegerField(null=True, blank=True)
    one_time_avail_limit = models.IntegerField(null=True, blank=True)
    # auto based on one_time_avail_limit*avail_number_of_times
    entire_service_limit = models.IntegerField(null=True, blank=True)
    leave_dependency = models.BooleanField()
    salary_deduction_eligibility_rule = models.BooleanField()
    #  make a logic based on accrue_annual_limit with reminder
    def save(self, *args, **kwargs):
        if self.entire_service_validity:
            self.entire_service_limit = self.one_time_avail_limit * self.avail_number_of_times
        if self.accrue and self.accrue_annual_limit is not None:
            # Calculate the integer part and remainder part of accrue_per_month
            integer_part = int(self.accrue_annual_limit / 12)
            remainder = self.accrue_annual_limit % 12
            # Update the fields accordingly
            self.add_in_first_hr_month = remainder
            self.accrue_per_month = integer_part
            # Save the LeaveType instance to update accrue fields
        super(LeaveType, self).save(*args, **kwargs)
           
    def __str__(self):
        return self.leave_type
class LeaveDependency(models.Model):
    leave_with_adjustable = models.ForeignKey(
        LeaveType,
        on_delete=models.PROTECT,
        related_name='dependent_leaves',
        limit_choices_to={'leave_dependency': True},
    )
    depends_upon = models.ForeignKey(
        LeaveType,
        on_delete=models.PROTECT,
        related_name='dependency_of_leaves',
    )
    priority = models.IntegerField(default=1)
    def clean(self, *args, **kwargs):
        # Check if the combination of leave_with_adjustable and depends_upon already exists
        existing_dependency = LeaveDependency.objects.filter(
            leave_with_adjustable=self.leave_with_adjustable,
            depends_upon=self.depends_upon,
        ).exists()
        if existing_dependency:
            raise ValidationError("This combination already exists in the leave dependency table.")
        existing_p = LeaveDependency.objects.filter(
            priority=self.priority
        ).exists()
        existing_a = LeaveDependency.objects.filter(
            leave_with_adjustable=self.leave_with_adjustable,
        ).exists()
        if existing_p and existing_a:
            raise ValidationError(f"This {self.priority} already exists in the leave dependency table.")
        super().save(*args, **kwargs)
    class Meta:
        unique_together = ('leave_with_adjustable', 'depends_upon')
    def __str__(self):
        return f"Leave With Adjustable: {self.leave_with_adjustable.leave_description} -> Depends Upon: {self.depends_upon.leave_description}"
class SalaryDeductible(models.Model):
    s_rec_id = models.AutoField(primary_key=True)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.PROTECT, related_name='salary_deductible_leave_types',
                                   limit_choices_to={'salary_deduction_eligibility_rule': True}, )
    ppg_level = models.ForeignKey(Ppg_Level_Setup, on_delete=models.PROTECT)
    def __str__(self):
        return str(self.leave_type)
    class Meta:
        unique_together = ('leave_type', 'ppg_level')

class LeaveCount(models.Model):
    min_count = models.PositiveSmallIntegerField(unique=True)
    max_count = models.PositiveSmallIntegerField(unique=True)
    total_approvals_days = models.PositiveSmallIntegerField(default=1)

    def __str__(self):
        return f"leave lie between {self.min_count} and {self.max_count}"

    def clean(self):
        super(LeaveCount, self).clean()
        if LeaveCount.objects.exclude(pk=self.pk).filter(
            models.Q(min_count__lte=self.min_count, max_count__gte=self.min_count) |
            models.Q(min_count__lte=self.max_count, max_count__gte=self.max_count)
        ).exists():
            raise ValidationError("This combination already exists in the leave count table.")
    
    
class LeaveApprovals(models.Model):
    leave_count=models.ForeignKey(LeaveCount, on_delete=models.PROTECT)   
    approving_authority = models.CharField(
        max_length=20,
        choices=[
            ('REPORTING OFFICER', 'REPORTING OFFICER'),
            ('DIRECTOR CONCERN', 'DIRECTOR CONCERN'),
            ('ADG ADMIN', 'ADG ADMIN'),
            ('DG', 'DG'),
        ],
        default='ADG ADMIN',
    )
    order=models.PositiveSmallIntegerField()
    approving_time=models.PositiveIntegerField()
    def __str__(self):
        return f"{self.leave_count} approved by {self.approving_authority} in order {self.order} and in {self.approving_time} days"
    
class Approvals(models.Model):
    leave=models.ForeignKey('LeaveApply', on_delete=models.PROTECT)
    approving_authority=models.ForeignKey(Employee, on_delete=models.PROTECT)
    leave_approval=models.ForeignKey(LeaveApprovals,  on_delete=models.PROTECT)
    status_date=models.DateField(blank=True,null=True)
    order=models.PositiveSmallIntegerField()
    system_approval=models.BooleanField(default=False)
    visible=models.BooleanField(default=False)
    status=models.CharField( max_length=50,
        choices=[
            ('Pending', 'Pending'),
            ('Approved', 'Approved'),
            ('Rejected', 'Rejected'),
        ],default='Pending')
    comments=models.TextField(blank=True,null=True)
    def __str__(self):
        return f"{self.leave} approved by {self.approving_authority} in order {self.order} and in {self.leave_approval.approving_time} days"
    def save(self,*args, **kwargs):
        try:
            if self.status=='Approved':
                self.visible=False
                self.status_date=datetime.now().date()
                self.system_approval=False
                next_approval=Approvals.objects.filter(leave=self.leave, order__gt=self.order).first()
                if next_approval:
                    next_approval.visible=True
                    next_approval.save()
                else:
                    related_leave=LeaveApply.objects.get(leave_request_id=self.leave.leave_request_id)
                    related_leave.status='Approved'
                    related_leave.save()
                    realedted_super_approval=SuperApprovals.objects.filter(leave=self.leave).first()
                    if realedted_super_approval:
                        realedted_super_approval.visible=False
                        realedted_super_approval.save()
            if self.status=='Rejected':
                self.visible=False
                self.status_date=datetime.now().date()
                self.system_approval=False
                realedted_super_approval=SuperApprovals.objects.get(leave=self.leave)
                realedted_super_approval.visible=False
                realedted_super_approval.save()
                related_leave=LeaveApply.objects.get(leave_request_id=self.leave.leave_request_id)
                related_leave.status='Rejected'
                related_leave.save()
                
                   
        except Approvals.DoesNotExist:
            pass
        super(Approvals, self).save(*args, **kwargs)
        
class SuperApprovals(models.Model):
    leave=models.ForeignKey('LeaveApply', on_delete=models.PROTECT)
    approving_authority=models.ForeignKey(Employee, on_delete=models.PROTECT)
    position_start_date=models.DateField(blank=True,null=True)
    position_end_date=models.DateField(blank=True,null=True)
    status_date=models.DateField(blank=True,null=True)
    status=models.CharField( max_length=50,
        choices=[
            ('Pending', 'Pending'),
            ('Approved', 'Approved'),
            ('Rejected', 'Rejected'),
        ],default='Pending')
    additional_position_assignment= models.ForeignKey(Employee, related_name='additional_position_assignment', on_delete=models.PROTECT,blank=True,null=True)
    comments=models.TextField(blank=True,null=True)
    
    visible=models.BooleanField(default=True)
    def __str__(self):
        return f"{self.leave} approved by {self.approving_authority} status {self.status}"
    def save(self,*args, **kwargs):
        try:
            if self.status=='Approved':
                self.visible=False
                self.status_date=datetime.now().date()
                related_leave=LeaveApply.objects.get(leave_request_id=self.leave.leave_request_id)
                related_leave.status='Approved'
                related_leave.save()
                res=PositionAssignment.objects.filter(employee=self.additional_position_assignment,position=self.leave.employee.position)
                if not res:
                    PositionAssignment.objects.create(employee=self.additional_position_assignment,position=self.leave.employee.position,assignment_start=self.position_start_date,assignment_end=self.position_end_date,primary_position=False,active=True)
                related_approvals_list=Approvals.objects.filter(leave=self.leave.leave_request_id)
                for approval in related_approvals_list:
                    approval.visible=False
                    approval.system_approval=False
                    approval.save()
            elif self.status=='Rejected':
                self.visible=False
                self.status_date=datetime.now().date()
                related_leave=LeaveApply.objects.get(leave_request_id=self.leave.leave_request_id)
                related_leave.status='Rejected'
                related_leave.save()
                related_approvals_list=Approvals.objects.filter(leave=self.leave.leave_request_id)
                for approval in related_approvals_list:
                    approval.visible=False
                    approval.system_approval=False
                    approval.save()
      
                
            
        except Approvals.DoesNotExist:
            pass
        super(SuperApprovals, self).save(*args, **kwargs)
    
    
    
    
class LeaveApply(models.Model):
    STATUS_CHOICES = [
        ("In Process", "In Process"),
        ("Approved", "Approved"),
        ("Withdraw", "Withdraw"),
        ("Rejected", "Rejected"),
    ]
    leave_request_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
    hr_year_id = models.IntegerField(blank=True,null=True)
    apply_date = models.DateTimeField(auto_now_add=True)  # Automatically set apply_date to the date and time of instance creation
    leave_type = models.ForeignKey(
        LeaveType,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'visible_at_leave_apply_time': True},
        related_name="leave_apply_type_headers"
    )
    # Change related_name and remove null=True from leave_deduction_bucket_id
    leave_deduction_bucket_id = models.ForeignKey(
        LeaveType,
        on_delete=models.SET_NULL,  # Change this to on_delete=models.PROTECT
        related_name="leave_apply_deduction_headers",
        null=True,
        blank=True
    )
    from_date = models.DateField()
    to_date = models.DateField(blank=True, null=True)
    days_count = models.IntegerField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="In Process")
    approved_date = models.DateField(blank=True, null=True)
    report_back_date = models.DateField(blank=True, null=True)
    notes = models.TextField()
    attachment = models.FileField(upload_to='leave_attachments/', null=True, blank=True)
    def save(self, *args, **kwargs):
        if self.pk and self.status=="Withdraw":
            existing_Approvals=Approvals.objects.filter(leave=self)
            existing_Approvals_super=SuperApprovals.objects.filter(leave=self).first()
            existing_Approvals_super.visible=False
            existing_Approvals_super.save()
            self.handle_existing_approvals()
            for approval in existing_Approvals:
                approval.visible=False
                approval.system_approval=False
                approval.save()
            super(LeaveApply, self).save(*args, **kwargs)
        
        
        elif not  self.pk and self.status=="In Process":
            self.set_hr_year_id()
            self.set_leave_dates()
            self.set_leave_deduction_bucket_id()
            super(LeaveApply, self).save(*args, **kwargs)
            self.handle_existing_approvals()
            self.handle_new_approvals()
            self.handle_super_approvals()
            self.handle_approved_status()
            super(LeaveApply, self).save(*args, **kwargs)
        elif self.pk and self.status=="In Process":
            self.set_hr_year_id()
            self.set_leave_dates()
            self.handle_existing_approvals()
            self.handle_new_approvals()
            self.handle_super_approvals()
            self.handle_approved_status()
            super(LeaveApply, self).save(*args, **kwargs)
        elif self.pk and self.status in ["Rejected", "Approved"]:
            self.handle_approved_status()
            super(LeaveApply, self).save(*args, **kwargs)
            
    def handle_super_approvals(self):
        if not SuperApprovals.objects.filter(leave=self).exists():
            super_approving_authority_position=CompetentAuthority.objects.filter(designation='LEAVE SUPER APPROVAL').first()
            if super_approving_authority_position:
                super_approving_authority=Employee.objects.filter(position=super_approving_authority_position.employee_position).first()
                if super_approving_authority:
                    print(super_approving_authority)
                    SuperApprovals.objects.create(leave=self,approving_authority=super_approving_authority,visible=True,position_start_date=self.from_date,position_end_date=self.to_date)  
    def set_hr_year_id(self):
        try:
            hryear=HRCelanderYear.objects.get(active=True)
            self.hr_year_id=hryear.hr_year
        except HRCelanderYear.DoesNotExist:
            pass  # Handle the case when HRCelanderYear record is not found
        
    def handle_existing_approvals(self):
        if self.pk and self.status=="In Process":
            exsisting_object=LeaveApply.objects.get(leave_request_id=self.pk)
            count=(self.to_date - self.from_date).days + 1
            if self.days_count!=count:
                exsisting_Approvals=Approvals.objects.filter(leave=self)
                for approval in exsisting_Approvals:
                    approval.delete()
                    
       
        
    def handle_new_approvals(self):
        count=(self.to_date - self.from_date).days + 1
        try:
            leave_count_record = LeaveCount.objects.get(min_count__lte=count, max_count__gte=count)
            list_of_approvals = LeaveApprovals.objects.filter(leave_count=leave_count_record).order_by("order")
        except LeaveCount.DoesNotExist:
            # Handle the case when no LeaveCount record is found for the given count
            list_of_approvals = []
        res=Approvals.objects.filter(leave=self.leave_request_id).exists()
        if res:
            re_start_approvals=Approvals.objects.filter(leave=self.leave_request_id)
            for approval in re_start_approvals:
                approval.delete()
            for approval in list_of_approvals:
                self.create_approval(approval,leave_count_record)
            
        if not res:
            for approval in list_of_approvals:
                self.create_approval(approval,leave_count_record)
                
    def create_approval(self, approval,leave_count_record):
        try:
            related_approving_authority=None
            if approval.approving_authority=='REPORTING OFFICER':
                related_approving_authority=self.employee.reporting_officer
                # print(f" REPORTING OFFICER {related_approving_authority}")
            elif approval.approving_authority=='DIRECTOR CONCERN':
                employee_wing=self.employee.position.wing
                director_concern_position=employee_wing.director_concern_position
                related_approving_authority=Employee.objects.filter(position=director_concern_position).first()                
            elif approval.approving_authority=='ADG ADMIN':
                employee_wing=self.employee.position.wing
                adg_position=employee_wing.adg
                related_approving_authority=Employee.objects.filter(position=adg_position).first()
                # print("f ADG ADMIN{related_approving_authority}")
                
            elif approval.approving_authority=='DG':
                dg_position=CompetentAuthority.objects.filter(designation='DG').first()
                related_approving_authority=Employee.objects.filter(position=dg_position.employee_position).first()
                print(f" dg{related_approving_authority}")

            if related_approving_authority:
                today_date = datetime.now().date()
                result = (self.from_date-today_date).days-1
                related_approval_list=LeaveApprovals.objects.filter(leave_count=leave_count_record)
                total_approvals_days=0
                for rp in related_approval_list:
                    total_approvals_days=total_approvals_days+rp.approving_time
                
                if related_approving_authority is not None:
                    Approvals.objects.create(
                        leave=self,
                        approving_authority=related_approving_authority,
                        visible=True if approval.order==1 else False,
                        leave_approval=approval,
                        order=approval.order,
                        system_approval=True if result >=total_approvals_days else False
                    ).save()
        except Exception as e:
            pass  # Handle any exception that occurs during approval creation
            
    def set_leave_dates(self):
        if self.leave_type.leave_type in ['Paternity', 'Maternity', 'Iddat']:
            try:
                availlimit = self.leave_type.one_time_avail_limit
                availlimit_timedelta = timedelta(days=availlimit)
                self.to_date = self.from_date + availlimit_timedelta - timedelta(days=1)
            except AttributeError:
                pass  # Handle the case when attribute error occurs
        if self.from_date and self.to_date:
            self.days_count = (self.to_date - self.from_date).days + 1
        else:
            self.days_count = 0  # Handle the case when either from_date or to_date is missing
            
    def set_leave_deduction_bucket_id(self):
        if self.leave_type:
            try:
                dependency = LeaveDependency.objects.get(leave_with_adjustable=self.leave_type)
                self.leave_deduction_bucket_id = dependency.depends_upon
            except LeaveDependency.DoesNotExist:
                pass  # No matching LeaveDependency, leave_deduction_bucket remains as-is
                
    def handle_approved_status(self):
        if self.status == "Approved":
            self.approved_date = datetime.now()
            if self.leave_type.leave_dependency and self.leave_deduction_bucket_id and self.leave_type.visible_at_leave_apply_time:
                self.create_leave_dependable_details()
            elif self.leave_type.entire_service_validity and self.leave_type.visible_at_leave_apply_time:
                self.create_leave_non_dependable_details()
                
    def create_leave_dependable_details(self):
        current_date = self.from_date
        while current_date <= self.to_date:
            try:
                LeaveDependableDetail.objects.create(
                    leave_request=self,
                    employee=self.employee,
                    hr_year_id=self.hr_year_id,
                    apply_date=self.apply_date,
                    leave_type=self.leave_type,
                    leave_deduction_bucket=self.leave_deduction_bucket_id,
                    leave_date=current_date,
                    status=self.status,
                    attendance_validation=False
                    # ... (other fields)
                )
            except Exception as e:
                pass  # Handle any exception that occurs during LeaveDependableDetail creation
            current_date += timedelta(days=1)
            
    def create_leave_non_dependable_details(self):
        prevleavenondep = LeaveNonDependableDetail.objects.filter(employee=self.employee,
                                                                  leave_type=self.leave_type).order_by(
            'leave_to_date').first()
        try:
            LeaveNonDependableDetail.objects.create(
                leave_request=self,
                employee=self.employee,
                hr_year_id=self.hr_year_id,
                apply_date=self.apply_date,
                leave_type=self.leave_type,
                leave_from_date=self.from_date,
                leave_to_date=self.to_date,
                status=self.status,
                leave_type_allowed=self.leave_type.avail_number_of_times,
                leave_type_used=prevleavenondep.leave_type_remaning + 1 if prevleavenondep else 1,
                leave_type_remaning=self.leave_type.avail_number_of_times - (
                    prevleavenondep.leave_type_remaning + 1 if prevleavenondep else 1),
            )
        except Exception as e:
            pass  # Handle any exception that occurs during LeaveNonDependableDetail creation
                
    def __str__(self):
        return f"Leave Request #{self.leave_request_id} {self.leave_type}- {self.employee} ({self.status})"





class LeaveDependableDetail(models.Model):
    l_d_d_rec_id = models.AutoField(primary_key=True)
    leave_request = models.ForeignKey(LeaveApply, on_delete=models.PROTECT)
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
    hr_year_id = models.IntegerField()
    apply_date = models.DateField()
    leave_type = models.ForeignKey(
        LeaveType,
        null=True,
        on_delete=models.SET_NULL,
        related_name="leave_dependable_headers"
    )
    leave_deduction_bucket = models.ForeignKey(
        LeaveType,
        null=True,
        on_delete=models.SET_NULL,  # Change this to on_delete=models.PROTECT
        related_name="leave_dependable_deduction_headers"
    )
    leave_date = models.DateField()
    status = models.CharField(max_length=20)
    attendance_validation = models.BooleanField(default=False)
    def save(self, *args, **kwargs):
        leave_deduction_bucket_allowed = None
        leave_deduction_used = None
        leave_type_used = None
        leave_deduction_running_balance = None
        accrue_record = AccrueTable.objects.filter(
            employee=self.employee,
            leave_bucket=self.leave_deduction_bucket
        ).order_by('-month').first()
        if accrue_record:
            leave_deduction_bucket_allowed = accrue_record.accrued_leaves
        now = timezone.now()
        # Get the last record or the record closest to the current datetime
        closest_record = LeaveDependableBucket.objects.filter(
            employee=self.employee,
            leave_type=self.leave_type,
            leave_deduction_bucket=self.leave_deduction_bucket
        ).order_by('-leave_date').first()
        if closest_record:
            leave_deduction_used = closest_record.leave_deduction_used + 1
            leave_type_used = closest_record.leave_type_used + 1
        else:
            leave_deduction_used = 1
            leave_type_used = 1
        if leave_deduction_bucket_allowed is not None and leave_deduction_used is not None:
            leave_deduction_running_balance = leave_deduction_bucket_allowed - leave_deduction_used
            if leave_deduction_running_balance is None:
                leave_deduction_running_balance = 0
        # If attendance_validation is True, insert new records in LeaveDependableBucket
        if self.attendance_validation:
            LeaveDependableBucket.objects.create(
                LeaveDependableDetail=self,
                leave_deduction_bucket_allowed=leave_deduction_bucket_allowed,
                leave_deduction_used=leave_deduction_used,
                leave_type_used=leave_type_used,
                leave_deduction_running_balance=leave_deduction_running_balance,
                leave_date=self.leave_date,
                employee=self.employee,
                leave_type=self.leave_type,
                leave_deduction_bucket=self.leave_deduction_bucket
            )
        super(LeaveDependableDetail, self).save(*args, **kwargs)
    def __str__(self):
        return f"{self.employee} - {self.leave_type} - {self.leave_date} "
class LeaveDependableBucket(models.Model):
    l_d_b_rec_id = models.AutoField(primary_key=True)
    LeaveDependableDetail = models.ForeignKey(LeaveDependableDetail, on_delete=models.PROTECT)
    leave_type = models.ForeignKey(
        LeaveType,
        null=True,
        on_delete=models.SET_NULL,
        related_name="leave_dependable_headers_bucket"
    )
    leave_deduction_bucket = models.ForeignKey(
        LeaveType,
        null=True,
        on_delete=models.SET_NULL,  # Change this to on_delete=models.PROTECT
        related_name="leave_dependable_deduction_headers_bucket"
    )
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
    leave_deduction_bucket_allowed = models.IntegerField(blank=True, null=True, default=0)
    leave_deduction_used = models.IntegerField(blank=True, null=True, default=0)
    leave_type_used = models.IntegerField(blank=True, null=True, default=0)
    leave_deduction_running_balance = models.IntegerField(blank=True, null=True, default=0)
    leave_date = models.DateField(blank=True, null=True)
    def __str__(self):
        return str(self.LeaveDependableDetail)
class LeaveNonDependableDetail(models.Model):
    l_n_d_rec_id = models.AutoField(primary_key=True)
    leave_request = models.ForeignKey(LeaveApply, on_delete=models.PROTECT)
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
    hr_year_id = models.IntegerField()
    apply_date = models.DateField()
    leave_type = models.ForeignKey(
        LeaveType,
        null=True,
        on_delete=models.SET_NULL,
        related_name="leave_non_dependable_headers"
    )
    leave_from_date = models.DateField()
    leave_to_date = models.DateField()
    status = models.CharField(max_length=20)
    leave_type_allowed = models.IntegerField(blank=True, null=True)
    leave_type_used = models.IntegerField(blank=True, null=True)
    leave_type_remaning = models.IntegerField(blank=True, null=True)
    def __str__(self):
        return f"{self.employee} - {self.leave_type} - {self.leave_from_date} to {self.leave_to_date}"
    # ... (add any other fields or methods you need for your specific use case)
class AccrueTable(models.Model):
    month = models.DateField()
    hr_year = models.IntegerField()
    leave_bucket = models.ForeignKey(
        LeaveType,
        null=True,
        on_delete=models.SET_NULL,
        related_name="leave_apply_type_headers_accrue"
    )
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True)
    accrued_leaves = models.IntegerField()
    def __str__(self):
        return str(self.employee)