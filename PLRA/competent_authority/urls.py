from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Creating router
router = DefaultRouter()
router.register("CompetentAuthorityAPI", CompetentAuthorityAPI, basename="CompetentAuthorityAPI")


# Add registration for other view classes here

urlpatterns = [
    path('', include(router.urls))
]