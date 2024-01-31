from django.urls import path,include
from HR_Setups.views import *
from rest_framework.routers import DefaultRouter
#creating router
router=DefaultRouter()
router.register("hr-celander-year", HRCelanderYearAPI ,basename="HRCelanderYearAPI")
router.register("hr-add-holiday", HolidayAPI ,basename="add_holiday")

urlpatterns = [
    path('',include(router.urls)),
]