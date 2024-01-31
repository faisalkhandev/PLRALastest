from django.contrib import admin
from .models import *

class TransferRatingTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    search_fields = ('name', 'category')

class DistanceRatingFarmulaAdmin(admin.ModelAdmin):
    list_display = ('name', 'formula_type', 'category', 'within_district_per_km_marks', 'within_district_max_marks', 'across_district_per_km_marks', 'from_km', 'across_district_max_marks', 'allow_district_fixed_marks')
    search_fields = ('name', 'formula_type__name', 'category')

class WedlockRatingFarmulaAdmin(admin.ModelAdmin):
    list_display = ('name', 'formula_type', 'category', 'within_district_fixed_marks', 'max_marks', 'across_district_fixed_marks')
    search_fields = ('name', 'formula_type__name', 'category')

class TenureRatingFarmulaAdmin(admin.ModelAdmin):
    list_display = ('name', 'formula_type', 'category', 'max_marks', 'minimum_tenure_months', 'total_tenure_months', 'factor', 'total_month_served')
    search_fields = ('name', 'formula_type__name', 'category')

class DisabilityRatingFarmulaAdmin(admin.ModelAdmin):
    list_display = ('name', 'formula_type', 'category', 'max_marks')
    search_fields = ('name', 'formula_type__name', 'category')

class SameDistrictRestrictionRuleAdmin(admin.ModelAdmin):
    list_display = ('rule_rec_id', 'restriction_job')
    search_fields = ('rule_rec_id', 'restriction_job__name')

class TransferRatingModelAdmin(admin.ModelAdmin):
    list_display = ('rating_model_rec_id', 'description', 'year', 'active', 'total_marks')
    search_fields = ('rating_model_rec_id', 'description', 'year', 'active', 'total_marks')

class TransferRatingModelTypeAdmin(admin.ModelAdmin):
    list_display = ('model', 'type', 'tranfer_type_category', 'max_marks')
    search_fields = ('model__description', 'type__name', 'tranfer_type_category')

class E_Transfer_Window_PeriodAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'from_date', 'to_date', 'status')
    search_fields = ('name', 'description', 'from_date', 'to_date', 'status', 'open_position__name')

class E_Transfer_ProcessAdmin(admin.ModelAdmin):
    list_display = ('e_transfer_rec_id', 'employee', 'status', 'e_transfer_apply_date', 'transfer_position', 'transfer_category', 'attachments', 'new_joining_date', 'e_transfer_approval_date')
    search_fields = ('employee__first_name', 'employee__last_name', 'status', 'transfer_position__name', 'transfer_category')

class ConcernOfficerApprovalAdmin(admin.ModelAdmin):
    list_display = ('e_transfer_process', 'visible', 'max_marks', 'marks_obtain', 'e_transfer_approval_date', 'new_joining_effective_date', 'remarks', 'status')
    search_fields = ('e_transfer_process__employee__first_name', 'e_transfer_process__employee__last_name', 'max_marks', 'marks_obtain', 'e_transfer_approval_date', 'new_joining_effective_date', 'remarks', 'status')
class HRDirectorETransferApprovalAdmin(admin.ModelAdmin):
    list_display = ('e_transfer_process', 'visible', 'max_marks', 'marks_obtain', 'e_transfer_approval_date', 'new_joining_effective_date', 'remarks', 'status')
    search_fields = ('e_transfer_process__employee__first_name', 'e_transfer_process__employee__last_name', 'max_marks', 'marks_obtain', 'e_transfer_approval_date', 'new_joining_effective_date', 'remarks', 'status')

class E_Transfer_Rating_MatrixAdmin(admin.ModelAdmin):
    list_display = ('employee', 'e_transfer_process', 'category', 'max_marks', 'system_generated_marks', 'concerned_person_marks')
    search_fields = ('employee__first_name', 'employee__last_name', 'e_transfer_process__status', 'category', 'max_marks', 'system_generated_marks', 'concerned_person_marks')

class AddressAdmin(admin.ModelAdmin):
    list_display = ('address_line', 'latitude', 'longitude', 'address_line2', 'latitude2', 'longitude2', 'distance')
    search_fields = ('address_line', 'latitude', 'longitude', 'address_line2', 'latitude2', 'longitude2', 'distance')

# Register your models with the custom admin classes
admin.site.register(TransferRatingType, TransferRatingTypeAdmin)
admin.site.register(DistanceRatingFarmula, DistanceRatingFarmulaAdmin)
admin.site.register(WedlockRatingFarmula, WedlockRatingFarmulaAdmin)
admin.site.register(TenureRatingFarmula, TenureRatingFarmulaAdmin)
admin.site.register(DisabilityRatingFarmula, DisabilityRatingFarmulaAdmin)
admin.site.register(SameDistrictRestrictionRule, SameDistrictRestrictionRuleAdmin)
admin.site.register(TransferRatingModel, TransferRatingModelAdmin)
admin.site.register(TransferRatingModelType, TransferRatingModelTypeAdmin)
admin.site.register(E_Transfer_Window_Period, E_Transfer_Window_PeriodAdmin)
admin.site.register(E_Transfer_Process, E_Transfer_ProcessAdmin)
admin.site.register(ConcernOfficerApproval, ConcernOfficerApprovalAdmin)
admin.site.register(HRDirectorETransferApproval, HRDirectorETransferApprovalAdmin)
admin.site.register(E_Transfer_Rating_Matrix, E_Transfer_Rating_MatrixAdmin)
admin.site.register(Address, AddressAdmin)
