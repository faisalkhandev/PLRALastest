# views.py
from rest_framework import viewsets
from .models import *
from employee_basic_information.views import BaseAPIViewSet
from .serializers import *

class TransferProcessViewSet(BaseAPIViewSet):
    queryset = Transfer_Process.objects.all()
    serializer_class = TransferProcessSerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action=='retrieve':
                return TransferProcessListSerializer 
        return super().get_serializer_class()

class TransferApprovalsViewSet(BaseAPIViewSet):
    queryset = TransferApprovals.objects.all()
    serializer_class = TransferApprovalsSerializer 
    def get_serializer_class(self):
        if self.action == 'list' or self.action=='retrieve':
                return TransferApprovalsListSerializer
        return super().get_serializer_class()
