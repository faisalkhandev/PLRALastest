from django.contrib import admin
from .models import TerminationRequest, TerminationApprovals

class TerminationRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'employee', 'status', 'case_initiation_date']
    list_filter = ['status']
    search_fields = ['employee__first_name', 'employee__last_name']

admin.site.register(TerminationRequest, TerminationRequestAdmin)

class TerminationApprovalsAdmin(admin.ModelAdmin):
    list_display = ['id', 'termination_request', 'approving_authority', 'order', 'visible']
    list_filter = ['status', 'visible']
    search_fields = ['employee__first_name', 'employee__last_name']

admin.site.register(TerminationApprovals, TerminationApprovalsAdmin)