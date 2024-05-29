

from django.db import models
from employee_basic_information.models import *
from django.db.models import Q

# Create your models here.
class ElevtionDocument(models.Model):
    ElevtionDocumentCHOICES = (
        ('In Process', 'In Process'),
        ('Close', 'Close')
    )
    elevtion_to_l2_doc_rec_id= models.AutoField(primary_key=True)
    document_date= models.DateField()
    status= models.CharField(choices=ElevtionDocumentCHOICES, max_length=20)

    # def __str__(self):
    #     return self.status
    

class ElevtionToEmployee(models.Model):
    CHOICES = (
        ('Marked', 'Marked'),
        ('Approved', 'Approved'),
        ('Reject', 'Reject'),
    )
    ApprovalChoices = (
        ('DG', 'DG'),
        ('Hr Director', 'Hr Director')
    )
    document = models.ForeignKey(ElevtionDocument, on_delete=models.PROTECT, related_name='toL2')
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='toL2Employees')
    elevation_job_level = models.ForeignKey(JobLevel, on_delete=models.PROTECT, related_name="elevationjoblevelL2", blank=True, null=True)
    promote_to_level = models.IntegerField()
    elevation_approval_date = models.DateField(blank=True, null=True)
    elevation_effective_date = models.DateField(blank=True, null=True)
    status= models.CharField(choices=CHOICES, max_length=20)
    approved_by = models.CharField(choices=ApprovalChoices, max_length=20, blank=True, null=True)

    # def save(self, *args, **kwargs ):
    #      a = JobLevel.objects.filter(job=self.employee.position.job)
    #      for j in a:
    #         if j.job_abbrivation_seniority==2:
    #             self.elevation_job_level=j

    #      super(ElevtionToEmployee, self).save()

class PendingElevation(models.Model):
    CHOICES = (
        ('New', 'New'),
        ('In Process', 'In Process'),
        ('Marked', 'Marked'),
        ('Approved', 'Approved'),
        ('Reject', 'Reject'),
    )
    
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='pendingEmployeesForElevation')
    current_level = models.IntegerField()
    months_in_current_level = models.IntegerField()
    current_level_start_date = models.DateField(blank=True, null=True)
    status = models.CharField(choices=CHOICES, max_length=50)

    def __str__(self):
        return f"{self.employee}-{self.status}"
    












