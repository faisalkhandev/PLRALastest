from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(RatingModel)
class RatingModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'year', 'type')

@admin.register(RatingTypeLikertScale)
class RatingTypeLikertScaleAdmin(admin.ModelAdmin):
    list_display = ('rating_model', 'percentile_range', 'grade')

@admin.register(RatingTypePoints)
class RatingTypePointsAdmin(admin.ModelAdmin):
    list_display = ('rating_model', 'category', 'max_points', 'type', 'api')

@admin.register(AARprescribedForm)
class AARprescribedFormAdmin(admin.ModelAdmin):
    list_display = ('job', 'head_office')

@admin.register(RatingTypePointsAssignment)
class RatingTypePointsAssignmentAdmin(admin.ModelAdmin):
    list_display = ('employee', 'aar_request_id', 'category', 'max_points', 'point_earned')

@admin.register(AARReportingOfficerApproval)
class AARReportingOfficerApprovalAdmin(admin.ModelAdmin):
    list_display = ('aar_process', 'reporting_officer', 'visible', 'over_All_grading', 'status')

@admin.register(AARCounterAssigningOfficerApproval)
class AARCounterAssigningOfficerApprovalAdmin(admin.ModelAdmin):
    list_display = ('aar_process', 'counter_assigning_officer', 'honest', 'visible', 'status')

@admin.register(AARCompetentAuthorityApproval)
class AARCompetentAuthorityApprovalAdmin(admin.ModelAdmin):
    list_display = ('aar_process', 'competent_authority', 'visible', 'status')

@admin.register(AARHOReportingOfficerApproval)
class AARHOReportingOfficerApprovalAdmin(admin.ModelAdmin):
    list_display = ('aar_process', 'reporting_officer', 'visible', 'overall_grading', 'status')

@admin.register(AARHOCounterAssigningOfficerApproval)
class AARHOCounterAssigningOfficerApprovalAdmin(admin.ModelAdmin):
    list_display = ('aar_process', 'counter_assigning_officer', 'frequency_of_work', 'visible', 'status')
@admin.register(AARProcess)
class AARProcessAdmin(admin.ModelAdmin):
    list_display = ('employee', 'year', 'aar_apply_Date', 'attachments', 'status','is_head_office')