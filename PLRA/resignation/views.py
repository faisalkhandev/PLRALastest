from django.shortcuts import render
from employee_basic_information.views import BaseAPIViewSet
from .serializers import *
from .models import *
# Create your views here.


class ResignationRequestAPI(BaseAPIViewSet):
    queryset = ResignationRequest.objects.all()
    serializer_class= ResignationRequestSerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return ResignationRequestlistSerializer
        return super().get_serializer_class()
    