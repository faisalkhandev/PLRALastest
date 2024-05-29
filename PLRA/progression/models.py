from django.db import models
from employee_basic_information.models import *

# Create your models here.
class PendingProgression(models.Model):
    CHOICES = (
        ('New', 'New'),
        ('In Process', 'In Process'),
        ('Marked', 'Marked'),
        ('Approved', 'Approved'),
        ('Reject', 'Rejected'),
    )
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name="progressionPendingEmployee") 
    status = models.CharField(choices=CHOICES, max_length=50)
    pending_inquiry = models.BooleanField()
    major_penalities = models.BooleanField()
    promote_ppg_level = models.ForeignKey(Ppg_Level_Setup, on_delete=models.PROTECT, related_name="pendingpromoteppglevel")
    promote_job = models.ForeignKey(Job, on_delete=models.PROTECT, related_name="pendingpromotejob")
    promote_job_level = models.ForeignKey(JobLevel, on_delete=models.PROTECT, related_name="pendingpromotejobLevel")
    post_vacant = models.BooleanField()
    promoted_post = models.ForeignKey(Position, on_delete=models.PROTECT, related_name="pendingvacantPost", blank=True, null=True)

class ProgressionDocument(models.Model):
    CHOICES = (
        ("In Process", "In Process"),
        ("Close" , "Close")
    )
    ApprovalChoices = (
        ('DG', 'DG'),
        ('Hr Director', 'Hr Director')
    )
    progression_document_rec_id = models.AutoField(primary_key=True)
    progression_document_date = models.DateField()
    status = models.CharField(choices=CHOICES, max_length=20)
    approved_by = models.CharField(choices=ApprovalChoices, max_length=20, blank=True, null=True)
    

class ProgressionEmployee(models.Model):
    CHOICES = (
        ('In Process', 'In Process'),
        ('Marked', 'Marked'),
        ('Approved', 'Approved'),
        ('Reject', 'Rejected'),
    )

    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name="progressionEmployee")
    document = models.OneToOneField(ProgressionDocument, on_delete=models.PROTECT, related_name="progressionDocument")
    pending_inquiry = models.BooleanField()
    major_penalities = models.BooleanField()
    promote_ppg_level = models.ForeignKey(Ppg_Level_Setup, on_delete=models.PROTECT, related_name="promoteppglevel")
    promote_job = models.ForeignKey(Job, on_delete=models.PROTECT, related_name="promotejob")
    promote_job_level = models.ForeignKey(JobLevel, on_delete=models.PROTECT, related_name="promotejobLevel")
    post_vacant = models.BooleanField()
    promoted_post = models.ForeignKey(Position, on_delete=models.PROTECT, related_name="vacantPost", blank=True, null=True)
    progression_approval_date = models.DateField(blank=True, null=True)
    progression_effective_date = models.DateField(blank=True, null=True)
    status = models.CharField(choices=CHOICES, max_length=20)
