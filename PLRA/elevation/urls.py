from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import *
from rest_framework.routers import DefaultRouter
#creating router
router=DefaultRouter()
router.register("generate-elevation-L2",GenerateElevationL2,basename="GenerateElevationL2")
router.register("promote-to-L2",PromoteToL2,basename="PromoteToL2")
router.register("generate-elevation-L3",GenerateElevationL3,basename="GenerateElevationL2")
router.register("promote-to-L3",PromoteToL3,basename="PromoteToL2")

urlpatterns = [
    path('',include(router.urls)),
]