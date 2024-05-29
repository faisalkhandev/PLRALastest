from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'transfer-process', TransferProcessViewSet, basename='transfer-process')
router.register(r'transfer-approvals', TransferApprovalsViewSet, basename='transfer-approvals')

urlpatterns = [
     path('', include(router.urls)),
]
