from typing import Iterable, Optional
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from simple_history.models import HistoricalRecords
from .manager import UserManager
from django.utils import timezone
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from dateutil.relativedelta import relativedelta
from phonenumber_field.modelfields import PhoneNumberField
from django.contrib.auth.models import Permission
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password


# from cryptography.fernet import Fernet
# class EncryptedTextField(models.TextField):
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.key = Fernet.generate_key()
#     def from_db_value(self, value, expression, connection):
#         f = Fernet(self.key)
#         return f.decrypt(value.encode()).decode()
#     def to_python(self, value):
#         return value
#     def get_db_prep_save(self, value, connection):
#         f = Fernet(self.key)
#         return f.encrypt(value.encode()).decode()
# Create your models here.
# class EmployeePayrollClass(models.Model):
#     name = models.CharField(max_length=20)
#     description = models.TextField(max_length=100)
#     def __str__(self):
#         return self.name
#     class Meta:
#          permissions = [
#             ("can_read_name", "Can Read Name"),
#         ]

# class EmployeePayrollClass(models.Model):
#     name = models.CharField(max_length=20)
#     description = models.TextField(max_length=100)

#     def __str__(self):
#         return self.name
    

class Wing(models.Model):
    OPERATING_UNIT_TYPE_CHOICES = 'Department'
    SEARCH_NAME_CONSTANT = 'Client Services'
    w_rec_id = models.AutoField(primary_key=True)
    wing_id = models.CharField(max_length=50, unique=True)
    wing_name = models.CharField(max_length=255)
    director_concern_position=models.ForeignKey('Position', on_delete=models.PROTECT,blank=True,null=True,related_name="director_concern_position")
    adg=models.ForeignKey('Position', on_delete=models.PROTECT,blank=True,null=True,related_name="adg_position")
    search_name = models.CharField(
        max_length=255, default=SEARCH_NAME_CONSTANT)
    operating_unit_type = models.CharField(
        max_length=255, default=OPERATING_UNIT_TYPE_CHOICES)
    def __str__(self):
        return f"{self.wing_name}"
    class Meta:
        # unique_together=('wing_id','wing_name')
        verbose_name = 'Wing'
        verbose_name_plural = 'Wing'
class Sub_Wing(models.Model):
    # Define fields for the Sub_Wing model
    sw_rec_id = models.AutoField(primary_key=True)
    sub_wind_id = models.CharField(max_length=50, unique=True)
    sub_wing_name = models.CharField(max_length=100)
    wing = models.ForeignKey(Wing, on_delete=models.PROTECT)
    class Meta:
            # unique_together=('sub_wind_id','sub_wing_name')
            permissions = [
            ("can_view_wing", "Can View wing"),
            ("can_add_wing", "Can Add wing"),
            ("can_change_wing", "Can Change wing"),
        ]
    def __str__(self):
        return self.sub_wing_name
class Region(models.Model):
    r_rec_id = models.AutoField(primary_key=True)
    region_id = models.CharField(max_length=50, unique=True)
    region_name = models.CharField(max_length=100)
    class Meta:
        verbose_name  = 'Region_Setup'
        
        
    #         unique_together=('region_id','region_name')
    def __str__(self):
        return self.region_name
class Division(models.Model):
        d_rec_id = models.AutoField(primary_key=True)
        division_id = models.CharField(max_length=50, unique=True)
        division_name = models.CharField(max_length=100)
        region = models.ForeignKey(Region, on_delete=models.PROTECT)
        def __str__(self):
            return self.division_name
        class Meta:
        #     unique_together=('division_id','division_name')
            permissions = [
                ("can_view_region", "Can View region"),
                ("can_add_region", "Can Add region"),
                ("can_change_region", "Can Change region"),
                ("can_view_d_rec_id", "Can View d_rec_id"),
                ("can_add_d_rec_id", "Can Add d_rec_id"),
                ("can_change_d_rec_id", "Can Change d_rec_id"),
                ("can_view_division_id", "Can View division_id"),
                ("can_add_division_id", "Can Add division_id"),
                ("can_change_division_id", "Can Change division_id"),
                ("can_view_division_name", "Can View division_name"),
                ("can_add_division_name", "Can Add division_name"),
                ("can_change_division_name", "Can Change division_name"),
            ]
class District(models.Model):
    district_rec_id = models.AutoField(primary_key=True)
    district_id = models.CharField(max_length=50, unique=True)
    district_name = models.CharField(max_length=100)
    division = models.ForeignKey(Division, on_delete=models.PROTECT)
    class Meta:
        unique_together=('district_id','district_name')
    def __str__(self):
        return self.district_name + "," + self.district_id
class Tehsil(models.Model):
    t_rec_id = models.AutoField(primary_key=True)
    t_id = models.CharField(max_length=50, unique=True)
    t_name = models.CharField(max_length=100)
    district = models.ForeignKey(District, on_delete=models.PROTECT, default=1)
    # class Meta:
        # unique_together=('t_id','t_name')
    def __str__(self):
        return self.t_name
class Center(models.Model):
    c_rec_id = models.AutoField(primary_key=True)
    center_id = models.CharField(max_length=50, unique=True)
    center_name = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.PROTECT)
    division = models.ForeignKey(Division, on_delete=models.PROTECT)
    district = models.ForeignKey(District, on_delete=models.PROTECT)
    tehsil = models.ForeignKey(Tehsil, on_delete=models.PROTECT)
    la_mapping = models.CharField(max_length=100, blank=True)
    rr_mapping = models.CharField(max_length=100, blank=True)
    # class Meta:
    #     unique_together=('center_id','center_name')
    def __str__(self):
        return self.center_name
class PositionType(models.Model):
    p_t_rec_id = models.AutoField(primary_key=True)
    position_type_name = models.CharField(max_length=100)
    class Meta:
        unique_together=('p_t_rec_id','position_type_name')
    def __str__(self):
        return self.position_type_name

class Ppg_Level_Setup(models.Model):
    ppg_rec_id = models.AutoField(primary_key=True)
    ppg_level = models.CharField(max_length=50)
    ppg_level_seniority = models.IntegerField()

    class Meta:
        unique_together = ['ppg_level', 'ppg_level_seniority']

    def __str__(self):
        return self.ppg_level

    # def save(self, *args, **kwargs):
    #     if not self.pk:
    #         # If this is a new object, find the maximum seniority for the given ppg_level
    #         max_seniority = Ppg_Level_Setup.objects.filter().last().ppg_level_seniority
    #         if max_seniority is not None:
    #             self.ppg_level_seniority = max_seniority + 1
    #         else:
    #             # If there are no previous entries for the same ppg_level, set seniority to 1
    #             self.ppg_level_seniority = 1

    #     super(Ppg_Level_Setup, self).save(*args, **kwargs)

class Job(models.Model):
    FULL_TIME_EQUIVALENT = 1.00
    MAXIMUM_NUMBER_OF_POSITIONS = 'UNLIMITED'
    j_rec_id = models.AutoField(primary_key=True)
    job_id = models.CharField(max_length=300, unique=True, blank=True)
    job_title = models.CharField(max_length=255, unique=True)
    job_abbrivation = models.CharField(max_length=50, null=True)
    no_of_seniority_level = models.IntegerField(default=1, null=True)
    ppg_level = models.ForeignKey(
        Ppg_Level_Setup, on_delete=models.PROTECT, null=True)
    full_time_equivalent = models.CharField(
        max_length=255, default=FULL_TIME_EQUIVALENT)
    maximum_number_of_positions = models.CharField(
        max_length=255, default=MAXIMUM_NUMBER_OF_POSITIONS)
    # class Meta:
    #     unique_together=('job_id','job_title')
    def save(self, *args, **kwargs):
        if self.pk:
            # Existing instance, handle updates
            prev_no_of_seniority_level = Job.objects.get(
                pk=self.pk).no_of_seniority_level
            super(Job, self).save(*args, **kwargs)
            if self.no_of_seniority_level != prev_no_of_seniority_level:
                # Update no_of_seniority_level and save the Job instance
                self.job_id = f"{self.job_abbrivation}_{self.job_title}_{self.no_of_seniority_level:02}"
                super(Job, self).save(*args, **kwargs)
                # Create or update JobLevel records based on the new no_of_seniority_level
                for i in range(1, self.no_of_seniority_level + 1):
                    job_level, created = JobLevel.objects.get_or_create(
                        job=self,
                        job_abbrivation=self.job_abbrivation,
                        job_abbrivation_seniority=i
                    )
                    job_level.save()
                # Delete any extra JobLevel records if the new no_of_seniority_level is smaller
                JobLevel.objects.filter(
                    job=self,
                    job_abbrivation=self.job_abbrivation,
                    job_abbrivation_seniority__gt=self.no_of_seniority_level
                ).delete()
        else:
            # New instance, save the Job and create JobLevel records if applicable
            super(Job, self).save(*args, **kwargs)
            self.job_id = f"{self.job_abbrivation}_{self.job_title}_{self.no_of_seniority_level}"
            super(Job, self).save(*args, **kwargs)
            if self.no_of_seniority_level and self.no_of_seniority_level > 1:
                for i in range(1, self.no_of_seniority_level + 1):
                    job_level = JobLevel.objects.create(
                        job=self,
                        job_abbrivation=self.job_abbrivation,
                        job_abbrivation_seniority=i
                    )
                    job_level.save()
    def __str__(self):
        return self.job_id
class JobLevel(models.Model):
    j_l_rec_id = models.AutoField(primary_key=True)
    job = models.ForeignKey(Job, models.PROTECT)
    job_abbrivation = models.CharField(max_length=50, null=True)
    job_abbrivation_seniority = models.IntegerField()
    # class Meta:
        # unique_together=('job','job_abbrivation_seniority')
    def __str__(self):
        return f"{self.job_abbrivation}_{self.job_abbrivation_seniority}"
class Position(models.Model):
    FULL_TIME_EQUIVALENT = 1.00
    p_rec_id = models.AutoField(primary_key=True)
    position_desc = models.CharField(max_length=50, blank=True, null=True)
    job = models.ForeignKey(Job, on_delete=models.PROTECT)
    position_id = models.CharField(max_length=50, blank=True, null=True)
    no_of_position = models.IntegerField(default=1)
    location = models.ForeignKey(Center, on_delete=models.PROTECT)
    wing = models.ForeignKey(Wing, on_delete=models.PROTECT)
    sub_wing = models.ForeignKey(Sub_Wing, on_delete=models.PROTECT)
    position_type = models.ForeignKey(PositionType, on_delete=models.PROTECT)
    open_position = models.BooleanField(default=True)
    position_active = models.BooleanField(default=True)
    full_time_equivalent = models.CharField(
        max_length=255, default=FULL_TIME_EQUIVALENT,blank=True, null=True,)
    def __str__(self):
            return f"{self.position_id}"
    
    
    def create_position(self, index, no_of_position):
        self.position_id = f"{self.job.job_abbrivation}_{self.location}_{index:02d}"
        return Position(
            position_desc=f"{self.job} {self.location}",
            location=self.location,
            job=self.job,
            wing=self.wing,
            sub_wing=self.sub_wing,
            no_of_position=no_of_position,
            position_type=self.position_type,
            open_position=self.open_position,
            full_time_equivalent=self.full_time_equivalent,
            position_id=self.position_id
        )

    # def create_position(self, index, no_of_position):
    #     # Generate a new position_id for the new position
    #     new_position_id = f"{self.job.job_abbrivation}_{self.location}_{index:02d}"
    #     return Position(
    #         position_desc=f"{self.job} {self.location}",
    #         location=self.location,
    #         job=self.job,
    #         wing=self.wing,
    #         sub_wing=self.sub_wing,
    #         no_of_position=no_of_position,
    #         position_type=self.position_type,
    #         open_position=self.open_position,
    #         full_time_equivalent=self.full_time_equivalent,
    #         position_id=new_position_id
    #     )

    def save(self, *args, **kwargs):
        # Check if the instance is being created or updated
        is_new = self._state.adding
        self.position_desc = f"{self.job} {self.location}"

        if is_new:
            # Generate the initial position_id for the first position
            self.position_id = f"{self.job.job_abbrivation}_{self.location}_01"
            # Save the current instance
            super(Position, self).save(*args, **kwargs)
            # If it's a new instance, create additional positions as needed
            positions_to_create = [self.create_position(i, self.no_of_position) for i in range(2, self.no_of_position + 1)]
            Position.objects.bulk_create(positions_to_create)
        else:
            # Save the current instance without changing the position_id
            super(Position, self).save(*args, **kwargs)
            # If it's an update, adjust the number of positions
            current_positions = Position.objects.filter(
                job=self.job,
                location=self.location,
                wing=self.wing,
                sub_wing=self.sub_wing,
                position_type=self.position_type,
            ).exclude(p_rec_id=self.p_rec_id)

            current_count = current_positions.count()
            desired_count = self.no_of_position - 1  # Exclude the current instance

            if desired_count > current_count:
                # Create additional positions
                last_position = current_positions.order_by('-position_id').first()
                last_index = int(last_position.position_id.split('_')[-1]) if last_position else 1
                positions_to_create = [self.create_position(i, self.no_of_position) for i in range(last_index + 1, last_index + desired_count - current_count + 1)]
                Position.objects.bulk_create(positions_to_create)
            elif desired_count < current_count:
                # Delete excess positions
                positions_to_delete = current_positions.order_by('position_id')[desired_count:]
                for position in positions_to_delete:
                    position.delete()

            # Update no_of_position in all previous instances
            current_positions.update(no_of_position=self.no_of_position)
class JobLevelAssignment(models.Model):
    employee = models.ForeignKey('Employee', on_delete=models.PROTECT) 
    job_level = models.ForeignKey(JobLevel, on_delete=models.PROTECT)
    assignment_start = models.DateField()
    assignment_end = models.DateField(blank=True, null=True)  # Use null=True for DateFields if they can be empty
    months_in_position=models.IntegerField(blank=True,null=True)
    active=models.BooleanField(default=False)
    class Meta:
        unique_together=('employee','job_level')
    def __str__(self):
        return f"Position Assignment for {self.employee} - {self.job_level}"
    def save(self, *args, **kwargs):
        if self.assignment_start is not None and self.assignment_start <= datetime.now().date():
            delta = relativedelta(datetime.now().date(), self.assignment_start)
            # Calculate the difference in months
            self.months_in_position = delta.years * 12 + delta.months
        else:
            self.months_in_position = 0
        validity = JobLevelValidity.objects.get(job_level=self.job_level)
        if self.assignment_start is not None and self.assignment_start and validity is not None:
            # Calculate the current date
            current_date = datetime.now().date()
            # Add the number of months to the current date
            next_date = current_date + relativedelta(months=validity.validity)
            # Store next_date in a new variable
            self.assignment_end = next_date
        super(JobLevelAssignment, self).save(*args, **kwargs)
class ApprovalMatrix(models.Model):
    a_m_rec_id = models.AutoField(primary_key=True)
    position = models.ForeignKey(
        Position,
        on_delete=models.PROTECT,
        related_name='approval_matrix'
    )
    reporting_position = models.ForeignKey(
        Position,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name='reporting_approval_matrix'
    )
    counter_assigning_position = models.ForeignKey(
        Position,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name='counter_assigning_approval_matrix'
    )
    dg_admin = models.ForeignKey(
        Position,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name='dg_Admin',
        # limit_choices_to={'job': 1},
    )
    
    def clean(self):
        if self.reporting_position == self.counter_assigning_position or self.position == self.counter_assigning_position or self.counter_assigning_position == self.position:
            raise ValidationError(
                "A position can only be associated with either reporting or counter assigning, not both.")
    # Additional fields for your ApprovalMatrix model
    def save(self, *args, **kwargs):
        self.clean()
        super(ApprovalMatrix, self).save(*args, **kwargs)
        try:
            employee = Employee.objects.get(position=self.position)
            if (
                    self.reporting_position and
                    employee.reporting_officer != self.reporting_position
            ):
                employee.reporting_officer = Employee.objects.get(
                    position=self.reporting_position)
                employee.save()
            if (
                    self.counter_assigning_position and
                    employee.counter_assigning_officer != self.counter_assigning_position
            ):
                employee.counter_assigning_officer = Employee.objects.get(
                    position=self.counter_assigning_position)
                employee.save()
        except Employee.DoesNotExist:
            pass
    def __str__(self):
        return str(self.position)
@receiver(pre_delete, sender=ApprovalMatrix)
def update_employee_from_approval_matrix(sender, instance, **kwargs):
    related_employees = Employee.objects.filter(position=instance.position)
    for employee in related_employees:
        employee.reporting_officer = None
        employee.counter_assigning_officer = None
        employee.save()
class Employee_Title(models.Model):
    e_t_rec_id = models.AutoField(primary_key=True)
    employee_title = models.CharField(max_length=100,unique=True)
    
    def __str__(self):
        return self.employee_title
class Employee(AbstractBaseUser, PermissionsMixin):
    # history = HistoricalRecords()
    username = None
    employee_no = models.CharField(max_length=50, blank=True)
    # employee_class = models.ForeignKey(EmployeePayrollClass, on_delete=models.PROTECT, related_name='EmployeePayrollClass', blank=True, null=True)

    # employee_class = models.ForeignKey(EmployeePayrollClass, on_delete=models.PROTECT, related_name='EmployeePayrollClass', blank=True, null=True)
    id = models.AutoField(primary_key=True)
    cnic = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    father_name = models.CharField(max_length=50)
    passport_number = models.CharField(max_length=50)
    domicile_district = models.CharField(max_length=50, blank=True, null=True)
    phoneNumber = PhoneNumberField(region="PK", blank=True)
    employee_image = models.ImageField(
        upload_to='Images', blank=True, null=True)
    employee_cnic_image_front = models.ImageField(
        upload_to='Images', blank=True, null=True)
    employee_cnic_image_back = models.ImageField(
        upload_to='Images', blank=True, null=True)
    employee_domicile_image = models.ImageField(
        upload_to='Images', blank=True, null=True)
    title = models.ForeignKey(
        Employee_Title,
        on_delete=models.SET_NULL,
        null=True,  # Allow the ForeignKey to be nullable
        blank=True  # Allow the ForeignKey to be optional in forms
    )
    date_of_joining = models.DateField(null=True, blank=True)
    service_duration = models.CharField(max_length=100, blank=True, null=True)
    center = models.ForeignKey(Center, on_delete=models.SET_NULL,
                               null=True,  # Allow the ForeignKey to be nullable
                               blank=True  # Allow the ForeignKey to be optional in forms
                               )
    position = models.OneToOneField(Position, on_delete=models.SET_NULL,
                                    null=True,  # Allow the ForeignKey to be nullable
                                    blank=True  # Allow the ForeignKey to be optional in forms
                                    )
    reporting_officer = models.ForeignKey('self', on_delete=models.SET_NULL,
                                          null=True,  # Allow the ForeignKey to be nullable
                                          blank=True,
                                          related_name='roficer'
                                          )
    counter_assigning_officer = models.ForeignKey('self', on_delete=models.SET_NULL,
                                                  null=True,  # Allow the ForeignKey to be nullable
                                                  blank=True,
                                                  related_name='csoficer'
                                                  )
    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    objects = UserManager()
    USERNAME_FIELD = 'cnic'
    REQUIRED_FIELDS = []
    class Meta:
        verbose_name='Basic Information'
    def save(self, *args, **kwargs):
        today = timezone.now().date()
        if not self.pk:
            hash_pass = make_password(self.password)
            self.password=hash_pass
        if self.position:
            instance = Position.objects.get(p_rec_id=self.position.p_rec_id)
            instance.open_position = False
            instance.save()
        if self.date_of_joining and self.date_of_joining <= today:
            duration = today - self.date_of_joining
            years = duration.days // 365
            months = (duration.days % 365) // 30
            days = (duration.days % 365) % 30
            self.service_duration = f"{years} years, {months} months, {days} days"
        elif self.service_duration is not None and self.date_of_joining >= today:
            self.service_duration = None
        if self.position:
            try:
                approval_matrix = ApprovalMatrix.objects.get(
                    position=self.position)
                if (
                        self.reporting_officer and
                        approval_matrix.reporting_position != self.reporting_officer.position
                ):
                    approval_matrix.reporting_position = self.reporting_officer.position
                    approval_matrix.save()
                if (
                        self.counter_assigning_officer and
                        approval_matrix.counter_assigning_position != self.counter_assigning_officer.position
                ):
                    approval_matrix.counter_assigning_position = self.counter_assigning_officer.position
                    approval_matrix.save()
                
            except ApprovalMatrix.DoesNotExist:
                pass
        super(Employee, self).save(*args, **kwargs)
        
    def __str__(self):
        return str(self.first_name + self.last_name + self.cnic)
class PositionAssignment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    position = models.ForeignKey(Position, on_delete=models.PROTECT)
    assignment_start = models.DateField()
    assignment_end = models.DateField(blank=True, null=True)  # Use null=True for DateFields if they can be empty
    primary_position = models.BooleanField(default=False)
    months_in_position = models.PositiveIntegerField(blank=True, null=True)
    active = models.BooleanField(default=False)
    class Meta:
        verbose_name="Position"
        unique_together = ['active', 'primary_position','employee']
    def save(self, *args, **kwargs):
        if not self.pk or self.employee.reporting_officer is None :
            related_position=ApprovalMatrix.objects.filter(position=self.position).first()
            if related_position:
                related_position.save()
        if self.primary_position  is True and self.active is True:
            res=Employee.objects.get(id=self.employee.id)
            if res:
                res.position=self.position
                self.position.open_position=False
                res.save()
        else:
            res=Employee.objects.get(id=self.employee.id)
            if res:
                res.position=None
                self.position.open_position=True
                res.save()
        if self.assignment_start is not None and self.assignment_start <= datetime.now().date():
            delta = relativedelta(datetime.now().date(), self.assignment_start)
            # Calculate the difference in months
            self.months_in_position = delta.years * 12 + delta.months
        else:
            self.months_in_position = 0
        super(PositionAssignment, self).save(*args, **kwargs)
    def __str__(self):
        return f"Position Assignment for {self.employee} - {self.position}"
class JobLevelValidity(models.Model):
    job_level=models.OneToOneField(JobLevel, on_delete=models.PROTECT)
    validity=models.IntegerField()
    class Meta:
        unique_together=('job_level','validity')
    def __str__(self):
        return f"{self.job_level} is valid {self.validity} months"
