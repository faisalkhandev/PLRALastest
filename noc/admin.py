# admin.py

from django.contrib import admin
from .models import NocType, NocProcess, NocApprovals
from import_export.admin import ImportExportModelAdmin
from .resource import ReportResource  

class NocTypeAdmin(admin.ModelAdmin):
    search_fields = ['noc_type']
    list_display = ['noc_type']

admin.site.register(NocType, NocTypeAdmin)

class NocProcessAdmin(ImportExportModelAdmin):
    resource_class = ReportResource
    search_fields = ['employee__full_name', 'noc_type__noc_type', 'noc_middle_body_text']
    list_display = ['id','employee', 'noc_apply_date', 'noc_type', 'noc_middle_body_text','status']
    list_filter = ['noc_type', 'noc_apply_date']

admin.site.register(NocProcess, NocProcessAdmin)

class NocApprovalsAdmin(admin.ModelAdmin):
    search_fields = ['noc_request__employee__full_name', 'approving_authority__full_name','visible']
    list_display = ['noc_request', 'approving_authority', 'status', 'status_date','visible']
    list_filter = ['status', 'visible', 'status_date']

admin.site.register(NocApprovals, NocApprovalsAdmin)
