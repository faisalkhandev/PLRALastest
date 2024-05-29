from django.contrib import admin
from .models import *
# Register your models here.
class TransferProcessAdmin(admin.ModelAdmin):
    list_display = ('employee', 'status', 'transfer_apply_date', 'transfer_category')
    list_filter = ('status', 'transfer_category')
    search_fields = ('employee__name', 'transfer_category')
class TransferApprovalsAdmin(admin.ModelAdmin):
    list_display = ('transfer_process_employee', 'status',)

    def transfer_process_employee(self, obj):
        return obj.transfer_process.employee

    transfer_process_employee.short_description = 'Employee Name'

admin.site.register(TransferApprovals, TransferApprovalsAdmin)
admin.site.register(Transfer_Process, TransferProcessAdmin)