from django.contrib import admin
from payroll.Models.PayrollPeriod import *
from django.apps import apps

# Register all models with custom admin classes
app_models = apps.get_app_config('leave_setup').get_models()
for model in app_models:
    class CustomAdmin(admin.ModelAdmin):
        list_display = [field.name for field in model._meta.fields]
        list_filter = [field.name for field in model._meta.fields]
        search_fields = [field.name for field in model._meta.fields]
    admin.site.register(model, CustomAdmin)