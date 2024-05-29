from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from import_export.admin import ImportExportModelAdmin
from .resource import *  
# Register your models here.

class EmployeeAdmin(ImportExportModelAdmin):
    resource_class = EmployeeResource
    list_display = ['id', 'cnic','employee_no', 'first_name', 'last_name', 'father_name', 'passport_number', 'domicile_district', 'phoneNumber', 'employee_image', 'employee_cnic_image_front', 'employee_cnic_image_back', 'employee_domicile_image', 'title', 'date_of_joining', 'service_duration', 'center', 'position', 'reporting_officer', 'counter_assigning_officer', 'is_staff', 'is_active', 'is_superuser']
    search_fields = ['cnic', 'first_name', 'last_name', 'father_name', 'passport_number', 'domicile_district', 'phoneNumber', 'title', 'date_of_joining', 'service_duration']
    list_filter = ['is_staff', 'is_active', 'is_superuser', 'date_of_joining']

admin.site.register(Employee, EmployeeAdmin)

class Sub_WingAdmin(ImportExportModelAdmin):
    resource_class = SubWingResource
    list_display = ['sw_rec_id', 'sub_wind_id', 'sub_wing_name', 'wing']
    search_fields = ['sub_wind_id', 'sub_wing_name']
    list_filter = ['wing']

admin.site.register(Sub_Wing, Sub_WingAdmin)

class JobLevelValidityAdmin(ImportExportModelAdmin):
    resource_class = JobLevelValidityResource
    list_display = ['job_level', 'validity']
    search_fields = ['job_level__job_abbrivation', 'validity']
    list_filter = ['job_level', 'validity']

admin.site.register(JobLevelValidity, JobLevelValidityAdmin)

class PositionAssignmentAdmin(ImportExportModelAdmin):
    resource_class = PositionAssignmentResource
    list_display = ['employee', 'position', 'assignment_start', 'assignment_end', 'primary_position', 'months_in_position', 'active']
    search_fields = ['employee__first_name', 'position__position_id', 'assignment_start', 'assignment_end']
    list_filter = ['employee', 'position', 'assignment_start', 'assignment_end', 'primary_position', 'active']

admin.site.register(PositionAssignment, PositionAssignmentAdmin)



class WingAdmin(ImportExportModelAdmin):
    resource_class = WingResource
    list_display = ['w_rec_id', 'wing_id', 'wing_name', 'director_concern_position', 'adg', 'search_name', 'operating_unit_type']
    search_fields = ['wing_id', 'wing_name', 'search_name', 'operating_unit_type']
    list_filter = ['operating_unit_type']

admin.site.register(Wing, WingAdmin)

class DistrictAdmin(ImportExportModelAdmin):
    resource_class = DistrictResource
    list_display = ['district_rec_id', 'district_id', 'district_name', 'division']
    search_fields = ['district_id', 'district_name']
    list_filter = ['division']

admin.site.register(District, DistrictAdmin)

class DivisionAdmin(ImportExportModelAdmin):
    resource_class = DivisionResource
    list_display = ['d_rec_id', 'division_id', 'division_name', 'region']
    search_fields = ['division_id', 'division_name']
    list_filter = ['region']

admin.site.register(Division, DivisionAdmin)

class RegionAdmin(ImportExportModelAdmin):
    resource_class = RegionResource
    list_display = ['r_rec_id', 'region_id', 'region_name']
    search_fields = ['region_id', 'region_name']

admin.site.register(Region, RegionAdmin)

class TehsilAdmin(ImportExportModelAdmin):
    resource_class = TehsilResource
    list_display = ['t_rec_id', 't_id', 't_name', 'district']
    search_fields = ['t_id', 't_name']
    list_filter = ['district']

admin.site.register(Tehsil, TehsilAdmin)
class CenterAdmin(ImportExportModelAdmin):
    resource_class = CenterResource
    list_display = ['c_rec_id', 'center_id', 'center_name', 'region', 'division', 'district', 'tehsil', 'la_mapping', 'rr_mapping']
    search_fields = ['center_id', 'center_name', 'la_mapping', 'rr_mapping']
    list_filter = ['region', 'division', 'district', 'tehsil']

admin.site.register(Center, CenterAdmin)

class PositionTypeAdmin(ImportExportModelAdmin):
    resource_class = PositionTypeResource
    list_display = ['p_t_rec_id', 'position_type_name']
    search_fields = ['position_type_name']

admin.site.register(PositionType, PositionTypeAdmin)

class PpgLevelSetupAdmin(ImportExportModelAdmin):
    resource_class = PpgLevelSetupResource
    list_display = ['ppg_rec_id', 'ppg_level', 'ppg_level_seniority']
    search_fields = ['ppg_level', 'ppg_level_seniority']
    list_filter = ['ppg_level', 'ppg_level_seniority']

admin.site.register(Ppg_Level_Setup, PpgLevelSetupAdmin)



class JobAdmin(admin.ModelAdmin):
    list_display = ['j_rec_id', 'job_id', 'job_title', 'job_abbrivation', 'ppg_level']
    # Ensure other necessary admin options are included here

admin.site.register(Job, JobAdmin)

class JobLevelAdmin(ImportExportModelAdmin):
    resource_class = JobLevelResource
    list_display = ['j_l_rec_id', 'job', 'job_abbrivation', 'job_abbrivation_seniority']
    search_fields = ['job__job_id', 'job_abbrivation', 'job_abbrivation_seniority']
    list_filter = ['job', 'job_abbrivation', 'job_abbrivation_seniority']

admin.site.register(JobLevel, JobLevelAdmin)

class PositionAdmin(ImportExportModelAdmin):
    resource_class = PositionResource
    list_display = ['p_rec_id', 'position_id','position_desc', 'job', 'position_id', 'no_of_position', 'location', 'wing', 'sub_wing', 'position_type', 'open_position', 'position_active', 'full_time_equivalent']
    search_fields = ['position_desc', 'job__job_id', 'position_id', 'no_of_position', 'location', 'wing', 'sub_wing', 'position_type', 'open_position', 'position_active', 'full_time_equivalent']
    list_filter = ['job', 'location', 'wing', 'sub_wing', 'position_type', 'open_position', 'position_active', 'full_time_equivalent']

admin.site.register(Position, PositionAdmin)

class JobLevelAssignmentAdmin(ImportExportModelAdmin):
    resource_class = JobLevelAssignmentResource
    list_display = ['employee', 'job_level', 'assignment_start', 'assignment_end', 'months_in_position', 'active']
    search_fields = ['employee__first_name', 'job_level__job_abbrivation', 'assignment_start', 'assignment_end']
    list_filter = ['employee', 'job_level', 'assignment_start', 'assignment_end', 'active']

admin.site.register(JobLevelAssignment, JobLevelAssignmentAdmin)

class ApprovalMatrixAdmin(ImportExportModelAdmin):
    resource_class = ApprovalMatrixResource
    list_display = ['a_m_rec_id', 'position', 'reporting_position', 'counter_assigning_position', 'dg_admin']
    search_fields = ['position__position_id', 'reporting_position__position_id', 'counter_assigning_position__position_id', 'dg_admin__position_id']
    list_filter = ['position', 'reporting_position', 'counter_assigning_position', 'dg_admin']

admin.site.register(ApprovalMatrix, ApprovalMatrixAdmin)

class EmployeeTitleAdmin(ImportExportModelAdmin):
    resource_class = EmployeeTitleResource
    list_display = ['e_t_rec_id', 'employee_title']
    search_fields = ['employee_title']

admin.site.register(Employee_Title, EmployeeTitleAdmin)
class EmployeePayrollClassAdmin(ImportExportModelAdmin):
    resource_class = EmployeePayrollClassResource
    list_display = ['name', 'description']
    search_fields = ['name','description']

admin.site.register(EmployeePayrollClass, EmployeePayrollClassAdmin)
