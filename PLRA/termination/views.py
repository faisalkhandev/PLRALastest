from django.shortcuts import render
from employee_basic_information.views import BaseAPIViewSet
from .serializers import *
from .models import *
# Create your views here.


class TerminationRequestAPI(BaseAPIViewSet):
    queryset = TerminationRequest.objects.all()
    serializer_class= TerminationRequestSerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return TerminationRequestlistSerializer
        return super().get_serializer_class()
    