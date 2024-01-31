from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
# Register your models here.
admin.site.register(Employee)
admin.site.register(Sub_Wing)
admin.site.register(JobLevelValidity)
admin.site.register(PositionAssignment)
admin.site.register(JobLevelAssignment)
admin.site.register(Wing)
admin.site.register(District)
admin.site.register(Division)
admin.site.register(Region)
admin.site.register(Tehsil)
admin.site.register(Center)
admin.site.register(Job)
admin.site.register(PositionType)
admin.site.register(Position)
admin.site.register(Ppg_Level_Setup)
admin.site.register(ApprovalMatrix)
admin.site.register(Employee_Title)
admin.site.register(JobLevel)