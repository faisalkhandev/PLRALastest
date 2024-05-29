from django.shortcuts import render
from employee_basic_information.views import BaseAPIViewSet
from .serializers import *
from .models import *
# Create your views here.


class ResignationRequestListAPI(BaseAPIViewSet):
    queryset = ResignationRequest.objects.all()
    serializer_class= ResignationRequestWithApprovalslistSerializer


class ResignationRequestAPI(BaseAPIViewSet):
    queryset = ResignationRequest.objects.all()
    serializer_class= ResignationRequestSerializer
    
    
class ResignationApprovalsAPI(BaseAPIViewSet):
    queryset = ResignationApprovals.objects.all()
    serializer_class= ResignationApprovalsSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return ResignationApprovalsListSerializer
        return super().get_serializer_class()
    
    