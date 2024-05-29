from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'transfer-rating-types', TransferRatingTypeViewSet)
router.register(r'transfer-rating-model', TransferRatingModelView)
router.register(r'distance-rating-formulas', DistanceRatingFormulaViewSet)
router.register(r'distance-rating-formulas-types', TransferRatingModelTypeView)
router.register(r'wedlock-rating-formulas', WedlockRatingFormulaViewSet)
router.register(r'wedlock-rating-formulas', WedlockRatingFormulaViewSet)
router.register(r'tenure-rating-formulas', TenureRatingFormulaViewSet)
router.register(r'disability-rating-formulas', DisabilityRatingFormulaViewSet)
router.register(r'E_Transfer_ProcessViewSet', E_Transfer_ProcessViewSet)
router.register(r'E_Transfer_Window_PeriodViewSet', E_Transfer_Window_PeriodViewSet)
router.register(r'ConcernOfficerApprovalViewSet', ConcernOfficerApprovalViewSet)
router.register(r'HRDirectorETransferApprovalViewSet', HRDirectorETransferApprovalViewSet)
router.register(r'ApplyPositionsViewSet', ApplyPositionsViewSet)
router.register(r'SameDistrictRule', SameDistrictRestrictionRuleViewSet)
router.register(r'ratingmatrix', E_Transfer_Rating_MatrixViewSet)
router.register(r'positions_available_for_window', PositionsAvailableForWindow)

urlpatterns = [
    path('', include(router.urls)),
    path('update_status/<int:id>/<str:status>/', update_Status),
    path('mark_employee/<int:id>/', mark_employee),
    path('process/<int:positionid>/', proceed),
    path('getConcernOfficerApprovalViewSetById/<int:pos>/', ConcernOfficerApprovalViewSetByPositionId),
    path('processFinalApproval/<int:approval_id>/<str:dat>/<int:approved_process>/', processFinalApproval)
]