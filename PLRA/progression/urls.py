from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import *
from rest_framework.routers import DefaultRouter
#creating router
router=DefaultRouter()
router.register("generate_pending_progression",GeneratePendingProgressions,basename="GeneratePendingProgressions")
router.register("promote-progression",PromoteProgression,basename="promote")
router.register("approvals-progression",Approvals,basename="Approvals")
router.register("approvals-history",ApprovalsHistory,basename="history")
router.register(r'get_positions/(?P<id>\d+)',get_positions,basename="pos")

urlpatterns = [
    path('',include(router.urls)),
    path("update_pending_progression/<int:id>/" , UpdateProgressionForPendingEmployees),
    path("getDocument/<int:id>/" , getDocument),
    path("generate-progression/<int:id>/" , GenerateProgression),
    path("updateEmployeeApprovalDate/" , update_approvalDate),
    path("updateEmployeeStatus/" , update_status),
    # path("get_positions/<int:id>/" , get_positions.as_view()),
    path("updatePosition/<int:id>/<int:position>/", updatePosition)
]