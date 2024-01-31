from django.db import models
from employee_basic_information.models import Employee,Position
# Create your models here.
class CompetentAuthority(models.Model):
    EMPLOYEE_POSITION_CHOICES = [
        ('DG', 'DG'),
        ('CONCERN OFFICER', 'CONCERN OFFICER'),
        ('HR DIRECTOR', 'HR DIRECTOR'),#In Leave Process Approval
        ('HR ADMIN', 'HR ADMIN'),#In transfer Process Approval
        ('LEAVE SUPER APPROVAL', 'LEAVE SUPER APPROVAL'),#Leave super approval
        ('HR User', 'HR User'),#HR USer in all process
    ]
    designation = models.CharField(
        max_length=30,
        choices=EMPLOYEE_POSITION_CHOICES,
        default='ADG ADMIN',
    )
    employee_position=models.ForeignKey(Position, on_delete=models.PROTECT,blank=True,null=True)
    def __str__(self) :
        return f"Competent Authority Name:{self.designation}{self.employee_position}"