from django.db import models
from employee_basic_information.models import Employee
class ResignationRequest(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    
    STATUS_CHOICES = (
        ('In process', 'In process'),
        ('Close', 'Close'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='In process')
    
    case_initiation_date = models.DateField(auto_now=True)
    resignation_effective_date = models.DateField(blank=True, null=True)
    resignation_reason = models.TextField()
    notice_period = models.PositiveIntegerField()
    notes = models.TextField(blank=True, null=True)
    
    def upload_path(instance, filename):
        # Construct the upload path with the employee's first name
        return f'media/{instance.employee.first_name}/resignation_attachments/{filename}'
    
    attachment = models.FileField(upload_to=upload_path, blank=True, null=True)
    def __str__(self):
        return f"Resignation Request ID: {self.id} - Employee: {self.employee}"