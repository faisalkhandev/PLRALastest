
from django.urls import path,include
from .views import *
from rest_framework.routers import DefaultRouter
#creating router
router=DefaultRouter()
router.register("TerminationRequestAPI",TerminationRequestAPI,basename="TerminationRequestAPI")
urlpatterns = [
    path('',include(router.urls)),

]