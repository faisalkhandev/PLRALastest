from django.contrib import admin
from.models import *
from django.contrib.admin import ModelAdmin

class ResignationRequestAdmin(ModelAdmin):
    list_display = ['id', 'employee', 'status', 'case_initiation_date']
    list_filter = ['status']
    search_fields = ['employee__first_name', 'employee__last_name']

admin.site.register(ResignationRequest, ResignationRequestAdmin)
class ResignationApprovalsAdmin(ModelAdmin):
    list_display = ['id', 'resignation_request', 'approving_authority','order','visible']
    list_filter = ['status','visible']
    search_fields = ['employee__first_name', 'employee__last_name']

admin.site.register(ResignationApprovals, ResignationApprovalsAdmin)

