
from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter
#creating router
router=DefaultRouter()
router.register("ResignationRequestAPI",ResignationRequestAPI,basename="ResignationRequestAPI")
urlpatterns = [
    path('',include(router.urls)),
]