from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(LeaveDependency)
admin.site.register(LeaveType)
admin.site.register(SalaryDeductible)
admin.site.register(LeaveApply)
admin.site.register(LeaveDependableDetail)
admin.site.register(LeaveNonDependableDetail)
admin.site.register(AccrueTable)
admin.site.register(LeaveDependableBucket)
admin.site.register(LeaveApprovals)
admin.site.register(Approvals)
admin.site.register(LeaveCount)
admin.site.register(SuperApprovals)