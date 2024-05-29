
from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter
#creating router
router=DefaultRouter()
router.register("NocTypeAPI",NocTypeAPI,basename="NocTypeAPI")
router.register("NocProcessAPI",NocProcessAPI,basename="NocProcessAPI")
router.register("NocProcessListAPI",NocProcessListAPI,basename="NocProcessListAPI")
router.register("NOCApprovalsAPI",NOCApprovalsAPI,basename="NOCApprovalsAPI")
urlpatterns = [
    path('',include(router.urls)),

]