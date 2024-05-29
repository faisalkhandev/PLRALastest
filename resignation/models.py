from django.db import models
from datetime import datetime
from competent_authority.models import CompetentAuthority
from employee_basic_information.models import Employee,Wing
from django.core.exceptions import ValidationError

class ResignationRequest(models.Model):
    id = models.CharField(max_length=20, primary_key=True, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    
    STATUS_CHOICES = (
        ('In process', 'In process'),
        ('Approved', 'Approved'),
        ("Withdraw", "Withdraw"),
        ('Rejected', 'Rejected'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='In process')
    case_initiation_date = models.DateField(auto_now=True)
    resignation_reason = models.TextField()
    notice_period = models.PositiveIntegerField()
    
    def clean(self):
        # Check if the employee has already applied for resignation with status 'In process'
        existing_resignation = ResignationRequest.objects.filter(
            employee=self.employee,
            status='In process'
        ).exclude(
            id=self.id
        )
        if existing_resignation.exists():
            raise ValidationError("You have already applied for resignation with status 'In process'.")
    
    def upload_path(instance, filename):
        # Construct the upload path with the employee's first name
        return f'media/{instance.employee.first_name}/resignation_attachments/{filename}'
    
    attachment = models.FileField(upload_to=upload_path, blank=True, null=True)
    def __str__(self):
        return f"Resignation Request ID: {self.id} - Employee: {self.employee}"
    def save(self, *args, **kwargs):
        if self.pk and self.status=="Withdraw":
            existing_Approvals=ResignationApprovals.objects.filter(resignation_request=self)
            for approval in existing_Approvals:
                approval.visible=False
                approval.status="Withdraw"
                approval.save()
            super(ResignationRequest, self).save(*args, **kwargs)
        if not self.id:
            last_id = ResignationRequest.objects.all().order_by('id').last()
            if last_id:
                self.id = 'PLRA_RESIGN_' + str(int(last_id.id.split('_')[-1]) + 1).zfill(4)
            else:
                self.id = 'PLRA_RESIGN_0001'
            super(ResignationRequest, self).save(*args, **kwargs)

            ResignationApprovals.objects.create(resignation_request=self, approving_authority=self.employee.reporting_officer, order=1,visible=True,approving_authority_designation='REPORTING OFFICER')
            hr_user_position=CompetentAuthority.objects.filter(designation='HR DIRECTOR').first()
            related_approving_authority_hr_user=Employee.objects.filter(position=hr_user_position.employee_position).first()
            ResignationApprovals.objects.create(resignation_request=self, approving_authority=related_approving_authority_hr_user, order=2,approving_authority_designation='HR DIRECTOR')
            
            related_approving_adg=Employee.objects.filter(position=self.employee.position.wing.adg).first()
            ResignationApprovals.objects.create(resignation_request=self, approving_authority=related_approving_adg, order=3,approving_authority_designation='ADG')
            
            dg_position=CompetentAuthority.objects.filter(designation='DG').first()
            related_approving_authority=Employee.objects.filter(position=dg_position.employee_position).first()
            ResignationApprovals.objects.create(resignation_request=self, approving_authority=related_approving_authority, order=4,approving_authority_designation='DG')
        super(ResignationRequest, self).save(*args, **kwargs)
    
class ResignationApprovals(models.Model):
    resignation_request=models.ForeignKey(ResignationRequest, on_delete=models.PROTECT, related_name='resignation_approvals')
    approving_authority=models.ForeignKey(Employee, on_delete=models.PROTECT)
    approving_authority_designation=models.CharField( max_length=50)
    status_date=models.DateField(blank=True,null=True)
    order=models.PositiveIntegerField(default=1)
    resignation_effective_date = models.DateField(blank=True, null=True)
    visible=models.BooleanField(default=False)
    comments=models.TextField(blank=True,null=True)
    status=models.CharField( max_length=50,
        choices=[
            ('Pending', 'Pending'),
            ("Withdraw", "Withdraw"),
            ('Approved', 'Approved'),
            ('Rejected', 'Rejected'),
            ('-', '-'),
        ],default='Pending')
    def __str__(self):
        return f"{self.resignation_request} approved by {self.approving_authority} "
    def save(self,*args, **kwargs):
        try:
            if self.status=='Approved':
                self.visible=False
                self.status_date=datetime.now().date()
                next_approval=ResignationApprovals.objects.filter(resignation_request=self.resignation_request,order__gt=self.order).first()
                if next_approval:
                    next_approval.visible=True
                    next_approval.save()
                else:
                    related_instance=ResignationRequest.objects.get(id=self.resignation_request.id)
                    related_instance.status='Approved'
                    related_instance.save()
                   
            if self.status=='Rejected':
                next_approval=ResignationApprovals.objects.filter(resignation_request=self.resignation_request,order__gt=self.order).first()
                if next_approval:
                    next_approval.status="-"
                    next_approval.save()
                self.visible=False
                self.status_date=datetime.now().date()
                related_instance=ResignationRequest.objects.get(id=self.resignation_request.id)
                related_instance.status='Rejected'
                related_instance.save()
                
                   
        except ResignationApprovals.DoesNotExist:
            pass
        super(ResignationApprovals, self).save(*args, **kwargs)
