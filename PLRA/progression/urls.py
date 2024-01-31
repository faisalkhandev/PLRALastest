from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import *
from rest_framework.routers import DefaultRouter
#creating router
router=DefaultRouter()
router.register("generate-progression",GenerateProgression,basename="GenerateElevationL2")
router.register("promote-progression",PromoteProgression,basename="GenerateElevationL2")

urlpatterns = [
    path('',include(router.urls)),
]