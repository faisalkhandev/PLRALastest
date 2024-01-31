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
    
# class DisciplinaryProceedingInquiryAPI(BaseAPIViewSet):
#     queryset = DisciplinaryProceedingInquiry.objects.all()
#     serializer_class = DisciplinaryProceedingInquirySerializer
#     def get_serializer_class(self):
#         if self.action == 'list':
#                 return DisciplinaryProceedingInquiry_list_Serializer
#         return super().get_serializer_class()

