from django.shortcuts import render
from employee_basic_information.views import BaseAPIViewSet
from .models import *
from .serializers import *
from rest_framework import viewsets

# Create your views here.
class InquiryOutcomesAPI(BaseAPIViewSet):
    queryset = InquiryOutcomes.objects.all()
    serializer_class = InquiryOutcomesSerializer
class InquiryTypeAPI(BaseAPIViewSet):
    queryset = InquiryType.objects.all()
    serializer_class = InquiryTypeSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return InquiryType_list_Serializer
        return super().get_serializer_class()
    
class DisciplinaryProceedingInquiryAPI(BaseAPIViewSet):
    queryset = DisciplinaryProceedingRequest.objects.all()
    serializer_class = DisciplinaryProceedingInquirySerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve' :
                return DisciplinaryProceedingInquiry_list_Serializer
        return super().get_serializer_class()
    

class ProbeOfficerApprovalViewSet(BaseAPIViewSet):
    queryset = ProbeOfficerApproval.objects.all()
    serializer_class = ProbeOfficerApprovalSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return ProbeOfficerApprovalListSerializer
        return super().get_serializer_class()

class DGFirstApprovalViewSet(BaseAPIViewSet):
    queryset = DGFirstApproval.objects.all()
    serializer_class = DGFirstApprovalSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return DGFirstApprovalListSerializer
        return super().get_serializer_class()

class RegularInquiryOfficerApprovalViewSet(BaseAPIViewSet):
    queryset = RegularInquiryOfficerApproval.objects.all()
    serializer_class = RegularInquiryOfficerApprovalSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return RegularInquiryOfficerApprovalListSerializer
        return super().get_serializer_class()

class HRUserApprovalViewSet(BaseAPIViewSet):
    queryset = HRUserApproval.objects.all()
    serializer_class = HRUserApprovalSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return HRUserApprovalListSerializer
        return super().get_serializer_class()

class DirectorHrApprovalViewSet(BaseAPIViewSet):
    queryset = DirectorHrApproval.objects.all()
    serializer_class = DirectorHrApprovalSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return DirectorHrApprovalListSerializer
        return super().get_serializer_class()

class DGFinalApprovalViewSet(BaseAPIViewSet):
    queryset = DGFinalApproval.objects.all()
    serializer_class = DGFinalApprovalSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return DGFinalApprovalListSerializer
        return super().get_serializer_class()

