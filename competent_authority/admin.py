from django.contrib import admin
from .models import *
# Register your models here.
@admin.register(CompetentAuthority)
class CompetentAuthorityAdmin(admin.ModelAdmin):
    list_display = ['designation', 'employee_position']
    list_filter = ['designation', 'employee_position']
    search_fields = ['designation']