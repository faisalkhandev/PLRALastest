

from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import *
from rest_framework.routers import DefaultRouter
#creating router
router=DefaultRouter()
router.register("generate-elevation-L2",GenerateElevationL2,basename="GenerateElevationL2")
router.register("promote",PromoteToL2,basename="PromoteToL2")
router.register("generate_pending_elevation",GenerateElevationForPendingEmployees,basename="GenerateElevationForPending")
router.register("getHistory",GetHistory ,basename="GetHistory")
router.register("getDocumentHistory",GetDocHistory ,basename="GetDocumentHistory")

urlpatterns = [
    path('',include(router.urls)),
    path("update_pending_elevation/<int:id>/" , UpdateElevationForPendingEmployees),
    path("getDocument/<int:id>/" , getDocument),
    path("updateEmployeeApprovalDate/" , update_approvalDate),
    path("updateEmployeeStatus/" , update_status),
]