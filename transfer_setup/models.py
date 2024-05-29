from django.core.exceptions import ValidationError
from django.db import models
from employee_basic_information.models import Employee
from employee_basic_information.models import Job
from employee_basic_information.models import Position
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime
from django.dispatch import receiver
from django.db.models.signals import pre_delete
from employee_master_data.models import DependentEmploymentHistory
from datetime import date
from competent_authority.models import *
import googlemaps
from geopy.distance import geodesic
from math import radians, sin, cos, sqrt, atan2
from geopy.geocoders import Nominatim
from django.db.models import Q
import random
# Create your models here.
class TransferRatingType(models.Model):
    CATEGORY_CHOICES = (
        ('Open Merit', 'Open Merit'),
        ('Hardship', 'Hardship')
    )
    name = models.CharField(max_length=50)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="Open Merit")
    def __str__(self) -> str:
        return self.name
    def save(self):
        self.name = self.name.lower().strip()
        super(TransferRatingType, self).save()
class DistanceRatingFarmula(models.Model):
    CATEGORY_CHOICES = (
        ('Open Merit', 'Open Merit'),
        ('Hardship' , 'Hardship')
    )
    name = models.CharField(max_length=50)
    formula_type = models.ForeignKey(TransferRatingType, on_delete=models.PROTECT, limit_choices_to={'name' : 'distance'})
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    within_district_per_km_marks = models.FloatField(max_length=50)
    within_district_max_marks = models.IntegerField()
    across_district_per_km_marks = models.FloatField(max_length=50)
    from_km = models.IntegerField()
    across_district_max_marks = models.IntegerField()
    allow_district_fixed_marks = models.IntegerField()
class WedlockRatingFarmula(models.Model):
    CATEGORY_CHOICES = (
        ('Open Merit', 'Open Merit'),
        ('Hardship' , 'Hardship')
    )
    name = models.CharField(max_length=50)
    formula_type = models.ForeignKey(TransferRatingType, on_delete=models.PROTECT, limit_choices_to={'name' : 'wedlock'})
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    within_district_fixed_marks = models.IntegerField()
    max_marks = models.IntegerField()
    across_district_fixed_marks = models.IntegerField()

    class Meta:
        verbose_name = "Rating Farmula"
        verbose_name_plural = "Rating Farmulas"
class TenureRatingFarmula(models.Model):
    CATEGORY_CHOICES = (
        ('Open Merit', 'Open Merit'),
        ('Hardship' , 'Hardship')
    )
    name = models.CharField(max_length=50)
    formula_type = models.ForeignKey(TransferRatingType, on_delete=models.PROTECT)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    max_marks = models.IntegerField()
    minimum_tenure_months = models.IntegerField()
    total_tenure_months = models.IntegerField()
    factor = models.FloatField(blank=True)
    total_month_served = models.IntegerField(blank=True)
    def save(self):
        employee = Employee.objects.first()
        date_of_joining = datetime.strptime(str(employee.date_of_joining), "%Y-%m-%d")
        today = datetime.strptime(str(datetime.today().date()), "%Y-%m-%d")
        # total_months = (today.year - date_of_joining.year) * 12 + today.month - date_of_joining.month
        total_months = today-date_of_joining
        self.total_month_served = int(total_months.days*0.032855)
        if self.total_month_served >= self.minimum_tenure_months:
            self.factor = (self.max_marks / self.total_tenure_months) * self.total_month_served
        else:
            self.factor = 0
        super(TenureRatingFarmula, self).save()
class DisabilityRatingFarmula(models.Model):
    CATEGORY_CHOICES = (
        ('Open Merit', 'Open Merit'),
        ('Hardship' , 'Hardship')
    )
    name = models.CharField(max_length=50)
    formula_type = models.ForeignKey(TransferRatingType, on_delete=models.PROTECT, limit_choices_to={'name' : 'disability'})
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    max_marks = models.IntegerField()
class SameDistrictRestrictionRule(models.Model):
    rule_rec_id = models.IntegerField(primary_key=True)
    restriction_job = models.ForeignKey(Job, on_delete=models.PROTECT)
class TransferRatingModel(models.Model):
    rating_model_rec_id = models.IntegerField(primary_key=True)
    description = models.CharField(max_length=50)
    year = models.IntegerField()
    active = models.BooleanField()
    total_marks = models.IntegerField(default=100)
class TransferRatingModelType(models.Model):
    model = models.ForeignKey(TransferRatingModel, on_delete=models.PROTECT, related_name='model')
    type = models.ForeignKey(TransferRatingType, on_delete=models.PROTECT)
    tranfer_type_category = models.CharField(max_length=20, blank=True)
    max_marks = models.IntegerField(blank=True)
    def save(self, *args, **kwargs):
        if self.model.total_marks > 0:
            self.tranfer_type_category = self.type.category
            self.model.total_marks -= self.max_marks
            self.model.save()
            super().save(*args, **kwargs)
        else:
            raise ValidationError("Total Marks Limit Exceed!")
@receiver(pre_delete, sender=TransferRatingModelType)
def my_handler(sender, instance, **kwargs):
    instance.model.total_marks += instance.max_marks
    instance.model.save()
    
class E_Transfer_Window_Period(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=50)
    from_date = models.DateField()
    to_date = models.DateField()
    status = models.BooleanField()
    open_position = models.ManyToManyField(Position)
    def save(self, *args, **kwargs):
        if self.status:
            # Check if any other record has status=True
            # if E_Transfer_Window_Period.objects.exclude(id=self.id).filter(status=True).exists():
            #     raise ValidationError("A record with status=True already exists.")
 
            # Check for overlapping date ranges with status=True
            overlapping_periods = E_Transfer_Window_Period.objects.exclude(id=self.id).filter(
                status=True,
                from_date__lte=self.to_date,
                to_date__gte=self.from_date
            )
            if overlapping_periods.exists():
                raise ValidationError("There is already a record with status=True within the same date range.")
 
        super(E_Transfer_Window_Period, self).save(*args, **kwargs)

class E_Transfer_Rating_Matrix(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, blank=True,    null=True)
    e_transfer_process=models.ForeignKey('E_Transfer_Process', on_delete=models.PROTECT, blank=True,    null=True)
    category = models.CharField(max_length=50, blank=True,  null=True)
    max_marks = models.IntegerField(blank=True,   null=True)
    system_generated_marks = models.IntegerField(blank=True,  null=True)
    concerned_person_marks = models.IntegerField(blank=True,  null=True)


class HRDirectorETransferApproval(models.Model):
    # STATUS_CHOICES = (
    #     ('Marked', 'Marked'),
    #     ('Approved' , 'Approved'),
    #     ('Reject' , 'Reject')
    #     )
    position= models.ForeignKey(Position, on_delete=models.PROTECT, related_name="approvalPosition")
    e_transfer_process=models.ManyToManyField('E_Transfer_Process')
    concern_officer_authority=models.ForeignKey(Employee, on_delete=models.PROTECT)
    visible=models.BooleanField(default=True)
    max_marks=models.PositiveIntegerField(blank=True,null=True)
    marks_obtain=models.PositiveIntegerField(blank=True,null=True)
    e_transfer_approval_date = models.DateField(blank=True,null=True)
    new_joining_effective_date = models.DateField(blank=True,null=True)
    remarks = models.TextField(blank=True,null=True)
    # status = models.CharField(choices=STATUS_CHOICES, max_length=10,default='Marked')
    def __str__(self):
        return f"{self.e_transfer_process} -  Approval"        
    class Meta:
        verbose_name = "HRDirectorETransferApproval"
        verbose_name_plural = "HRDirectorETransferApprovals"


class ConcernOfficerApproval(models.Model):
    # STATUS_CHOICES = (
    #     ('Marked', 'Marked'),
    #     ('Approved' , 'Approved'),
    #     ('Reject' , 'Reject')
    #     )
    e_transfer_process=models.OneToOneField('E_Transfer_Process', on_delete=models.PROTECT,related_name="ConcernOfficerApproval", blank=True, null=True)
    concern_officer_authority=models.ForeignKey(Employee, on_delete=models.PROTECT, blank=True, null=True)
    visible=models.BooleanField(default=True, blank=True, null=True)
    max_marks=models.PositiveIntegerField(blank=True, null=True)
    marks_obtain=models.PositiveIntegerField(blank=True, null=True)
    e_transfer_approval_date = models.DateField(blank=True,null=True)
    # status = models.CharField(choices=STATUS_CHOICES, max_length=10,default='Marked')
    new_joining_effective_date = models.DateField(blank=True,null=True)
    def __str__(self):
        return f"{self.e_transfer_process} - {self.e_transfer_process.get_status_display()} Approval"
    # def save(self, *args, **kwargs):
        
    #     super(ConcernOfficerApproval, self).save(*args, **kwargs)
        
             
            
    class Meta:
        verbose_name = "ConcernOfficerApproval"
        verbose_name_plural = "ConcernOfficerApprovals"

from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
class E_Transfer_Process(models.Model):
    STATUS_CHOICES = (
        ('In Process' , 'In Process'),
        ('Marked', 'Marked'),
        ('Approved' , 'Approved'),
        ('Reject' , 'Reject')
    )
    TRANSFER_CATEGORY_CHOICES = (
        ('Open Merit' , 'Open Merit'),
        ('Wedlock', 'Wedlock'),
        ('Disability/Medical' , 'Disability/Medical'),
        ('Wedlock-Disability/Medical' , 'Wedlock-Disability/Medical')
    )
    e_transfer_rec_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    status = models.CharField(choices=STATUS_CHOICES, max_length=10,default='In Process')
    e_transfer_apply_date = models.DateField(auto_now=True)
    transfer_window = models.ForeignKey(E_Transfer_Window_Period,  related_name='OpenPosition', on_delete=models.PROTECT)
    transfer_position = models.ForeignKey(Position, related_name='OpenPosition', on_delete=models.PROTECT)
    transfer_category = models.CharField(choices=TRANSFER_CATEGORY_CHOICES, max_length=50)
    attachments = models.FileField(upload_to='media/E-transfer_attachments',blank=True,null=True)
    new_joining_date = models.DateField(blank=True,null=True)
    e_transfer_approval_date = models.DateField(blank=True,null=True)
    # def __str__(self):
    #     return f"{self.employee} - {self.status} - {self.transfer_category} Transfer"
    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super(E_Transfer_Process, self).save(*args, **kwargs)

        if is_new:
            self._create_rating_matrix()
            self._calculate_concern_officer_approval()

    def _create_rating_matrix(self):
        date_of_joining = datetime.strptime(str(self.employee.date_of_joining), "%Y-%m-%d")
        today = datetime.strptime(str(datetime.today().date()), "%Y-%m-%d")
        total_months = int((today - date_of_joining).days * 0.032855)
        employespouse = DependentEmploymentHistory.objects.filter(employee=self.employee).first() or ''

        try:
            rating_model_to_be_used = TransferRatingModel.objects.get(active=True)
            open_merit_types = TransferRatingModelType.objects.filter(
                Q(tranfer_type_category='Open Merit'), Q(model=rating_model_to_be_used)
            )
        except TransferRatingModel.DoesNotExist as e:
            raise ValidationError(e)

        if self.transfer_category == 'Open Merit':
            self._create_open_merit_matrix(open_merit_types, total_months)
        elif self.transfer_category in ['Disability/Medical', 'Wedlock']:
            self._create_special_category_matrix(open_merit_types, total_months, employespouse)
        else:
            self._create_default_category_matrix(open_merit_types, total_months, employespouse)

    def _create_open_merit_matrix(self, open_merit_types, total_months):
        for merit_type in open_merit_types:
            if merit_type.type.name == 'distance':
                self._create_distance_matrix(0)
            elif merit_type.type.name == 'tenure':
                self._create_tenure_matrix(total_months)

    def _create_special_category_matrix(self, open_merit_types, total_months, employespouse):
        if self.transfer_category == 'Disability/Medical':
            self._create_disability_matrix()
        elif self.transfer_category == 'Wedlock':
            self._create_wedlock_matrix(employespouse)

        self._create_open_merit_matrix(open_merit_types, total_months)

    def _create_default_category_matrix(self, open_merit_types, total_months, employespouse):
        self._create_wedlock_matrix(employespouse)
        self._create_disability_matrix()
        self._create_open_merit_matrix(open_merit_types, total_months)

    def _create_distance_matrix(self, system_generated_marks):
        E_Transfer_Rating_Matrix.objects.create(
            employee=self.employee,
            e_transfer_process=self,
            category='Distance',
            max_marks=DistanceRatingFarmula.objects.first().within_district_max_marks,
            system_generated_marks=random(20, 50),
            concerned_person_marks=system_generated_marks
        )

    def _create_tenure_matrix(self, total_months):
        max_marks = TenureRatingFarmula.objects.first().max_marks
        marks = max_marks if total_months * TenureRatingFarmula.objects.first().factor >= max_marks else total_months * TenureRatingFarmula.objects.first().factor
        E_Transfer_Rating_Matrix.objects.create(
            employee=self.employee,
            e_transfer_process=self,
            category='Tenure',
            max_marks=max_marks,
            system_generated_marks=marks,
            concerned_person_marks=marks
        )

    def _create_disability_matrix(self):
        max_marks = DisabilityRatingFarmula.objects.first().max_marks
        marks = max_marks if self.attachments else 0
        E_Transfer_Rating_Matrix.objects.create(
            employee=self.employee,
            e_transfer_process=self,
            category='Disability',
            max_marks=max_marks,
            system_generated_marks=marks,
            concerned_person_marks=marks
        )

    def _create_wedlock_matrix(self, employespouse):
        max_marks = WedlockRatingFarmula.objects.first().max_marks
        marks = 10 if employespouse and employespouse.job_district == self.employee.center.district else 15
        E_Transfer_Rating_Matrix.objects.create(
            employee=self.employee,
            e_transfer_process=self,
            category='Wedlock',
            max_marks=max_marks,
            system_generated_marks=marks,
            concerned_person_marks=marks
        )

    def _calculate_concern_officer_approval(self):
        try:
            approving_authority_position = CompetentAuthority.objects.get(designation='CONCERN OFFICER')
            approving_authority = Employee.objects.filter(position=approving_authority_position.employee_position).first()
            if not approving_authority:
                raise ValueError("There is no employee on Concern Officer position.")
        except CompetentAuthority.DoesNotExist:
            raise ValueError("Concern Officer authority not found.")
        except Employee.DoesNotExist:
            raise ValueError("There is no employee on Concern Officer position.")

        list_of_marks = E_Transfer_Rating_Matrix.objects.filter(e_transfer_process=self)
        related_max_marks = sum(i.max_marks for i in list_of_marks)
        related_marks_obtain = sum(i.concerned_person_marks for i in list_of_marks)

        ConcernOfficerApproval.objects.create(
            e_transfer_process=self,
            max_marks=related_max_marks,
            marks_obtain=related_marks_obtain,
            concern_officer_authority=approving_authority
        )



class Address(models.Model):
    address_line = models.CharField(max_length=100)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    address_line2 = models.CharField(max_length=100)
    latitude2 = models.FloatField(blank=True, null=True)
    longitude2 = models.FloatField(blank=True, null=True)
    distance=models.CharField(max_length=50,blank=True, null=True)
    def haversine_distance(self, lat1, lon1, lat2, lon2):
        # Radius of the Earth in kilometers
        R = 6371.0
        lat1_rad = radians(lat1)
        lon1_rad = radians(lon1)
        lat2_rad = radians(lat2)
        lon2_rad = radians(lon2)
        dlon = lon2_rad - lon1_rad
        dlat = lat2_rad - lat1_rad
        a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance_km = R * c
        return distance_km
    def save(self, *args, **kwargs):
        geolocator = Nominatim(user_agent="my_geocoder")  # Provide a custom user_agent
        location = geolocator.geocode(self.address_line)
        location2 = geolocator.geocode(self.address_line2)
        if location:
            self.latitude = location.latitude
            self.longitude = location.longitude
        if location2:
            self.latitude2 = location2.latitude
            self.longitude2 = location2.longitude
        if self.latitude and self.longitude and self.latitude2 and self.longitude2:
            distance_km = self.haversine_distance(self.latitude, self.longitude, self.latitude2, self.longitude2)
            self.distance = distance_km
        else:
            self.distance = None
        super().save(*args, **kwargs)

