from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Creating router
router = DefaultRouter()
router.register("cities", CitiesAPI, basename="cities")
router.register("Tehsil", TehsilAPI, basename="Tehsil")
router.register("District", DistrictAPI, basename="District")
router.register("EmployeeContactInformation", EmployeeContactInformationAPI, basename="EmployeeContactInformation")
router.register("EmployeeAddress", EmployeeAddressAPI, basename="EmployeeAddress")
router.register("countries", CountriesAPI, basename="countries")
router.register("personalinformation", PersonalInformationAPI, basename="personalinformation")
router.register("familyinformation", FamilyInformationAPI, basename="familyinformation")
router.register("employeereferance", EmployeeReferanceAPI, basename="employeereferance")
router.register("dependentemploymenthistory", DependentEmploymentHistoryAPI, basename="dependentemploymenthistory")
router.register("employmenthistory", EmploymentHistoryAPI, basename="employmenthistory")
router.register("level_of_education", Level_of_EducationAPI, basename="level_of_education")
router.register("level_of_skill", Level_of_SkillAPI, basename="level_of_skill")
router.register("education", EducationAPI, basename="education")
router.register("training", TrainingAPI, basename="training")
router.register("skill", SkillAPI, basename="skill")
router.register("personal_document", Personal_DocumentAPI, basename="personal_document")
# Add registration for other view classes here

urlpatterns = [
    path('', include(router.urls)),
    # Add more URL patterns if needed
]