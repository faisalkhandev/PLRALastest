from django.db import models
from employee_basic_information.models import Employee
from datetime import datetime, timedelta
from django.core.exceptions import ValidationError
from termination.models import TerminationRequest
from competent_authority.models import *
# Create your models here.
class InquiryOutcomes(models.Model):
    inquiry_type=models.CharField(max_length=20)
    inquiry_description=models.TextField()
    def __str__(self):
        return self.inquiry_type
    
class InquiryType(models.Model):
    inquiryoutcomes = models.ForeignKey(InquiryOutcomes, on_delete=models.PROTECT)
    category_name = models.CharField(max_length=30)
    nature = models.CharField(max_length=50, choices=(('No Input', 'No Input'), ('Date', 'Date'), ('Amount', 'Amount')))

    def __str__(self):
        return f"{self.inquiryoutcomes.inquiry_type}---{self.category_name} - {self.get_nature_display()}"

    
    
#process of Disciplinary proceedings    

class DisciplinaryProceedingRequest(models.Model):
    INQUIRY_STATUS_CHOICES = [
        ('In process', 'In process'),
        ('Closed', 'Closed'),
    ]
    ALLEGATION_STATUS_CHOICES = [
        ('Proved', 'Proved'),
        ('Unproved', 'Unproved'),
    ]
    INQUIRY_REASON_CHOICES = [
        ('Intelligence report', 'Intelligence report'),
        ('Complaint', 'Complaint'),
        ('Corruption', 'Corruption'),
        ('Misconduct', 'Misconduct'),
        ('Inefficiency', 'Inefficiency'),
        ('Reference from DC/AC', 'Reference from DC/AC'),
        ('Other', 'Other'),
    ]
    

    employee = models.ForeignKey(Employee, on_delete=models.PROTECT, related_name='DisciplinaryProceedingRequest')
    inquiry_reason = models.CharField(max_length=50, choices=INQUIRY_REASON_CHOICES)
    remarks_for_other_inquiry_reason = models.TextField(null=True,blank=True)
    prob_officer=models.ForeignKey(Employee, on_delete=models.PROTECT,related_name='DisciplinaryProceedingRequest_prob_officer')
    regular_inquiry_officer=models.ForeignKey(Employee, on_delete=models.PROTECT,related_name='DisciplinaryProceedingRequest_regular_inquiry_officer')
    inquiry_start_date = models.DateField(null=True, blank=True)
    inquiry_status = models.CharField(max_length=20, choices=INQUIRY_STATUS_CHOICES, default='In process')
    allegation_status = models.CharField(max_length=20, choices=ALLEGATION_STATUS_CHOICES, blank=True)


    def save(self, *args, **kwargs):
        if self.inquiry_start_date is None:
            self.inquiry_start_date=datetime.now() 
       # Make request for ProbeOfficerApproval
        if self.inquiry_start_date and self.inquiry_status == 'In process':
                ProbeOfficerApproval.objects.create(
                    disciplinary_proceeding_request=self,
                    approving_authority=self.prob_officer,
                    alert_date = self.inquiry_start_date + timedelta(days=15)
                )

        super(DisciplinaryProceedingRequest,self).save(*args, **kwargs)
class ProbeOfficerApproval(models.Model):
    # Fields specific to Probe Officer
    STATUS= [
        ('Pending', 'Pending'),
        ('Refer to DG', 'Refer to DG'),
    ]
    disciplinary_proceeding_request=models.ForeignKey(DisciplinaryProceedingRequest, on_delete=models.PROTECT,related_name="ProbeOfficerApproval")
    approving_authority=models.ForeignKey(Employee, on_delete=models.PROTECT,related_name="ProbeOfficerApproval")
    issuance_of_probe_report_date = models.DateField(blank=True, null=True)
    attachment_of_probe_report = models.FileField(upload_to='probe_reports/', blank=True)
    status = models.CharField(max_length=20, choices=STATUS, blank=True,default='Pending')
    alert_date=models.DateField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.attachment_of_probe_report :
            self.issuance_of_probe_report_date=datetime.now().date()
        if self.attachment_of_probe_report  and self.status=='Refer to DG':
            self.issuance_of_probe_report_date=datetime.now().date()
      # Make an instance of DGApproval model
        try:
            dg_approving_authority = Employee.objects.get(position=CompetentAuthority.objects.get(designation='DG').employee_position)
            dg_approval = DGFirstApproval.objects.create(
                disciplinary_proceeding_request=self.disciplinary_proceeding_request,
                approving_authority=dg_approving_authority,  # Assuming DG is a Competent Authority
            )
            dg_approval.save()

        except Employee.DoesNotExist:
        # Handle the case where approving authority doesn't exist
            print("Error: Approving authority not found in ProbeOfficerApproval.")
            raise ValidationError('Error: Approving authority not found in CompetentAuthority.')
            
        super(ProbeOfficerApproval,self).save(*args, **kwargs)

class DGFirstApproval(models.Model):
    ALLEGATION_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Proved', 'Proved'),
        ('Unproved', 'Unproved'),
    ]
    # Fields specific to DG (Director General)
    disciplinary_proceeding_request=models.ForeignKey(DisciplinaryProceedingRequest, related_name="DGFirstApproval",on_delete=models.PROTECT)
    approving_authority=models.ForeignKey(Employee, related_name="DGFirstApproval",on_delete=models.PROTECT)
    probe_allegation_status = models.CharField(max_length=20, choices=ALLEGATION_STATUS_CHOICES, blank=True,default='Pending')
    probe_allegation_date = models.DateField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if self.probe_allegation_status != "Pending":
            self.probe_allegation_date = datetime.now().date()
        # If status is 'Proved', make HRUserApproval
            if self.probe_allegation_status == 'Proved':
                try:
                    hr_user_approving_authority = Employee.objects.get(position=CompetentAuthority.objects.get(designation='HR User').employee_position)
                    HRUserApproval.objects.create(
                        disciplinary_proceeding_request=self.disciplinary_proceeding_request,
                        alert_date=self.probe_allegation_date + timedelta(days=7),
                        approving_authority=hr_user_approving_authority,
                        # Add other relevant information
                    )
                except CompetentAuthority.DoesNotExist:
                # Handle the case where approving authority doesn't exist
                    print("Error: Approving authority not found in CompetentAuthority.")
                    raise ValidationError('Error: Approving authority not found in CompetentAuthority.')

            # If status is 'Unproved', make InquiryOfficerApproval
            elif self.probe_allegation_status == 'Unproved':
                RegularInquiryOfficerApproval.objects.create(
                    disciplinary_proceeding_request=self.disciplinary_proceeding_request,
                    approving_authority=self.disciplinary_proceeding_request.regular_inquiry_officer,
                    alert_date_inquiry_order=self.probe_allegation_date + timedelta(days=20),
                    alert_date_inquiry_report=self.probe_allegation_date + timedelta(days=60),
                    
                    # Add other relevant information
                )
        super(DGFirstApproval,self).save(*args, **kwargs)


class RegularInquiryOfficerApproval(models.Model):
    # Fields specific to Regular Inquiry Officer
    STATUS= [
        ('Pending', 'Pending'),
        ('Refer to Director HR', 'Refer to Director HR'),
        ('Refer to DG', 'Refer to DG'),
    ]
    disciplinary_proceeding_request=models.ForeignKey(DisciplinaryProceedingRequest, related_name="RegularInquiryOfficer",on_delete=models.PROTECT)
    approving_authority=models.ForeignKey(Employee, related_name="RegularInquiryOfficer",on_delete=models.PROTECT)
    issuance_of_inquiry_order_date=models.DateField(blank=True, null=True)
    attachment_of_inquiry_order=models.FileField(upload_to='inquiry_order/', blank=True)
    alert_date_inquiry_order=models.DateField(blank=True, null=True)
    alert_date_inquiry_report=models.DateField(blank=True, null=True)
    issuance_of_inquiry_report_date=models.DateField(blank=True, null=True)
    attachment_of_inquiry_report=models.FileField(upload_to='inquiry_report/', blank=True)
    status = models.CharField(max_length=20, choices=STATUS, blank=True,default='Pending')
    def clean(self):
        if not self.attachment_of_inquiry_report:
            # If attachment_of_inquiry_report is not provided, status should remain 'Pending'
            if self.status != 'Pending':
                raise ValidationError("Cannot change status without attaching an inquiry report.")


    def save(self, *args, **kwargs):
        # If attachment_of_inquiry_order is provided, set issuance_of_inquiry_order_date to current date
        if self.attachment_of_inquiry_order and not self.issuance_of_inquiry_order_date:
            self.issuance_of_inquiry_order_date = datetime.now().date()

        # If attachment_of_inquiry_report is provided, set issuance_of_inquiry_report_date to current date
        if self.attachment_of_inquiry_report and not self.issuance_of_inquiry_report_date:
            self.issuance_of_inquiry_report_date = datetime.now().date()

        if self.status != "Pending":
            self.issuance_of_inquiry_report_date = datetime.now().date()
        if self.status == 'Refer to Director HR':
                try:
                    hr_director_approving_authority = Employee.objects.get(position=CompetentAuthority.objects.get(designation='HR DIRECTOR').employee_position)
                    director_hr_approval = DirectorHrApproval.objects.create(
                    disciplinary_proceeding_request=self.disciplinary_proceeding_request,
                    approving_authority=hr_director_approving_authority,
                    alert_date=self.issuance_of_inquiry_report_date+ timedelta(days=60)
                    )
                except Employee.DoesNotExist:
                    print("Error: Approving authority not found in CompetentAuthority.")
                    raise ValidationError('Error: Approving authority not found in CompetentAuthority.')
        if self.status == 'Refer to DG':
            try:
                dg_authority = Employee.objects.get(position=CompetentAuthority.objects.get(designation='DG').employee_position)
                DGApproval.objects.create(
                    disciplinary_proceeding_request=self.disciplinary_proceeding_request,
                    approving_authority=dg_authority,
                    alert_date=self.issuance_of_inquiry_report_date+ timedelta(days=60)
                    )
            except Employee.DoesNotExist:
                print("Error: Approving authority not found in CompetentAuthority.")
                raise ValidationError('Error: Approving authority not found in CompetentAuthority.')
        super(RegularInquiryOfficerApproval,self).save(*args, **kwargs)
class HRUserApproval(models.Model):
    # Fields specific to HR
    STATUS= [
        ('Pending', 'Pending'),
        ('Refer to Director HR', 'Refer to Director HR'),
    ]
    disciplinary_proceeding_request=models.ForeignKey(DisciplinaryProceedingRequest, related_name="HRUserApproval",on_delete=models.PROTECT)
    approving_authority=models.ForeignKey(Employee, related_name="HRUserApproval",on_delete=models.PROTECT)
    issuance_of_personal_hearing_notice_date = models.DateField(blank=True, null=True)
    alert_date=models.DateField(blank=True, null=True)
    attachment_of_personal_hearing_notice = models.FileField(upload_to='hearing_notices/', blank=True)
    status = models.CharField(max_length=20, choices=STATUS, blank=True,default='Pending')

    def save(self, *args, **kwargs):
        if self.status == 'Refer to Director HR':
            # Make request of Director HR Approval
            try:
                hr_director_approving_authority = Employee.objects.get(position=CompetentAuthority.objects.get(designation='HR DIRECTOR').employee_position)
                director_hr_approval = DirectorHrApproval.objects.create(
                disciplinary_proceeding_request=self.disciplinary_proceeding_request,
                approving_authority=hr_director_approving_authority,
                alert_date=self.issuance_of_personal_hearing_notice_date+ timedelta(days=7)
                )
            except Employee.DoesNotExist:
                print("Error: Approving authority not found in CompetentAuthority.")
                raise ValidationError('Error: Approving authority not found in CompetentAuthority.')
            
            
        super(HRUserApproval,self).save(*args, **kwargs)

    
class DirectorHrApproval(models.Model):
    # Fields specific to Director HR
    STATUS= [
        ('Pending', 'Pending'),
        ('Refer to DG', 'Refer to DG'),
        ('Closed', 'Closed'),
    ]
    disciplinary_proceeding_request=models.ForeignKey(DisciplinaryProceedingRequest, related_name="DirectorHrApproval",on_delete=models.PROTECT)
    approving_authority=models.ForeignKey(Employee, related_name="DirectorHrApproval",on_delete=models.PROTECT)
    alert_date=models.DateField(blank=True, null=True)
    issuance_of_final_order_date = models.DateField(blank=True, null=True)
    attachment_of_final_order = models.FileField(upload_to='final_orders/', blank=True)
    inquiry_outcome = models.ForeignKey(InquiryOutcomes, on_delete=models.PROTECT, blank=True, null=True)
    inquiry_type = models.ForeignKey(InquiryType, on_delete=models.PROTECT, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS, blank=True,default='Pending')
    def clean(self):
        if self.inquiry_type and self.inquiry_outcome and self.status == 'Refer to DG':
            raise ValidationError("Cannot choose 'Refer to DG' when both inquiry type and outcome are provided.")
        elif not self.inquiry_type and not self.inquiry_outcome and self.status == 'Closed':
            raise ValidationError("Cannot Close Case without choosing  both inquiry type.")
        elif not self.issuance_of_final_order_date and self.status != 'Closed':
            raise ValidationError("Cannot Close Case without choosing  both inquiry type.")
    def save(self, *args, **kwargs):
        # Check if status is 'Closed' and update DisciplinaryProceedingRequest status
        if self.status == 'Closed':
            self.disciplinary_proceeding_request.inquiry_status = 'Closed'
            self.disciplinary_proceeding_request.save()
        if self.status=='Refer to DG':
            DGFinalApproval.objects.create(
                disciplinary_proceeding_request=self.disciplinary_proceeding_request,
                approving_authority=self.approving_authority,
            )
        super(DirectorHrApproval, self).save(*args, **kwargs)


class DGApproval(models.Model):
    # Fields specific to Director HR
    STATUS= [
        ('Pending', 'Pending'),
        ('Refer to Hr Director', 'Refer to Hr Director'),
        ('Closed', 'Closed'),
    ]
    disciplinary_proceeding_request=models.ForeignKey(DisciplinaryProceedingRequest, related_name="DGApproval",on_delete=models.PROTECT)
    approving_authority=models.ForeignKey(Employee, related_name="DGApproval",on_delete=models.PROTECT)
    alert_date=models.DateField(blank=True, null=True)
    issuance_of_final_order_date = models.DateField(blank=True, null=True)
    attachment_of_final_order = models.FileField(upload_to='final_orders/', blank=True)
    inquiry_outcome = models.ForeignKey(InquiryOutcomes, on_delete=models.PROTECT, blank=True, null=True)
    inquiry_type = models.ForeignKey(InquiryType, on_delete=models.PROTECT, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS, blank=True,default='Pending')
    def clean(self):
        if self.inquiry_type and self.inquiry_outcome and self.status == 'Refer to Hr Director':
            raise ValidationError("Cannot choose 'Refer to Hr Director' when both inquiry type and outcome are provided.")
        elif not self.inquiry_type and not self.inquiry_outcome and self.status == 'Closed':
            raise ValidationError("Cannot Close Case without choosing  both inquiry type.")
      
    def save(self, *args, **kwargs):
        # Check if status is 'Closed' and update DisciplinaryProceedingRequest status
        if self.status == 'Closed':
            self.disciplinary_proceeding_request.inquiry_status = 'Closed'
            self.disciplinary_proceeding_request.save()
        if self.status=='Refer to Hr Director':
            try:
                hr_director_approving_authority = Employee.objects.get(position=CompetentAuthority.objects.get(designation='HR DIRECTOR').employee_position)
                director_hr_approval = DirectorHrApproval.objects.create(
                    disciplinary_proceeding_request=self.disciplinary_proceeding_request,
                    approving_authority=hr_director_approving_authority,
                    alert_date=self.alert_date
                    )
            except Employee.DoesNotExist:
                    print("Error: Approving authority not found in CompetentAuthority.")
                    raise ValidationError('Error: Approving authority not found in CompetentAuthority.')

        super(DGApproval, self).save(*args, **kwargs)

class DGFinalApproval(models.Model):
    STATUS= [
        ('Pending', 'Pending'),
        ('Closed', 'Closed'),
    ]
    disciplinary_proceeding_request=models.ForeignKey(DisciplinaryProceedingRequest, related_name="DGFinalApproval",on_delete=models.PROTECT)
    approving_authority=models.ForeignKey(Employee, related_name="DGFinalApproval",on_delete=models.PROTECT)
    inquiry_outcome = models.ForeignKey(InquiryOutcomes, on_delete=models.PROTECT, blank=True, null=True)
    inquiry_type = models.ForeignKey(InquiryType, on_delete=models.PROTECT, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS, blank=True,default='Pending')
    def save(self, *args, **kwargs):
        # Check if status is 'Closed' and update DisciplinaryProceedingRequest status
        if self.status == 'Closed':
            self.disciplinary_proceeding_request.inquiry_status = 'Closed'
            self.disciplinary_proceeding_request.save()

        super(DirectorHrApproval, self).save(*args, **kwargs)