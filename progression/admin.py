from django.contrib import admin
from progression.models import *

# Register your models here.
admin.site.register(ProgressionDocument)
admin.site.register(ProgressionEmployee)
admin.site.register(PendingProgression)