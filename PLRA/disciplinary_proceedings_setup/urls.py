from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Creating router
router = DefaultRouter()
router.register("InquiryOutcomesAPI", InquiryOutcomesAPI, basename="InquiryOutcomesAPI")
router.register("InquiryTypeAPI", InquiryTypeAPI, basename="InquiryTypeAPI")
router.register("DisciplinaryProceedingInquiryAPI", DisciplinaryProceedingInquiryAPI, basename="DisciplinaryProceedingInquiryAPI")
router.register("probeofficerapproval", ProbeOfficerApprovalViewSet,basename="probeofficerapproval")
router.register("dgfirstapproval", DGFirstApprovalViewSet,basename="dgfirstapproval")
router.register("regularinquiryofficerapproval", RegularInquiryOfficerApprovalViewSet,basename="regularinquiryofficerapproval")
router.register("hruserapproval", HRUserApprovalViewSet,basename="hruserapproval")
router.register("directorhrapproval", DirectorHrApprovalViewSet,basename="directorhrapproval")
router.register("dgfinalapproval", DGFinalApprovalViewSet,basename="dgfinalapproval")
# Add registration for other view classes here

urlpatterns = [
    path('', include(router.urls)),
    # Add more URL patterns if needed
]