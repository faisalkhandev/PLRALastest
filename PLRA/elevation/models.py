from django.db import models
from employee_basic_information.models import *
from django.db.models import Q

# Create your models here.
class ElevtionToL2(models.Model):
    ElevtionToL2CHOICES = (
        ('In Process', 'In Process'),
        ('Close', 'Close')
    )
    elevtion_to_l2_doc_rec_id= models.AutoField(primary_key=True)
    document_date= models.DateField()
    status= models.CharField(choices=ElevtionToL2CHOICES, max_length=20)

    # def __str__(self):
    #     return self.status
    

class ElevtionToL2Employee(models.Model):
    CHOICES = (
        ('In Process', 'In Process'),
        ('Marked', 'Marked'),
        ('Approved', 'Approved'),
        ('Reject', 'Reject'),
    )
    document = models.ForeignKey(ElevtionToL2, on_delete=models.PROTECT, related_name='toL2')
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='toL2Employees')
    elevation_job_level = models.ForeignKey(JobLevel, on_delete=models.PROTECT, related_name="elevationjoblevelL2", blank=True, null=True)
    elevation_approval_date = models.DateField(blank=True, null=True)
    elevation_effective_date = models.DateField(blank=True, null=True)
    status= models.CharField(choices=CHOICES, max_length=20)

    def save(self):
         a = JobLevel.objects.filter(job=self.employee.position.job)
         for j in a:
            if j.job_abbrivation_seniority==2:
                self.elevation_job_level=j

         super(ElevtionToL2Employee, self).save()

class ElevtionToL3(models.Model):
    ElevtionToL3CHOICES = (
        ('In Process', 'In Process'),
        ('Close', 'Close')
    )
    elevtion_to_l3_doc_rec_id= models.AutoField(primary_key=True)
    document_date= models.DateField()
    status= models.CharField(choices=ElevtionToL3CHOICES, max_length=20)

    # def __str__(self):
    #     return self.status
    

class ElevtionToL3Employee(models.Model):
    CHOICES = (
        ('In Process', 'In Process'),
        ('Marked', 'Marked'),
        ('Approved', 'Approved'),
        ('Reject', 'Reject'),
    )
    document = models.ForeignKey(ElevtionToL3, on_delete=models.PROTECT, related_name='toL2')
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='toL3Employees')
    elevation_job_level = models.ForeignKey(JobLevel, on_delete=models.PROTECT, related_name="elevationjoblevel", blank=True, null=True)
    elevation_approval_date = models.DateField(blank=True, null=True)
    elevation_effective_date = models.DateField(blank=True, null=True)
    status= models.CharField(choices=CHOICES, max_length=20)

    def save(self):
         a = JobLevel.objects.filter(job=self.employee.position.job)
         for j in a:
            if j.job_abbrivation_seniority==3:
                self.elevation_job_level=j

         super(ElevtionToL3Employee, self).save()