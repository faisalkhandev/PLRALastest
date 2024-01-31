from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()
router.register(r'transfer-rating-types', TransferRatingTypeViewSet)
router.register(r'distance-rating-formulas', DistanceRatingFormulaViewSet)
router.register(r'wedlock-rating-formulas', WedlockRatingFormulaViewSet)
router.register(r'tenure-rating-formulas', TenureRatingFormulaViewSet)
router.register(r'disability-rating-formulas', DisabilityRatingFormulaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
