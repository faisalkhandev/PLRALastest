import datetime
from django.db import models
from django.db.models import Q
from employee_basic_information.models import Employee,PositionAssignment
class TerminationRequest(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    
    STATUS_CHOICES = (
        ('In process', 'In process'),
        ('Closed', 'Closed'),
    )
    termination_category_choices = (
        ('Compulsory Retirement', 'Compulsory Retirement'),
        ('Removal from service', 'Removal from service'),
        ('Dismissal from service', 'Dismissal from service'),
    )
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='In process')
    
    case_initiation_date = models.DateField(auto_now=True)
    termination_effective_date = models.DateField(blank=True, null=True)
    termination_category=models.CharField(choices=termination_category_choices,max_length=30)
    termination_reason = models.TextField(blank=True,null=True)
    notice_period = models.PositiveIntegerField(blank=True,null=True)
    notes = models.TextField(blank=True, null=True)
    
    def upload_path(instance, filename):
        # Construct the upload path with the employee's first name
        return f'media/{instance.employee.first_name}/termination_attachments/{filename}'
    
    attachment = models.FileField(upload_to=upload_path, blank=True, null=True)
    
    def __str__(self):
        return f"Termination Request ID: {self.id} - Employee: {self.employee}"
    def save(self, *args, **kwargs):
        current_datetime = datetime.datetime.now()
        if self.status == "Close":
            self.employee.is_active = False
            self.employee.position.open_position = True
            self.employee.position.save()
            employee_positions = PositionAssignment.objects.filter(Q(employee=self.employee) & Q(active=True))
            for emp in employee_positions:
                emp.assignment_end = current_datetime
                emp.active = False
                self.employee.save()
                 # You should call save() on each instance, not just the last one
        super(TerminationRequest, self).save(*args, **kwargs)
