from django.db import models
from HR_Setups.models import HRCelanderYear
from employee_basic_information.models import Job, Employee
from competent_authority.models import *
from django.core.exceptions import ValidationError

class RatingModel(models.Model):
    TYPE_CHOICES = [
        ('Points', 'Points'),
        ('Likert Scale', 'Likert Scale'),
    ]
    name = models.CharField(max_length=50)
    description = models.TextField()
    year = models.ForeignKey(HRCelanderYear, models.PROTECT)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    class Meta:
        unique_together = ['year', 'type']
    def __str__(self):
        return f"{self.type} - {self.year}"
class RatingTypeLikertScale(models.Model):
    rating_model = models.ForeignKey(
        RatingModel,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        limit_choices_to={'type': 'Likert Scale'}
    )
    percentile_range = models.CharField(max_length=50)
    grade = models.CharField(max_length=50)
    def __str__(self):
        return f"Likert Scale - {self.percentile_range}"
class RatingTypePoints(models.Model):
    TYPE_CHOICES = [
        ('system generated', 'system generated'),
        ('reporting officer', 'reporting officer'),
        ('counter signing officer', 'counter signing officer'),
    ]
    rating_model = models.ForeignKey(
        RatingModel,
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        limit_choices_to={'type': 'Points'}
    )
    category = models.CharField(max_length=50)
    max_points = models.IntegerField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    api = models.BooleanField(default=False, blank=True, null=True)
    api_address = models.CharField(max_length=100, blank=True, null=True)
    def __str__(self):
        return self.category

class AARprescribedForm(models.Model):
    job = models.OneToOneField(Job, models.SET_NULL, null=True)
    head_office = models.BooleanField(default=False)
    def __str__(self):
        return str(self.job)
class AARProcess(models.Model):
    status_choices = (
        ('In process', 'In process'),
        ('Completed', 'Completed')
    )
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT)
    year = models.ForeignKey(HRCelanderYear, models.PROTECT)
    aar_apply_Date = models.DateField(auto_now=True)
    notes = models.TextField(blank=True,null=True)
    attachments = models.ImageField(upload_to='media/aar_process',blank=True,null=True)
    job_description = models.TextField(blank=True,null=True)
    brief_achievements = models.TextField(blank=True,null=True)
    status = models.CharField(max_length=20, choices=status_choices, default='In process')
    def __str__(self):
        return f"AAR Process for {self.employee} - {self.year}"
    def save(self, *args, **kwargs):
        super(AARProcess,self).save(*args, **kwargs)
        if self.status=='In process':
            emp_job = self.employee.position.job
            res = AARprescribedForm.objects.filter(job=emp_job)
            if not res:
                r_m_a_list=RatingModel.objects.filter(year=self.year)
                if not r_m_a_list:
                    raise ValidationError("Performance Rating Model Doesn't exsist..")
                else:
                    for model in r_m_a_list:
                        if model.type == "Points":
                            r_t_p = RatingTypePoints.objects.filter(rating_model=model)
                            for i in r_t_p: 
                                if i.api:
                                    # call an API to calculate marks and store in below var
                                    api_point = 0
                                    instance = RatingTypePointsAssignment(
                                        aar_request_id=self,
                                        category=i.category,
                                        max_points=i.max_points,
                                        point_earned=api_point,
                                        employee=self.employee
                                    )
                                    instance.save()
                                else:
                                    instance = RatingTypePointsAssignment(
                                        aar_request_id=self,
                                        category=i.category,
                                        max_points=i.max_points,
                                        employee=self.employee,
                                    )
                                    instance.save()
                        AARReportingOfficerApproval.objects.create(visible=True,aar_process=self,reporting_officer=self.employee.reporting_officer if self.employee.reporting_officer else None)
                        AARCounterAssigningOfficerApproval.objects.create(aar_process=self,counter_assigning_officer=self.employee.counter_assigning_officer if self.employee.counter_assigning_officer else None)
                     

            else:
                AARHOReportingOfficerApproval.objects.create(visible=True,aar_process=self,reporting_officer=self.employee.reporting_officer if self.employee.reporting_officer else None)
                AARHOCounterAssigningOfficerApproval.objects.create(aar_process=self,counter_assigning_officer=self.employee.counter_assigning_officer if self.employee.counter_assigning_officer else None)         
        super(AARProcess,self).save(*args, **kwargs)
class AARReportingOfficerApproval(models.Model):
    STATUS_CHOICES = [
        ("In Process", "In Process"),
        ("Approved", "Approved"),
    ]
    aar_process=models.ForeignKey(AARProcess, on_delete=models.PROTECT)
    reporting_officer=models.ForeignKey(Employee, on_delete=models.PROTECT,related_name="AARReportingOfficerApproval",blank=True,null=True)
    visible=models.BooleanField(default=False)
    over_All_grading=models.ForeignKey(RatingTypeLikertScale,on_delete=models.PROTECT,blank=True,null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="In Process")
    
    def __str__(self):
        return f"Annual Assessment Reporting Officer Approval for {self.aar_process} - {self.reporting_officer}"
    
    def save(self, *args, **kwargs):
        if self.status == "Approved":
            self.visible = False
            AARCounterAssigningOfficerApproval.objects.filter(aar_process=self.aar_process).update(visible=True)
        super(AARReportingOfficerApproval,self).save(*args, **kwargs)
        
    
class AARCounterAssigningOfficerApproval(models.Model):
    STATUS_CHOICES = [
        ("In Process", "In Process"),
        ("Refer to Competent Authority", "Refer to Competent Authority"),
        ("Approved", "Approved"),
    ]
    SERVICE_LEVEL_CHOICES = [
        ('very_good', 'Very Good'),
        ('good', 'Good'),
        ('average', 'Average'),
        ('below_average', 'Below Average'),
    ]
    aar_process=models.ForeignKey(AARProcess, on_delete=models.PROTECT)
    counter_assigning_officer=models.ForeignKey(Employee, on_delete=models.PROTECT,related_name="AARCounterAssigningOfficerApproval",blank=True,null=True)
    honest = models.BooleanField(blank=True,null=True)
    visible=models.BooleanField(default=False)
    reported_as_corrupt =models.BooleanField(blank=True,null=True)
    service_level = models.CharField(max_length=50, choices=SERVICE_LEVEL_CHOICES,blank=True,null=True)
    pen_picture_countersigning_officer = models.TextField(blank=True,null=True)
    useful = models.BooleanField(blank=True,null=True)
    status = models.CharField(max_length=36, choices=STATUS_CHOICES, default="In Process")
    
    
    def __str__(self):
        return f"Annual Assessment Counter Assigning Officer Approval for {self.aar_process} - {self.counter_assigning_officer}"
    def save(self, *args, **kwargs):
        if self.status == "Refer to Competent Authority":
            self.visible = False
            DG=CompetentAuthority.objects.filter(designation='DG').first()
            if DG:
                related_authority=Employee.objects.filter(position=DG.employee_position).first()
                if related_authority:
                    AARCompetentAuthorityApproval.objects.create(aar_process=self.aar_process,visible=True,competent_authority=related_authority)
            Hr_Admin=CompetentAuthority.objects.filter(designation='HR ADMIN').first()
            if Hr_Admin:
                related_authority=Employee.objects.filter(position=Hr_Admin.employee_position).first()
                if related_authority:
                    AARCompetentAuthorityApproval.objects.create(aar_process=self.aar_process,visible=True,competent_authority=related_authority)
        elif self.status == "Approved":
            self.visible = False
            self.aar_process.status='Completed'
            self.aar_process.save()
        super(AARCounterAssigningOfficerApproval,self).save(*args, **kwargs)
        
    
class AARCompetentAuthorityApproval(models.Model):
    STATUS_CHOICES = [
        ("In Process", "In Process"),
        ("Approved", "Approved"),
    ]
    aar_process=models.ForeignKey(AARProcess, on_delete=models.PROTECT)
    competent_authority=models.ForeignKey(Employee, on_delete=models.PROTECT,related_name="AARCompetentAuthorityApproval")
    visible=models.BooleanField(default=False)
    compentent_authority_remarks=models.TextField(blank=True, null=True)
    status = models.CharField(max_length=36, choices=STATUS_CHOICES, default="In Process")
    
    def __str__(self):
        return f"AAR Competent Authority Approval for {self.aar_process} - {self.competent_authority}"
    def save(self, *args, **kwargs):
        if self.status == "Approved":
            AARCompetentAuthorityApproval.objects.filter(aar_process=self.aar_process).update(visible=False)
            self.visible = False
            self.aar_process.status='Completed'
            self.aar_process.save()
        super(AARCompetentAuthorityApproval,self).save(*args, **kwargs)
    
    
    
class AARHOReportingOfficerApproval(models.Model):
    STATUS_CHOICES = [
        ("In Process", "In Process"),
        ("Approved", "Approved"),
    ]
    PERFORMANCE_CHOICES = (
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
    )
    OVERALL_GRADE_CHOICES = (
        ('very good', 'Very Good'),
        ('good', 'Good'),
        ('average', 'Average'),
        ('below average', 'Below Average'),
    )
    aar_process=models.ForeignKey(AARProcess, on_delete=models.PROTECT)
    reporting_officer=models.ForeignKey(Employee, on_delete=models.PROTECT,related_name="AARHOReportingOfficerApproval",blank=True,null=True)
    visible=models.BooleanField(default=False)
    officer_performance = models.TextField(blank=True, null=True)
    quality_of_work = models.CharField(max_length=1, choices=PERFORMANCE_CHOICES, blank=True, null=True)
    output_of_work = models.CharField(max_length=1, choices=PERFORMANCE_CHOICES, blank=True, null=True)
    integrity_general = models.CharField(max_length=1, choices=PERFORMANCE_CHOICES, blank=True, null=True)
    integrity_intellectual = models.CharField(max_length=1, choices=PERFORMANCE_CHOICES, blank=True, null=True)
    pen_picture_reporting_officer = models.TextField(blank=True, null=True)
    area_and_level_of_expertise = models.TextField(blank=True, null=True)
    training_and_development_need =  models.BooleanField(blank=True,null=True,default=False)    
    overall_grading = models.CharField(max_length=15, choices=OVERALL_GRADE_CHOICES, blank=True, null=True)
    fitness_for_retention = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="In Process")

    def __str__(self):
        return f"Annual Assessment Head Office Reporting Officer Approval for {self.aar_process} - {self.reporting_officer}"
    def save(self, *args, **kwargs):
        if self.status == "Approved":
            self.visible = False
            AARHOCounterAssigningOfficerApproval.objects.filter(aar_process=self.aar_process).update(visible=True)
        super(AARHOReportingOfficerApproval,self).save(*args, **kwargs)


class AARHOCounterAssigningOfficerApproval(models.Model):
    STATUS_CHOICES = [
        ("In Process", "In Process"),
        ("Refer to Competent Authority", "Refer to Competent Authority"),
        ("Approved", "Approved"),
    ]
    FREQUENCY_CHOICES = (
        ('very frequently', 'Very Frequently'),
        ('frequently', 'Frequently'),
        ('rarely', 'Rarely'),
        ('never', 'Never'),
    )
    ASSESSMENT_QUALITY_CHOICES = (
        ('exaggerated', 'Exaggerated'),
        ('fair', 'Fair'),
        ('biased', 'Biased'),
    )
    visible=models.BooleanField(default=False)
    aar_process=models.ForeignKey(AARProcess, on_delete=models.PROTECT)
    counter_assigning_officer=models.ForeignKey(Employee, on_delete=models.PROTECT,related_name="AARCounterAssigningOfficerApprovals",blank=True,null=True)
    frequency_of_work = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, blank=True, null=True)
    know_the_officer = models.TextField(blank=True, null=True)
    recommendation_for_retention = models.TextField(blank=True, null=True)
    quality_of_assessment = models.CharField(max_length=50, choices=ASSESSMENT_QUALITY_CHOICES, blank=True, null=True)
    status = models.CharField(max_length=36, choices=STATUS_CHOICES, default="In Process")
    def save(self, *args, **kwargs):
        if self.status == "Refer to Competent Authority":
            self.visible = False
            DG=CompetentAuthority.objects.filter(designation='DG').first()
            if DG:
                related_authority=Employee.objects.filter(position=DG.employee_position).first()
                if related_authority:
                    AARCompetentAuthorityApproval.objects.create(aar_process=self.aar_process,visible=True,competent_authority=related_authority)
            Hr_Admin=CompetentAuthority.objects.filter(designation='HR ADMIN').first()
            if Hr_Admin:
                related_authority=Employee.objects.filter(position=Hr_Admin.employee_position).first()
                if related_authority:
                    AARCompetentAuthorityApproval.objects.create(aar_process=self.aar_process,visible=True,competent_authority=related_authority)
        elif self.status == "Approved":
            self.visible = False
            self.aar_process.status='Completed'
            self.aar_process.save()
        super(AARHOCounterAssigningOfficerApproval,self).save(*args, **kwargs)
    
    def __str__(self):
        return f"Annual Assessment Head Counter Assigning Officer Approval for {self.aar_process} - {self.counter_assigning_officer}"

class RatingTypePointsAssignment(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.PROTECT,blank=True,null=True)
    aar_request_id=models.ForeignKey(AARProcess, on_delete=models.CASCADE)
    category = models.CharField(max_length=50)
    max_points = models.IntegerField()
    point_earned = models.IntegerField(blank=True,null=True)
    def __str__(self):
        if self.point_earned is not None:
            return f"{self.category} - Points Earned: {self.point_earned}"
        else:
            return f"{self.category} - Max Points: {self.max_points}"
