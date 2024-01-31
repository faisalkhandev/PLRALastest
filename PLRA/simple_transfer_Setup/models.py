import math
from django.core.exceptions import ValidationError
from django.db import models
from datetime import datetime
from employee_basic_information.models import Employee
from employee_basic_information.models import Position
from competent_authority.models import *
# Create your models here.
class Transfer_Process(models.Model):
    STATUS_CHOICES = (
        ('In Process', 'In Process'),
        ('Approved', 'Approved'),
        ('Reject', 'Reject')
    )
    TRANSFER_CATEGORY_CHOICES = (
        ('Administrative', 'Administrative'),
        ('Inquiry', 'Inquiry'),
        ('Wedlock', 'Wedlock'),
        ('Disability/Medical', 'Disability/Medical'),
        ('Wedlock-Disability/Medical', 'Wedlock-Disability/Medical')
    )
    transfer_rec_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employee,related_name='emp', on_delete=models.PROTECT)
    status = models.CharField(choices=STATUS_CHOICES, max_length=10,default='In Process')
    transfer_apply_date = models.DateField(auto_now=True)
    transfer_approval_date = models.DateField(blank=True,null=True)
    transfer_position = models.ForeignKey(Position,
                                          related_name='OpenPositionSimpleTransfer', on_delete=models.PROTECT)
    transfer_category = models.CharField(choices=TRANSFER_CATEGORY_CHOICES, max_length=50)
    remarks = models.TextField(blank=True,null=True)
    attachments = models.FileField(upload_to='media/administrative_transfer_attachments',blank=True,null=True)
    new_joining_date = models.DateField(blank=True,null=True)
    def __str__(self):
        return f"{self.employee} - {self.status} Transfer ({self.transfer_category})"
    def save(self, *args, **kwargs):
        super(Transfer_Process, self).save(*args, **kwargs)
        if self.status == 'In Process':
                try:
                    related_position = CompetentAuthority.objects.get(designation='HR DIRECTOR')
                    approving_authority = Employee.objects.filter(position=related_position.employee_position).first()
                    print(approving_authority)
                    TransferApprovals.objects.create(transfer_process=self, approving_authority=approving_authority)
                except CompetentAuthority.DoesNotExist:
                    raise ValidationError("CompetentAuthority with designation 'HR DIRECTOR' does not exist.")
                except Employee.DoesNotExist:
                    raise ValidationError("Employee with the specified Position does not exist.")
    # def save(self):
    #     datof_joining = datetime.strptime(str(self.employee.datof_joining), "%Y-%m-%d")
    #     today = datetime.strptime(str(datetime.today().date()), "%Y-%m-%d")
    #     total_months = int((today - datof_joining).days * 0.032855)
    #     employespouse = DependentEmploymentHistory.objects.filter(
    #         employee=self.employee).first() if DependentEmploymentHistory.objects.filter(
    #         employee=self.employee).first() is not None else ''
    #     if self.transfer_category == 'Administrative' or self.transfer_category == 'Inquiry':
    #         open_merit_types = TransferRatingModelType.objects.filter(tranfer_typcategory='Open Merit')
    #         print(open_merit_types)
    #         for i in open_merit_types:
    #             print(i.type.name)
    #             if i.type.name == 'distance':
    #                 print("distance")
    #                 employecenter = self.employee.center.center_name
    #                 transfer_position_center = self.transfer_position.open_position.location.center_name
    #                 geolocator = Nominatim(user_agent="my_geocoder")  # Provide a custom user_agent
    #                 location = geolocator.geocode(employecenter)
    #                 location2 = geolocator.geocode(transfer_position_center)
    #                 if location:
    #                     employecenterlatitude = location.latitude
    #                     employecenterlongitude = location.longitude
    #                     lat1_rad = radians(employecenterlatitude)
    #                     lon1_rad = radians(employecenterlongitude)
    #                 if location2:
    #                     transfer_position_centerlatitude2 = location2.latitude
    #                     transfer_position_centerlongitude2 = location2.longitude
    #                     lat2_rad = radians(transfer_position_centerlatitude2)
    #                     lon2_rad = radians(transfer_position_centerlongitude2)
    #                 R = 6371.0
    #                 dlon = lon2_rad - lon1_rad
    #                 dlat = lat2_rad - lat1_rad
    #                 a = sin(dlat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2) ** 2
    #                 c = 2 * atan2(sqrt(a), sqrt(1 - a))
    #                 distanckm = R * c
    #                 d_formula = DistanceRatingFarmula.objects.get(id=1)
    #                 print('Distance' + str(distanckm))
    #                 marks = None
    #                 if self.employee.center.district == self.transfer_position.open_position.location.district:
    #                     within_district_marks = d_formula.within_district_per_km_marks * distanckm
    #                     print(distanckm)
    #                     if within_district_marks <= 50:
    #                         marks = within_district_marks
    #                         print('a' + str(marks))
    #                     else:
    #                         marks = 50
    #                         print('b' + str(marks))
    #                 else:
    #                     if distanckm > 50:
    #                         differencgreater_than_50 = distanckm - 50
    #                         different_district_marks = d_formula.across_district_per_km_marks * differencgreater_than_50
    #                         marks = different_district_marks
    #                         print('c' + str(marks))
    #                     else:
    #                         marks = d_formula.allow_district_fixed_marks
    #                         print('d' + str(marks))
    #                 print("distance")
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category='Distance',
    #                     max_marks=DistanceRatingFarmula.objects.get(id=1).within_district_max_marks,
    #                     system_generated_marks=marks,
    #                     concerned_person_marks=0
    #                 ).save()
    #             elif i.type.name == 'tenure':
    #                 print('setted')
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category='Tenure',
    #                     max_marks=TenureRatingFarmula.objects.get(id=2).max_marks,
    #                     system_generated_marks=TenureRatingFarmula.objects.get(
    #                         id=2).max_marks if total_months * TenureRatingFarmula.objects.get(
    #                         id=2).factor >= TenureRatingFarmula.objects.get(
    #                         id=2).max_marks else total_months * TenureRatingFarmula.objects.get(id=2).factor,
    #                     concerned_person_marks=0
    #                 ).save()
    #             else:
    #                 print('ok')
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category=i.type.name,
    #                     max_marks=i.max_marks,
    #                     system_generated_marks=0,
    #                     concerned_person_marks=0
    #                 ).save()
    #     elif self.transfer_category == 'Disability/Medical':
    #         Transfer_Rating_Matrix.objects.create(
    #             employee=self.employee,
    #             category='Disability',
    #             max_marks=DisabilityRatingFarmula.objects.get(id=1).max_marks,
    #             system_generated_marks=DisabilityRatingFarmula.objects.get(
    #                 id=1).max_marks if self.disability_attachments is not None else 0,
    #             concerned_person_marks=0
    #         ).save()
    #         open_merit_types = TransferRatingModelType.objects.filter(tranfer_typcategory='Open Merit')
    #         print(open_merit_types)
    #         for i in open_merit_types:
    #             print(i.type.name)
    #             if i.type.name == 'distance':
    #                 print("distance")
    #                 employecenter = self.employee.center.center_name
    #                 transfer_position_center = self.transfer_position.open_position.location.center_name
    #                 geolocator = Nominatim(user_agent="my_geocoder")  # Provide a custom user_agent
    #                 location = geolocator.geocode(employecenter)
    #                 location2 = geolocator.geocode(transfer_position_center)
    #                 if location:
    #                     employecenterlatitude = location.latitude
    #                     employecenterlongitude = location.longitude
    #                     lat1_rad = radians(employecenterlatitude)
    #                     lon1_rad = radians(employecenterlongitude)
    #                 if location2:
    #                     transfer_position_centerlatitude2 = location2.latitude
    #                     transfer_position_centerlongitude2 = location2.longitude
    #                     lat2_rad = radians(transfer_position_centerlatitude2)
    #                     lon2_rad = radians(transfer_position_centerlongitude2)
    #                 R = 6371.0
    #                 dlon = lon2_rad - lon1_rad
    #                 dlat = lat2_rad - lat1_rad
    #                 a = sin(dlat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2) ** 2
    #                 c = 2 * atan2(sqrt(a), sqrt(1 - a))
    #                 distanckm = R * c
    #                 d_formula = DistanceRatingFarmula.objects.get(id=1)
    #                 print('Distance' + str(distanckm))
    #                 marks = None
    #                 if self.employee.center.district == self.transfer_position.open_position.location.district:
    #                     within_district_marks = d_formula.within_district_per_km_marks * distanckm
    #                     print(distanckm)
    #                     if within_district_marks <= 50:
    #                         marks = within_district_marks
    #                         print('a' + str(marks))
    #                     else:
    #                         marks = 50
    #                         print('b' + str(marks))
    #                 else:
    #                     if distanckm > 50:
    #                         differencgreater_than_50 = distanckm - 50
    #                         different_district_marks = d_formula.across_district_per_km_marks * differencgreater_than_50
    #                         marks = different_district_marks
    #                         print('c' + str(marks))
    #                     else:
    #                         marks = d_formula.allow_district_fixed_marks
    #                         print('d' + str(marks))
    #                 print("distance")
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category='Distance',
    #                     max_marks=DistanceRatingFarmula.objects.get(id=1).within_district_max_marks,
    #                     system_generated_marks=marks,
    #                     concerned_person_marks=0
    #                 ).save()
    #             elif i.type.name == 'tenure':
    #                 print('setted')
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category='Tenure',
    #                     max_marks=TenureRatingFarmula.objects.get(id=2).max_marks,
    #                     system_generated_marks=TenureRatingFarmula.objects.get(
    #                         id=2).max_marks if total_months * TenureRatingFarmula.objects.get(
    #                         id=2).factor >= TenureRatingFarmula.objects.get(
    #                         id=2).max_marks else total_months * TenureRatingFarmula.objects.get(id=2).factor,
    #                     concerned_person_marks=0
    #                 ).save()
    #             else:
    #                 print('ok')
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category=i.type.name,
    #                     max_marks=i.max_marks,
    #                     system_generated_marks=0,
    #                     concerned_person_marks=0
    #                 ).save()
    #     elif self.transfer_category == 'Wedlock':
    #         Transfer_Rating_Matrix.objects.create(
    #             employee=self.employee,
    #             category='Wedlock',
    #             max_marks=WedlockRatingFarmula.objects.get(id=1).max_marks,
    #             system_generated_marks=10 if employespouse.job_district == self.employee.center.district else 15,
    #             concerned_person_marks=0
    #         ).save()
    #         open_merit_types = TransferRatingModelType.objects.filter(tranfer_typcategory='Open Merit')
    #         print(open_merit_types)
    #         for i in open_merit_types:
    #             print(i.type.name)
    #             if i.type.name == 'distance':
    #                 print("distance")
    #                 employecenter = self.employee.center.center_name
    #                 transfer_position_center = self.transfer_position.open_position.location.center_name
    #                 geolocator = Nominatim(user_agent="my_geocoder")  # Provide a custom user_agent
    #                 location = geolocator.geocode(employecenter)
    #                 location2 = geolocator.geocode(transfer_position_center)
    #                 if location:
    #                     employecenterlatitude = location.latitude
    #                     employecenterlongitude = location.longitude
    #                     lat1_rad = radians(employecenterlatitude)
    #                     lon1_rad = radians(employecenterlongitude)
    #                 if location2:
    #                     transfer_position_centerlatitude2 = location2.latitude
    #                     transfer_position_centerlongitude2 = location2.longitude
    #                     lat2_rad = radians(transfer_position_centerlatitude2)
    #                     lon2_rad = radians(transfer_position_centerlongitude2)
    #                 R = 6371.0
    #                 dlon = lon2_rad - lon1_rad
    #                 dlat = lat2_rad - lat1_rad
    #                 a = sin(dlat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2) ** 2
    #                 c = 2 * atan2(sqrt(a), sqrt(1 - a))
    #                 distanckm = R * c
    #                 d_formula = DistanceRatingFarmula.objects.get(id=1)
    #                 print('Distance' + str(distanckm))
    #                 marks = None
    #                 if self.employee.center.district == self.transfer_position.open_position.location.district:
    #                     within_district_marks = d_formula.within_district_per_km_marks * distanckm
    #                     print(distanckm)
    #                     if within_district_marks <= 50:
    #                         marks = within_district_marks
    #                         print('a' + str(marks))
    #                     else:
    #                         marks = 50
    #                         print('b' + str(marks))
    #                 else:
    #                     if distanckm > 50:
    #                         differencgreater_than_50 = distanckm - 50
    #                         different_district_marks = d_formula.across_district_per_km_marks * differencgreater_than_50
    #                         marks = different_district_marks
    #                         print('c' + str(marks))
    #                     else:
    #                         marks = d_formula.allow_district_fixed_marks
    #                         print('d' + str(marks))
    #                 print("distance")
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category='Distance',
    #                     max_marks=DistanceRatingFarmula.objects.get(id=1).within_district_max_marks,
    #                     system_generated_marks=marks,
    #                     concerned_person_marks=0
    #                 ).save()
    #             elif i.type.name == 'tenure':
    #                 print('setted')
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category='Tenure',
    #                     max_marks=TenureRatingFarmula.objects.get(id=2).max_marks,
    #                     system_generated_marks=TenureRatingFarmula.objects.get(
    #                         id=2).max_marks if total_months * TenureRatingFarmula.objects.get(
    #                         id=2).factor >= TenureRatingFarmula.objects.get(
    #                         id=2).max_marks else total_months * TenureRatingFarmula.objects.get(id=2).factor,
    #                     concerned_person_marks=0
    #                 ).save()
    #             else:
    #                 print('ok')
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category=i.type.name,
    #                     max_marks=i.max_marks,
    #                     system_generated_marks=0,
    #                     concerned_person_marks=0
    #                 ).save()
    #     else:
    #         print("hi")
    #         Transfer_Rating_Matrix.objects.create(
    #             employee=self.employee,
    #             category='Wedlock',
    #             max_marks=WedlockRatingFarmula.objects.get(id=1).max_marks,
    #             system_generated_marks=10 if employespouse.job_district == self.employee.center.district else 15,
    #             concerned_person_marks=0
    #         ).save()
    #         Transfer_Rating_Matrix.objects.create(
    #             employee=self.employee,
    #             category='Disability',
    #             max_marks=DisabilityRatingFarmula.objects.get(id=1).max_marks,
    #             system_generated_marks=DisabilityRatingFarmula.objects.get(
    #                 id=1).max_marks if self.disability_attachments is not None else 0,
    #             concerned_person_marks=0
    #         ).save()
    #         employespouse = DependentEmploymentHistory.objects.filter(
    #             employee=self.employee).first() if DependentEmploymentHistory.objects.filter(
    #             employee=self.employee).first() is not None else ''
    #         open_merit_types = TransferRatingModelType.objects.filter(tranfer_typcategory='Open Merit')
    #         print(open_merit_types)
    #         for i in open_merit_types:
    #             print(i.type.name)
    #             if i.type.name == 'distance':
    #                 print("distance")
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category='Distance',
    #                     max_marks=DistanceRatingFarmula.objects.get(id=1).within_district_max_marks,
    #                     system_generated_marks=marks,
    #                     concerned_person_marks=0
    #                 ).save()
    #             elif i.type.name == 'tenure':
    #                 print('setted')
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category='Tenure',
    #                     max_marks=TenureRatingFarmula.objects.get(id=2).max_marks,
    #                     system_generated_marks=TenureRatingFarmula.objects.get(
    #                         id=2).max_marks if total_months * TenureRatingFarmula.objects.get(
    #                         id=2).factor >= TenureRatingFarmula.objects.get(
    #                         id=2).max_marks else total_months * TenureRatingFarmula.objects.get(id=2).factor,
    #                     concerned_person_marks=0
    #                 ).save()
    #             else:
    #                 print('ok')
    #                 Transfer_Rating_Matrix.objects.create(
    #                     employee=self.employee,
    #                     category=i.type.name,
    #                     max_marks=i.max_marks,
    #                     system_generated_marks=0,
    #                     concerned_person_marks=0
    #                 ).save()
    #     super(Transfer_Process, self).save()
        # open_merit_types = TransferRatingModelType.objects.filter(type.)
        # for i in open_merit_types:
        # opt_transfer_type = TransferRatingModelType.objects.filter(type=i.id)
        # print(opt_transfer_type)
        # if opt_transfer_type.type.name == 'tenure':
        #     print("tenure")
        # print(open_merit_types)
class TransferApprovals(models.Model):
    transfer_process = models.OneToOneField(Transfer_Process, on_delete=models.PROTECT)
    approving_authority=models.ForeignKey(Employee, on_delete=models.PROTECT,related_name='TransferApprovals')
    notes = models.TextField()
    visible=models.BooleanField(default=True)
    Joining_effective_date = models.DateField(blank=True, null=True)
    status = models.CharField(
        max_length=50,
        choices=[
            ('Pending', 'Pending'),
            ('Approved', 'Approved'),
            ('Rejected', 'Rejected'),
        ],
        default='Pending'
    )
    def save(self, *args, **kwargs):

        # Update Transfer_Process status and transfer_approval_date based on TransferApprovals status
        if self.status == 'Approved':
            self.transfer_process.status = 'Approved'
            self.transfer_process.transfer_approval_date = datetime.now().date()
            
            self.transfer_process.save()
            
        elif self.status == 'Rejected':
            self.transfer_process.status = 'Reject'
            self.visible=False
            self.transfer_process.save()
            
        if self.Joining_effective_date:
            self.transfer_process.new_joining_date=self.Joining_effective_date
            self.transfer_process.save()
        super(TransferApprovals, self).save(*args, **kwargs)
        
        
    def __str__(self):
        return f"{self.transfer_process.employee} - {self.status} Approval"
