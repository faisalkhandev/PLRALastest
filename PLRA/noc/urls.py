
from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter
#creating router
router=DefaultRouter()
router.register("NocTypeAPI",NocTypeAPI,basename="NocTypeAPI")
router.register("NocProcessAPI",NocProcessAPI,basename="NocProcessAPI")
urlpatterns = [
    path('',include(router.urls)),

]