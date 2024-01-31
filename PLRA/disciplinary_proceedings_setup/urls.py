from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Creating router
router = DefaultRouter()
router.register("InquiryOutcomesAPI", InquiryOutcomesAPI, basename="InquiryOutcomesAPI")
router.register("InquiryTypeAPI", InquiryTypeAPI, basename="InquiryTypeAPI")
# router.register("DisciplinaryProceedingInquiryAPI", DisciplinaryProceedingInquiryAPI, basename="DisciplinaryProceedingInquiryAPI")

# Add registration for other view classes here

urlpatterns = [
    path('', include(router.urls)),
    # Add more URL patterns if needed
]