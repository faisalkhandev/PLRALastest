from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from employee_basic_information.views import BaseAPIViewSet
from rest_framework import filters
from rest_framework.pagination import LimitOffsetPagination
from django_filters.rest_framework import DjangoFilterBackend
from employee_basic_information.permissions import BasePermissions


class CitiesAPI(BaseAPIViewSet):
    queryset = Cities.objects.all()
    serializer_class = CitiesSerializer


class DistrictAPI(BaseAPIViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer


class TehsilAPI(BaseAPIViewSet):
    queryset = Tehsil.objects.all()
    serializer_class = TehsilSerializer


class EmployeeAddressAPI(BaseAPIViewSet):
    queryset = EmployeeAddress.objects.all()
    serializer_class = EmployeeAddressSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return EmployeeAddressListSerializer
        return super().get_serializer_class()
    


class EmployeeContactInformationAPI(BaseAPIViewSet):
    queryset = EmployeeContactInformation.objects.all()
    serializer_class = EmployeeContactInformationSerializer


class CountriesAPI(BaseAPIViewSet):
    queryset = Countries.objects.all()
    serializer_class = CountriesSerializer


class PersonalInformationAPI(BaseAPIViewSet):
    queryset = PersonalInformation.objects.all()
    serializer_class = PersonalInformationSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return PersonalInformation_list_Serializer
        return super().get_serializer_class()


class FamilyInformationAPI(BaseAPIViewSet):
    queryset = FamilyInformation.objects.all()
    serializer_class = FamilyInformationSerializer


class EmployeeReferanceAPI(BaseAPIViewSet):
    queryset = EmployeeReferance.objects.all()
    serializer_class = EmployeeReferanceSerializer


class DependentEmploymentHistoryAPI(BaseAPIViewSet):
    queryset = DependentEmploymentHistory.objects.all()
    serializer_class = DependentEmploymentHistorySerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return DependentEmploymentHistory_list_Serializer
        return super().get_serializer_class()

    


class EmploymentHistoryAPI(BaseAPIViewSet):
    queryset = EmploymentHistory.objects.all()
    serializer_class = EmploymentHistorySerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return EmploymentHistory_list_Serializer
        return super().get_serializer_class()



class Level_of_EducationAPI(BaseAPIViewSet):
    queryset = Level_of_Education.objects.all()
    serializer_class = Level_of_EducationSerializer


class Level_of_SkillAPI(BaseAPIViewSet):
    queryset = Level_of_Skill.objects.all()
    serializer_class = Level_of_SkillSerializer


class EducationAPI(BaseAPIViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return Education_list_Serializer
        return super().get_serializer_class()



class TrainingAPI(BaseAPIViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer


class SkillAPI(BaseAPIViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return Skill_List_Serializer
        return super().get_serializer_class()


class Personal_DocumentAPI(BaseAPIViewSet):
    queryset = Personal_Document.objects.all()
    serializer_class = Personal_DocumentSerializer
