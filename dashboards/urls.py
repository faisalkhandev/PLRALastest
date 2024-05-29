
from django.urls import path
from .views import *
urlpatterns = [
    path('process-counts/', EmployeeMiniDashboard.as_view(), name='process-counts'),
    path('approval-counts/', EmployeeApprovalCounts.as_view(), name='approval-counts'),
    path('current-date/', CurrentDateAPI.as_view(), name='current-date'),
    path('get_dashboard_count/', get_dashboard_count)
]