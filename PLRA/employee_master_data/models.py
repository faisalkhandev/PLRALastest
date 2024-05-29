from django.db import models
from django.forms import ValidationError
from django.utils import timezone
from employee_basic_information.models import Employee
from phonenumber_field.modelfields import PhoneNumberField
# from .validators import validate_file_size
# Create your models here.
class Cities(models.Model):
    c_rec_id=models.AutoField(primary_key=True)
    city_name=models.CharField( max_length=50)
    def __str__(self):
        return self.city_name
class District(models.Model):
    district_name=models.CharField( max_length=60)
    def __str__(self):
        return self.district_name
class Tehsil(models.Model):
    district=models.ForeignKey(District, on_delete=models.PROTECT)
    tehsil_name=models.CharField( max_length=60)
    def __str__(self):
        return self.tehsil_name
class Countries(models.Model):
    country_rec_id=models.AutoField(primary_key=True)
    country_name=models.CharField( max_length=50)
    def __str__(self):
        return self.country_name
class PersonalInformation(models.Model):
    SINGLE = 'single'
    MARRIED = 'married'
    MARITAL_STATUS_CHOICES = (
        (SINGLE, 'Single'),
        (MARRIED, 'Married'),
    )
    CHRISTIANITY = 'christianity'
    ISLAM = 'islam'
    HINDUISM = 'hinduism'
    BUDDHISM = 'buddhism'
    JUDAISM = 'judaism'
    OTHER = 'other'
    RELIGION_CHOICES = (
        (CHRISTIANITY, 'Christianity'),
        (ISLAM, 'Islam'),
        (HINDUISM, 'Hinduism'),
        (BUDDHISM, 'Buddhism'),
        (JUDAISM, 'Judaism'),
        (OTHER, 'Other'),
    )
    MALE = 'male'
    FEMALE = 'female'
    OTHER = 'other'
    GENDER_CHOICES = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (OTHER, 'Others'),
    )
    ENGLISH = 'english'
    SPANISH = 'spanish'
    FRENCH = 'french'
    GERMAN = 'german'
    URDU = 'urdu'
    OTHER = 'other'
    LANGUAGE_CHOICES = (
        (ENGLISH, 'English'),
        (SPANISH, 'Spanish'),
        (FRENCH, 'French'),
        (GERMAN, 'German'),
        (URDU, 'Urdu'),
        (OTHER, 'Other'),
    )
    employee=models.OneToOneField(Employee,on_delete=models.PROTECT)
    p_i_id=models.AutoField(primary_key=True)
    marital_status = models.CharField(
        max_length=10,
        choices=MARITAL_STATUS_CHOICES,
        default=SINGLE,
    )
    no_of_dependents=models.IntegerField()
    martial_status_date=models.DateField(blank=True,null=True)
    religion = models.CharField(
        max_length=20,
        choices=RELIGION_CHOICES,
        default=OTHER,
    )
    gender = models.CharField(
        max_length=20,
        choices=GENDER_CHOICES,
        default=OTHER,
    )
    birth_date=models.DateField()
    age=models.CharField(max_length=50,blank=True, null=True)
    deceased_date = models.DateField(blank=True, null=True)
    native_language = models.CharField(
        max_length=20,
        choices=LANGUAGE_CHOICES,
        default=OTHER,blank=True,null=True
    )
    pastport_number=models.CharField(max_length=40,blank=True,null=True)
    eobi_number=models.CharField(max_length=16,blank=True,null=True)
    weight=models.FloatField(blank=True,null=True)
    height=models.FloatField(blank=True,null=True)
    disability_note=models.CharField(max_length=100,blank=True)
    domicel=models.ForeignKey(Cities,on_delete=models.PROTECT,related_name="domicel")
    date_of_superannutation=models.DateField(blank=True,null=True)
    nationality=models.ForeignKey(Countries,on_delete=models.PROTECT)
    birth_city=models.ForeignKey(Cities,on_delete=models.PROTECT)
    class Meta:
        verbose_name="Personal Information"
    def save(self, *args, **kwargs):
        today = timezone.now().date()
        if self.birth_date and self.birth_date <= today:
            duration = today - self.birth_date
            years = duration.days // 365
            months = (duration.days % 365) // 30
            days = (duration.days % 365) % 30
            self.age = f"{years} years, {months} months, {days} days"
        if self.birth_date and self.birth_date <= today:
            year=self.birth_date.year
            year+=60
            print(year)
            self.date_of_superannutation =f'{year}-{self.birth_date.month}-{self.birth_date.day}'
        super(PersonalInformation, self).save(*args, **kwargs)
class FamilyInformation(models.Model):
    FATHER = 'father'
    MOTHER = 'mother'
    SIBLING = 'sibling'
    SPOUSE = 'spouse'
    OTHER = 'other'
    employee=models.ForeignKey(Employee,models.PROTECT)
    full_name=models.CharField(max_length=45)
    RELATION_CHOICES = (
        (FATHER, 'Father'),
        (MOTHER, 'Mother'),
        (SIBLING, 'Sibling'),
        (SPOUSE, 'Spouse'),
        (OTHER, 'Other'),
    )
    fimaly_rec_id=models.AutoField(primary_key=True)
    birth_Date=models.DateField()
    relation = models.CharField(
        max_length=20,
        choices=RELATION_CHOICES,
        default=OTHER,
    )
    is_dependent = models.BooleanField(default=False)
    class Meta:
        verbose_name="Family Information"
    def __str__(self):
        return self.full_name
class EmployeeReferance(models.Model):
    employee=models.ForeignKey(Employee,on_delete=models.PROTECT)
    emp_ref_rec_id=models.AutoField(primary_key=True)
    referance_name=models.CharField(max_length=50)
    SUPERVISOR = 'supervisor'
    EMPLOYER = 'employer'
    COWORKER = 'coworker'
    PROFESSOR = 'professor'
    EMPLOYEE_REFERENCE_CHOICES = (
        (SUPERVISOR, 'Former or Current Supervisor'),
        (EMPLOYER, 'Former or Current Employer'),
        (COWORKER, 'Former or Current Co-worker'),
        (PROFESSOR, 'Former or Current Professor'),
    )
    relation = models.CharField(
        max_length=20,
        choices=EMPLOYEE_REFERENCE_CHOICES,
    )
    company_name=models.CharField(max_length=50)
    Designation=models.CharField(max_length=50)
    years_known=models.IntegerField()
    phoneNumber = PhoneNumberField(region="PK", blank=True)
    company_address=models.CharField(max_length=150)
    class Meta:
        verbose_name='Reference'
    def __str__(self):
        return self.referance_name
class DependentEmploymentHistory(models.Model):
        employee=models.ForeignKey(Employee,on_delete=models.PROTECT)
        spouse_dependent=models.ForeignKey(FamilyInformation, on_delete=models.PROTECT)
        d_e_h_rec_id=models.AutoField(primary_key=True)
        organization_name=models.CharField(max_length=30)
        position_held=models.CharField(max_length=30)
        employment_start_date=models.DateField()
        employment_end_date=models.DateField(blank=True, null=True)
        leaving_reason=models.CharField(max_length=50, blank=True, null=True)
        organization_contact_number=PhoneNumberField(region="PK", blank=True)
        organization_address=models.CharField(max_length=150)
        government_job=models.BooleanField(default=False)
        job_district=models.ForeignKey(District,models.PROTECT)
        class Meta:
            verbose_name='Dependent History'
        def __str__(self):
            return self.organization_name
class EmploymentHistory(models.Model):
        employee=models.ForeignKey(Employee,on_delete=models.PROTECT)
        e_h_rec_id=models.AutoField(primary_key=True)
        organization_name=models.CharField(max_length=30)
        position_held=models.CharField(max_length=30)
        employment_start_date=models.DateField()
        employment_end_date=models.DateField()
        leaving_reason=models.CharField(max_length=50)
        organization_contact_number=PhoneNumberField(region="PK", blank=True)
        organization_address=models.CharField(max_length=150)
        government_job=models.BooleanField(default=False)
        job_district=models.ForeignKey(District,models.PROTECT)
        class Meta:
            verbose_name='History'
        def __str__(self):
            return self.organization_name
class Level_of_Education(models.Model):
    level_of_education_rec_id = models.AutoField(primary_key=True)
    level_of_education = models.CharField(max_length=30)
    description = models.CharField(max_length=30)
class Level_of_Skill(models.Model):
    level_of_skill_rec_id = models.AutoField(primary_key=True)
    level_of_skill = models.CharField(max_length=30)
    description = models.CharField(max_length=30)
class Education(models.Model):
    def upload_path(instance, filename):
        # Construct the upload path with the employee's first name
        return f'media/{instance.employee.first_name+instance.employee.last_name}/Employee-Educations/{filename}'
    employee=models.ForeignKey(Employee,on_delete=models.PROTECT)
    education_rec_id = models.AutoField(primary_key=True)
    education = models.CharField(max_length=30)
    level_of_education = models.ForeignKey(Level_of_Education, models.PROTECT)
    major_subject = models.CharField(max_length=15)
    institution_name = models.CharField(max_length=30)
    institution_country = models.ForeignKey(Countries, models.PROTECT)
    education_start_date = models.DateField()
    education_end_date = models.DateField()
    attachment = models.FileField(upload_to=upload_path,blank=True,null=True)
    grade = models.CharField(max_length=5)
    scale = models.IntegerField()
   
class Training(models.Model):
    employee=models.ForeignKey(Employee,on_delete=models.PROTECT)
    training_rec_id = models.AutoField(primary_key=True)
    training_topic = models.CharField(max_length=200)
    training_nature = models.CharField(max_length=200)
    status = models.CharField(max_length=100)
    training_start_date = models.DateField()
    training_end_date = models.DateField()
    score_required_to_pass = models.CharField(max_length=200)
    obtained_score = models.CharField(max_length=200)
    remarks = models.CharField(max_length=500)
class Skill(models.Model):
    employee=models.ForeignKey(Employee,on_delete=models.PROTECT)
    skill_rec_id = models.AutoField(primary_key=True)
    skill = models.CharField(max_length=50)
    level_of_skill = models.ForeignKey(Level_of_Skill, models.PROTECT)
    skill_date = models.DateField()
    years_of_experience = models.FloatField(max_length=4)
    verified = models.BooleanField()
    verified_by = models.CharField(max_length=30, blank=True, null=True)
    class Meta:
        verbose_name="Skills"
class Personal_Document(models.Model):
    employee=models.ForeignKey(Employee,on_delete=models.PROTECT)
    personal_document_rec_id = models.AutoField(primary_key=True)
    document_type = models.CharField(max_length=25)
    document_name = models.CharField(max_length=25)
    issuance_authority = models.CharField(max_length=25)
    effective_date = models.DateField()
    expiration_date = models.DateField(blank=True, null=True)
    renewal_require = models.BooleanField()
    renewal_date = models.DateField(blank=True, null=True)
    verified = models.BooleanField()
    attachment = models.FileField()
    class Meta:
        verbose_name="Personal Document"
class EmployeeAddress(models.Model):
    employee=models.ForeignKey(Employee,on_delete=models.PROTECT)
    e_a_rec_id=models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    address = models.CharField(max_length=150)
    district = models.ForeignKey(District, on_delete=models.PROTECT)
    tehsil = models.ForeignKey(Tehsil, on_delete=models.PROTECT)
    city = models.ForeignKey(Cities, on_delete=models.PROTECT)
    purpose = models.CharField(max_length=50, choices=(
        ('Home', 'Home'),
        ('Job', 'Job'),
        ('Other', 'Other'),
    ))
    is_primary = models.BooleanField(default=False)
    class Meta:
        verbose_name='Address'
    def __str__(self):
        return self.name
class EmployeeContactInformation(models.Model):
    employee=models.ForeignKey(Employee,on_delete=models.PROTECT)
    e_c_i_rec_id = models.AutoField(primary_key=True)
    purpose = models.CharField(max_length=50, choices=(
        ('Home', 'Home'),
        ('Job', 'Job'),
        ('Other', 'Other'),
    ))
    type = models.CharField(max_length=50,choices=(
        ('Phone', 'Phone'),
        ('Email-Address', 'Email-Address'),
        ('Fax', 'Fax'),
        ('Facebook', 'Facebook'),
        ('Twitter', 'Twitter'),
        ('LinkedIn', 'LinkedIn'),
        ('Telex', 'Telex'),
        ('URL', 'URL'),
    ))
    contact_no_address=models.CharField(max_length=50)
    is_primary = models.BooleanField(default=False)
    class Meta:
        verbose_name='Contact Information'
    def __str__(self):
        return self.purpose
