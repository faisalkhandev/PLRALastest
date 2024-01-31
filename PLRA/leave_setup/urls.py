from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Creating router
router = DefaultRouter()
router.register("LeaveSetupAPI", LeaveSetupAPI, basename="LeaveSetupAPI")
router.register("LeaveTypeAPI", LeaveTypeAPI, basename="LeaveTypeAPI")
router.register("LeaveApplyAPI", LeaveApplyAPI, basename="LeaveApplyAPI")
router.register("LeaveDependableDetailAPI", LeaveDependableDetailAPI, basename="LeaveDependableDetailAPI")
router.register("LeaveDependencyAPI", LeaveDependencyAPI, basename="LeaveDependencyAPI")
router.register("LeaveDependableBucketAPI", LeaveDependableBucketAPI, basename="LeaveDependableBucketAPI")
router.register("SalaryDeductibleAPI", SalaryDeductibleAPI, basename="SalaryDeductibleAPI")
router.register('leave-count', LeaveCountAPI)
router.register('leave-approvals', LeaveApprovalsAPI)
router.register('approvals', ApprovalsAPI)
router.register('super-approvals', SuperApprovalsAPI)
router.register('LeaveListApi', LeaveApplyWithApprovalsAPI, basename="LeaveApplyWithApprovalsAPI")
# router.register('leave-balances', LeaveBalancesAPIView, basename='leave-balances')


# Add registration for other view classes here

urlpatterns = [
    path('', include(router.urls)),
    path('leave-balances/<int:employee_id>/', LeaveBalancesAPIView.as_view(), name='leave-balances'),
    # path('LeaveListApi', LeaveApplyWithApprovalsAPI.as_view()),

    # Add more URL patterns if needed
]