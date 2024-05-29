
from employee_basic_information.views import BaseAPIViewSet
from .serializers import *
from .models import *
# Create your views here.


class TerminationRequestListAPI(BaseAPIViewSet):
    queryset = TerminationRequest.objects.all()
    serializer_class= TerminationRequestWithApprovalslistSerializer
    
class TerminationRequestAPI(BaseAPIViewSet):
    queryset = TerminationRequest.objects.all()
    serializer_class= TerminationRequestSerializer
    
class TerminationApprovalsAPI(BaseAPIViewSet):
    queryset = TerminationApprovals.objects.all()
    serializer_class= TerminationApprovalsSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return TerminationApprovalsListSerializer
        return super().get_serializer_class()
    
    
    