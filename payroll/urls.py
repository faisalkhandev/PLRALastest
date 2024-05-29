
from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter
#creating router
router=DefaultRouter()
router.register("TransactionTypeSetupAPI",TransactionTypeSetupAPI,basename="TransactionTypeSetupAPI")
router.register("PayrollSetupAPI",PayrollSetupAPI,basename="PayrollSetupAPI")
urlpatterns = [
    path('',include(router.urls)),

]