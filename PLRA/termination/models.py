from datetime import datetime
from django.db import models
from django.db.models import Q
from competent_authority.models import CompetentAuthority
from employee_basic_information.models import Employee,PositionAssignment
from django.core.exceptions import ValidationError

class TerminationRequest(models.Model):
    id = models.CharField(max_length=20, primary_key=True, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    
    STATUS_CHOICES = (
        ('In process', 'In process'),
        ("Withdraw", "Withdraw"),
        ('Closed', 'Closed'),
    )
    termination_category_choices = (
        ('Compulsory Retirement', 'Compulsory Retirement'),
        ('Removal from service', 'Removal from service'),
        ('Dismissal from service', 'Dismissal from service'),
        ('Deceased', 'Deceased'),
    )
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='In process')
    
    case_initiation_date = models.DateField(auto_now=True)
    termination_category=models.CharField(choices=termination_category_choices,max_length=30)
    termination_reason = models.TextField()
    notice_period = models.PositiveIntegerField()
    
    def clean(self):
        # Check if the employee has already applied for termination with status 'In process'
        existing_termination = TerminationRequest.objects.filter(
            employee=self.employee,
            status='In process'
        ).exclude(
            id=self.id
        )
        if existing_termination.exists():
            raise ValidationError("You have already applied for termination with status 'In process'.")
    
    def upload_path(instance, filename):
        # Construct the upload path with the employee's first name
        return f'media/{instance.employee.first_name}/termination_attachments/{filename}'
    
    attachment = models.FileField(upload_to=upload_path)
    
    def __str__(self):
        return f"Termination Request ID: {self.id} - Employee: {self.employee}"
    def save(self, *args, **kwargs):
        current_datetime = datetime.now()
        if self.pk and self.status=="Withdraw":
            existing_Approvals=TerminationApprovals.objects.filter(termination_request=self)
            for approval in existing_Approvals:
                approval.visible=False
                approval.status="Withdraw"
                approval.save()
            super(TerminationRequest , self).save(*args, **kwargs)
        if not self.id:
            last_id = TerminationRequest.objects.all().order_by('id').last()
            if last_id:
                self.id = 'PLRA_TERMINATE_' + str(int(last_id.id.split('_')[-1]) + 1).zfill(4)
            else:
                self.id = 'PLRA_TERMINATE_0001'
            super(TerminationRequest, self).save(*args, **kwargs)
            
            TerminationApprovals.objects.create(termination_request=self, approving_authority=self.employee.reporting_officer, order=1, visible=True,approving_authority_designation='REPORTING OFFICER')
            hr_user_position=CompetentAuthority.objects.filter(designation='HR DIRECTOR').first()
            related_approving_authority_hr_user=Employee.objects.filter(position=hr_user_position.employee_position).first()
            TerminationApprovals.objects.create(termination_request=self, approving_authority=related_approving_authority_hr_user, order=2,approving_authority_designation='HR DIRECTOR')
            
            print(self.employee.position.wing.adg)
            related_approving_adg=Employee.objects.filter(position=self.employee.position.wing.adg).first()
            TerminationApprovals.objects.create(termination_request=self, approving_authority=related_approving_adg, order=3,approving_authority_designation='ADG')
            dg_position = CompetentAuthority.objects.filter(designation='DG').first()
            related_approving_authority = Employee.objects.filter(position=dg_position.employee_position).first()
            TerminationApprovals.objects.create(termination_request=self, approving_authority=related_approving_authority, order=4,approving_authority_designation='DG')
        
      
        super(TerminationRequest, self).save(*args, **kwargs)

class TerminationApprovals(models.Model):
    termination_request = models.ForeignKey(TerminationRequest, on_delete=models.PROTECT,related_name='termination_approvals')
    approving_authority = models.ForeignKey(Employee, on_delete=models.PROTECT)
    approving_authority_designation=models.CharField( max_length=50)
    status_date = models.DateField(blank=True, null=True)
    order = models.PositiveIntegerField(default=1)
    termination_effective_date = models.DateField(blank=True, null=True)
    visible = models.BooleanField(default=False)
    comments = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=50,
        choices=[
            ('Pending', 'Pending'),
            ('Approved', 'Approved'),
            ('Rejected', 'Rejected'),
            ("Withdraw", "Withdraw"),

        ],
        default='Pending'
    )

    def __str__(self):
        return f"{self.termination_request} approved by {self.approving_authority} "

    def save(self, *args, **kwargs):
        try:
            if self.status == 'Approved':
                self.visible = False
                self.status_date = datetime.now().date()
                next_approval = TerminationApprovals.objects.filter(termination_request=self.termination_request, order__gt=self.order).first()
                if next_approval:
                    next_approval.visible = True
                    next_approval.save()
                else:
                    related_instance = TerminationRequest.objects.get(id=self.termination_request.id)
                    related_instance.status = 'Closed'
                    related_instance.save()

        except TerminationApprovals.DoesNotExist:
            pass
        super(TerminationApprovals, self).save(*args, **kwargs)