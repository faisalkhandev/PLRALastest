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
# Create your models here.
class TransferRatingType(models.Model):
    CATEGORY_CHOICES = (
        ('Open Merit', 'Open Merit'),
        ('Hardship', 'Hardship')
    )
    name = models.CharField(max_length=50)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="Open Merit")
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
class TenureRatingFarmula(models.Model):
    CATEGORY_CHOICES = (
        ('Open Merit', 'Open Merit'),
        ('Hardship' , 'Hardship')
    )
    name = models.CharField(max_length=50)
    formula_type = models.ForeignKey(TransferRatingType, on_delete=models.PROTECT, limit_choices_to={'name' : 'tenure'})
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    max_marks = models.IntegerField()
    minimum_tenure_months = models.IntegerField()
    total_tenure_months = models.IntegerField()
    factor = models.IntegerField(blank=True)
    total_month_served = models.IntegerField(blank=True)
    def save(self):
        employee = Employee.objects.get(id=2)
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
    open_position = models.ManyToManyField(Position,  limit_choices_to={ 'open_position' : True})
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
    transfer_position = models.ForeignKey(E_Transfer_Window_Period,  related_name='OpenPosition', on_delete=models.PROTECT)
    transfer_category = models.CharField(choices=TRANSFER_CATEGORY_CHOICES, max_length=50)
    attachments = models.FileField(upload_to='media/E-transfer_attachments')
    new_joining_date = models.DateField(blank=True,null=True)
    e_transfer_approval_date = models.DateField(blank=True,null=True)
    def __str__(self):
        return f"{self.employee} - {self.status} - {self.transfer_category} Transfer"
    def save(self, *args, **kwargs):
        self._create_rating_matrix(*args, **kwargs)
        res=ConcernOfficerApproval.objects.filter(e_transfer_process=self).exists()
        if not res:
            self._calculate_concern_officer_approval()
        super(E_Transfer_Process, self).save(*args, **kwargs)
    def _create_rating_matrix(self,*args, **kwargs):
        employee_spouse = DependentEmploymentHistory.objects.filter(employee=self.employee).first() if DependentEmploymentHistory.objects.filter(employee=self.employee).first() is not None else ''
        if self.transfer_category == 'Open Merit':
            open_merit_types = TransferRatingModelType.objects.filter(tranfer_type_category='Open Merit')
            
            for i in open_merit_types:
                if i.type.name=='distance':
                    E_Transfer_Rating_Matrix.objects.create(
                        employee=self.employee,
                        e_transfer_process=self,
                        category='Distance',
                        max_marks=DistanceRatingFarmula.objects.get(id=1).within_district_max_marks,
                        system_generated_marks=0,
                        concerned_person_marks=0
                    ).save()
                    if i.type.name == 'tenure':
                        E_Transfer_Rating_Matrix.objects.create(
                            employee=self.employee,
                            e_transfer_process=self,
                            category='Tenure',
                            max_marks=TenureRatingFarmula.objects.get(id=1).max_marks,
                            system_generated_marks=0,
                            concerned_person_marks=0
                        ).save()
                    else:
                        E_Transfer_Rating_Matrix.objects.create(
                            employee=self.employee,
                            e_transfer_process=self,
                            category=i.type.name,
                            max_marks=i.max_marks,
                            system_generated_marks=0,
                            concerned_person_marks=0
                        ).save()
        else:
            try:
                wedlock_formula = WedlockRatingFarmula.objects.get(id=1)
                disability_formula = DisabilityRatingFarmula.objects.get(id=1)

                E_Transfer_Rating_Matrix.objects.create(
                    employee=self.employee,
                    e_transfer_process=self,
                    category='Wedlock',
                    max_marks=wedlock_formula.max_marks,
                    system_generated_marks=10 if employee_spouse.job_district == self.employee.center.district else 15,
                    concerned_person_marks=0
                ).save()

                E_Transfer_Rating_Matrix.objects.create(
                    employee=self.employee,
                    e_transfer_process=self,
                    category='Disability',
                    max_marks=disability_formula.max_marks,
                    system_generated_marks=disability_formula.max_marks if self.disability_attachments is not None else 0,
                    concerned_person_marks=0
                ).save()

            except WedlockRatingFarmula.DoesNotExist:
                # Handle the case where WedlockRatingFarmula with the given id does not exist
                # You can log an error, raise an exception, or handle it in another way based on your needs
                raise ValueError("WedlockRatingFarmula not found.")

            except DisabilityRatingFarmula.DoesNotExist:
                # Handle the case where DisabilityRatingFarmula with the given id does not exist
                # You can log an error, raise an exception, or handle it in another way based on your needs
                raise ValueError("DisabilityRatingFarmula not found.")

            except Exception as e:
                # Handle other exceptions that might occur during the creation of E_Transfer_Rating_Matrix objects
                # You can log an error, raise an exception, or handle it in another way based on your needs
                raise ValueError(f"An error occurred: {str(e)}")

        super(E_Transfer_Process, self).save(*args, **kwargs)
    def _calculate_concern_officer_approval(self):
        try:
            approving_authority_position = CompetentAuthority.objects.get(designation='CONCERN OFFICER')
            
        except ObjectDoesNotExist:
            raise ValueError("Concern Officer authority not found.")
        try:
            approving_authority=Employee.objects.filter(position=approving_authority_position.employee_position).first()
        except ObjectDoesNotExist:
            raise ValueError("There is no employee on Concern Officer position.")  

        list_of_marks = E_Transfer_Rating_Matrix.objects.filter(employee=self.employee, e_transfer_process=self)
        related_max_marks = 0
        related_marks_obtain = 0
        for i in list_of_marks:
            related_max_marks = related_max_marks + i.max_marks
            related_marks_obtain = related_marks_obtain + i.concerned_person_marks

        ConcernOfficerApproval.objects.create(
            e_transfer_process=self,
            max_marks=related_max_marks,
            marks_obtain=related_marks_obtain,
            concern_officer_authority=approving_authority
        )

        
        
           
class ConcernOfficerApproval(models.Model):
    STATUS_CHOICES = (
        ('Pending' , 'Pending'),
        ('Marked', 'Marked'),
        ('Approved' , 'Approved'),
        ('Reject' , 'Reject')
        )
      
    e_transfer_process=models.OneToOneField(E_Transfer_Process, on_delete=models.PROTECT)
    concern_officer_authority=models.ForeignKey(Employee, on_delete=models.PROTECT)
    visible=models.BooleanField(default=True)
    max_marks=models.PositiveIntegerField()
    marks_obtain=models.PositiveIntegerField()
    e_transfer_approval_date = models.DateField(blank=True,null=True)
    new_joining_effective_date = models.DateField(blank=True,null=True)
    remarks = models.TextField(blank=True,null=True)
    status = models.CharField(choices=STATUS_CHOICES, max_length=10,default='Pending')
    def __str__(self):
        return f"{self.e_transfer_process} - {self.get_status_display()} Approval"
    def save(self, *args, **kwargs):


        # Update E_Transfer_Process based on ConcernOfficerApproval status
        if  self.status == 'Approved':
            now = datetime.now().date()

            # Update E_Transfer_Process approval date
            self.e_transfer_process.e_transfer_approval_date = now
            self.e_transfer_approval_date = now
            
            self.e_transfer_process.status=self.status

            # Update E_Transfer_Process new_joining_date if new_joining_effective_date is provided
            if self.new_joining_effective_date:
                
                self.e_transfer_process.new_joining_date = self.new_joining_effective_date
                

            # Save the updated E_Transfer_Process
            self.e_transfer_process.save()
        elif self.status == 'Marked':
            self.e_transfer_process.status=self.status
            self.e_transfer_process.save()
            if not  HRDirectorETransferApproval.objects.filter(e_transfer_process=self.e_transfer_process).exists():
                try:
                    approving_authority_position = CompetentAuthority.objects.get(designation='HR DIRECTOR')
                    
                except ObjectDoesNotExist:
                    raise ValueError("Concern Officer authority not found.")
                try:
                    approving_authority=Employee.objects.filter(position=approving_authority_position.employee_position).first()
                except ObjectDoesNotExist:
                    raise ValueError("There is no employee on HR Director position.")  

                list_of_marks = E_Transfer_Rating_Matrix.objects.filter(employee=self.e_transfer_process.employee, e_transfer_process=self.e_transfer_process)
                related_max_marks = 0
                related_marks_obtain = 0
                for i in list_of_marks:
                    related_max_marks = related_max_marks + i.max_marks
                    related_marks_obtain = related_marks_obtain + i.concerned_person_marks

                HRDirectorETransferApproval.objects.create(
                    e_transfer_process=self.e_transfer_process,
                    max_marks=related_max_marks,
                    marks_obtain=related_marks_obtain,
                    concern_officer_authority=approving_authority,
                    status=self.status
                )
        elif self.status == 'Reject':
            self.e_transfer_process.status=self.status
            self.e_transfer_process.save()
        super(ConcernOfficerApproval, self).save(*args, **kwargs)
        
             
            
    class Meta:
        verbose_name = "ConcernOfficerApproval"
        verbose_name_plural = "ConcernOfficerApprovals"

class HRDirectorETransferApproval(models.Model):
    STATUS_CHOICES = (
        ('Marked', 'Marked'),
        ('Approved' , 'Approved'),
        ('Reject' , 'Reject')
        )
      
    e_transfer_process=models.OneToOneField(E_Transfer_Process, on_delete=models.PROTECT)
    concern_officer_authority=models.ForeignKey(Employee, on_delete=models.PROTECT)
    visible=models.BooleanField(default=True)
    max_marks=models.PositiveIntegerField()
    marks_obtain=models.PositiveIntegerField()
    e_transfer_approval_date = models.DateField(blank=True,null=True)
    new_joining_effective_date = models.DateField(blank=True,null=True)
    remarks = models.TextField(blank=True,null=True)
    status = models.CharField(choices=STATUS_CHOICES, max_length=10,default='Marked')
    def __str__(self):
        return f"{self.e_transfer_process} - {self.get_status_display()} Approval"
    def save(self, *args, **kwargs):


        # Update E_Transfer_Process based on HRDirectorETransferApproval status
        if  self.status == 'Approved':
            now = datetime.now().date()

            # Update E_Transfer_Process approval date
            self.e_transfer_process.e_transfer_approval_date = now
            self.e_transfer_approval_date = now
            
            self.e_transfer_process.status=self.status

            # Update E_Transfer_Process new_joining_date if new_joining_effective_date is provided
            if self.new_joining_effective_date:
                
                self.e_transfer_process.new_joining_date = self.new_joining_effective_date

            # Save the updated E_Transfer_Process
            self.e_transfer_process.save()
        
        elif self.status == 'Reject':
            self.e_transfer_process.status=self.status
            self.e_transfer_process.save()
        super(HRDirectorETransferApproval, self).save(*args, **kwargs)
        
             
            
    class Meta:
        verbose_name = "HRDirectorETransferApproval"
        verbose_name_plural = "HRDirectorETransferApprovals"


class E_Transfer_Rating_Matrix(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    e_transfer_process=models.ForeignKey(E_Transfer_Process, on_delete=models.PROTECT)
    category = models.CharField(max_length=50)
    max_marks = models.IntegerField()
    system_generated_marks = models.IntegerField()
    concerned_person_marks = models.IntegerField()
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
