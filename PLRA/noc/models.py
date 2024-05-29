from django.db import models
from datetime import datetime
from competent_authority.models import CompetentAuthority
from disciplinary_proceedings_setup.models import DisciplinaryProceedingRequest
from employee_basic_information.models import Employee
from django.core.exceptions import ValidationError
# Create your models here.
class NocType(models.Model):
    noc_rec_id = models.IntegerField(primary_key=True)
    noc_type = models.CharField(max_length=50)
    def __str__(self) -> str:
        return self.noc_type
    class Meta:
        verbose_name = 'NOC Type'
class NocProcess(models.Model):
    CHOICES = (
        ("In Process", "In Process"),
        ("Issued", "Issued"),
        ("Withdraw", "Withdraw"),
        ("Not Issued", "Not Issued")
    )
    id = models.CharField(max_length=20, primary_key=True, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='employeeForNoc')
    status = models.CharField(max_length=20, choices=CHOICES, default='In process')
    noc_apply_date = models.DateField(auto_now=True)
    noc_type = models.ForeignKey(NocType, on_delete=models.PROTECT, related_name='noc_types')
    attachments = models.FileField(upload_to='media/NOC',blank=True,null=True)

    def clean(self) -> None:
        # Check if the employee has already initiated NocProcess with status 'In process'
        existing_noc_process = NocProcess.objects.filter(
            employee=self.employee,
            status='In process',
            noc_type=self.noc_type
        ).exclude(
            id=self.id
        )
        if existing_noc_process.exists():
            raise ValidationError("You have already initiated NocProcess with status 'In process' for this NocType.")
        # Check the employee's disciplinary record
        disciplinary_record = DisciplinaryProceedingRequest.objects.filter(
            inquiry_type__category_name='Dismissal from Service',
            employee=self.employee
        ).first()

        if disciplinary_record:
            raise ValidationError(
                f"Alert: Disciplinary Preceeding found against  {self.employee.first_name} {self.employee.last_name} . "
                "Employee is subject to Dismissal from service."
            )
        disciplinary_record = DisciplinaryProceedingRequest.objects.filter(
            inquiry_type__category_name='Removal Form Service',
            employee=self.employee
        ).first()

        # if disciplinary_record:
        #     raise ValidationError(
        #         f"Alert: Disciplinary record found for {self.employee}. "
        #         "Employee is subject to Removal from service."
        #     ) 
        # disciplinary_record = DisciplinaryProceedingRequest.objects.filter(
        #     inquiry_type__category_name='Compulsory Retirement',
        #     employee=self.employee
        # ).first()

        # if disciplinary_record:
        #     raise ValidationError(
        #         f"Alert: Disciplinary record found for {self.employee}. "
        #         "Employee is subject to Compulsory Retirement."
        #     )

        return super().clean()
    def save(self, *args, **kwargs):
        self.clean()
        if self.pk and self.status=="Withdraw":
            existing_Approvals=NocApprovals.objects.filter(resignation_request=self)
            for approval in existing_Approvals:
                approval.visible=False
                approval.status="Withdraw"
                approval.save()
            super(NocProcess, self).save(*args, **kwargs)
        if not self.id:
            last_id = NocProcess.objects.all().order_by('id').last()
            if last_id:
                self.id = 'PLRA_NOC_' + str(int(last_id.id.split('_')[-1]) + 1).zfill(4)
            else:
                self.id = 'PLRA_NOC_0001'
            super(NocProcess, self).save(*args, **kwargs)
            # hr_user=CompetentAuthority.objects.filter(designation='HR User').first()
            # related_approving_authority_hr_user=Employee.objects.filter(position=hr_user.employee_position).first()
            # NocApprovals.objects.create(noc_request=self, approving_authority=related_approving_authority_hr_user, order=1,visible=True,approving_authority_designation='HR User')
            hr_position=CompetentAuthority.objects.filter(designation='HR DIRECTOR').first()
            related_approving_authority=Employee.objects.filter(position=hr_position.employee_position).first()
            NocApprovals.objects.create(noc_request=self, approving_authority=related_approving_authority,visible=True, order=1,approving_authority_designation='HR Director')
        super(NocProcess, self).save(*args, **kwargs)
    noc_middle_body_text = models.TextField()
class NocApprovals(models.Model):
    noc_request=models.ForeignKey(NocProcess, on_delete=models.PROTECT,related_name='noc_approvals')
    approving_authority=models.ForeignKey(Employee, on_delete=models.PROTECT)
    approving_authority_designation=models.CharField( max_length=50)
    status_date=models.DateField(blank=True,null=True)
    order=models.PositiveIntegerField(default=1)
    visible=models.BooleanField(default=False)
    comments=models.TextField(blank=True,null=True)
    status=models.CharField( max_length=50,
        choices=[
            ('Pending', 'Pending'),
            ('Approved', 'Approved'),
            ("Withdraw", "Withdraw"),
            ('Rejected', 'Rejected'),
        ],default='Pending')
    def __str__(self):
        return f"{self.noc_request} approved by {self.approving_authority} "
    def save(self,*args, **kwargs):
        try:
            if self.status=='Approved':
                self.visible=False
                self.status_date=datetime.now().date()
                next_approval=NocApprovals.objects.filter(noc_request=self.noc_request,order__gt=self.order).first()
                if next_approval:
                    next_approval.visible=True
                    next_approval.save()
                else:
                    related_instance=NocProcess.objects.get(id=self.noc_request.id)
                    related_instance.status='Issued'
                    related_instance.save()
            if self.status=='Rejected':
                self.visible=False
                self.status_date=datetime.now().date()
                related_instance=NocProcess.objects.get(id=self.noc_request.id)
                related_instance.status='Not Issued'
                related_instance.save()
        except NocApprovals.DoesNotExist:
            pass
        super(NocApprovals, self).save(*args, **kwargs)
