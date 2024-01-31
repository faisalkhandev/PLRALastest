
from django.db import models

from employee_basic_information.models import Employee

 

# Create your models here.

class NocType(models.Model):

    noc_rec_id = models.IntegerField(primary_key=True)

    noc_type = models.CharField(max_length=50)

   

class NocProcess(models.Model):

    CHOICES = (

        ("In Process", "In Process"),

        ("Issued", "Issued"),

        ("Not Issued", "Not Issued")

    )

    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='employeeForNoc')

    noc_apply_date = models.DateField()

    noc_type = models.ForeignKey(NocType, on_delete=models.PROTECT, related_name='noc_types')

    noc_middle_body_text = models.TextField()