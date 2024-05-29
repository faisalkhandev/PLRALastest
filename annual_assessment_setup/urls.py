from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'rating-models', views.RatingModelViewSet)
router.register(r'rating-type-likert-scales', views.RatingTypeLikertScaleViewSet)
router.register(r'rating-type-points', views.RatingTypePointsViewSet)
router.register(r'aar-prescribed-forms', views.AARprescribedFormViewSet)
router.register(r'aar-processes', views.AARProcessViewSet)
router.register(r'rating-type-points-assignments', views.RatingTypePointsAssignmentViewSet)
router.register(r'AARCompetentAuthorityApprovalViewSet', views.AARCompetentAuthorityApprovalViewSet)
router.register(r'aar-processesList', views.AARProcessListViewSet)
router.register("aar_reporting_officer_approval", views.AARReportingOfficerApprovalViewSet, basename="aar_reporting_officer_approval")
router.register("aar_counter_assigning_officer_approval", views.AARCounterAssigningOfficerApprovalViewSet, basename="aar_counter_assigning_officer_approval")
router.register("aarho_reporting_officer_approval", views.AARHOReportingOfficerApprovalViewSet, basename="aarho_reporting_officer_approval")
router.register("aarho_counter_assigning_officer_approval", views.AARHOCounterAssigningOfficerApprovalViewSet, basename="aarho_counter_assigning_officer_approval")
urlpatterns = [
    path('', include(router.urls)),
    path('check-job/<int:employee_id>/', views.CheckJobViewset.as_view(), name='check-job'),


]
