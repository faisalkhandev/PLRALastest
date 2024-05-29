from django.contrib import admin
from .models import *
# Register your models here.
@admin.register(InquiryOutcomes)
class InquiryOutcomesAdmin(admin.ModelAdmin):
    list_display = ['inquiry_name', 'inquiry_description']

@admin.register(InquiryType)
class InquiryTypeAdmin(admin.ModelAdmin):
    list_display = ['inquiryoutcomes', 'category_name', 'nature']

@admin.register(DisciplinaryProceedingRequest)
class DisciplinaryProceedingRequestAdmin(admin.ModelAdmin):
    list_display = ['employee', 'inquiry_reason', 'prob_officer', 'regular_inquiry_officer', 'inquiry_start_date', 'inquiry_status', 'inquiry_type']
    list_filter = ['inquiry_status', 'inquiry_type']
    search_fields = ['employee__first_name', 'employee__last_name']

@admin.register(ProbeOfficerApproval)
class ProbeOfficerApprovalAdmin(admin.ModelAdmin):
    list_display = ['disciplinary_proceeding_request', 'approving_authority', 'status']
    list_filter = ['status']

@admin.register(DGFirstApproval)
class DGApprovalFirstAdmin(admin.ModelAdmin):
    list_display = ['disciplinary_proceeding_request', 'approving_authority', 'probe_allegation_status', 'probe_allegation_date']
    list_filter = ['probe_allegation_status']

@admin.register(RegularInquiryOfficerApproval)
class RegularInquiryOfficerApprovalAdmin(admin.ModelAdmin):
    list_display = ['disciplinary_proceeding_request', 'approving_authority', 'status', 'issuance_of_inquiry_order_date', 'issuance_of_inquiry_report_date']
    list_filter = ['status']

@admin.register(HRUserApproval)
class HRUserApprovalAdmin(admin.ModelAdmin):
    list_display = ['disciplinary_proceeding_request', 'approving_authority', 'status', 'issuance_of_personal_hearing_notice_date', 'alert_date']
    list_filter = ['status']

@admin.register(DirectorHrApproval)
class DirectorHrApprovalAdmin(admin.ModelAdmin):
    list_display = ['disciplinary_proceeding_request', 'approving_authority', 'status', 'issuance_of_final_order_date', 'attachment_of_final_order', 'inquiry_outcome', 'inquiry_type']
    list_filter = ['status']

@admin.register(DGFinalApproval)
class DGFinalApprovalAdmin(admin.ModelAdmin):
    list_display = ['disciplinary_proceeding_request', 'approving_authority', 'inquiry_outcome', 'inquiry_type', 'status']
    list_filter = ['status']