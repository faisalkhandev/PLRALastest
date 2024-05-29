from employee_basic_information.views import BaseAPIViewSet
from .serializers import *
from .models import *
# Create your views here.
class NocProcessListAPI(BaseAPIViewSet):
    queryset = NocProcess.objects.all()
    serializer_class= NocProcessWithApprovalslistSerializer

class NocTypeAPI(BaseAPIViewSet):
    queryset = NocType.objects.all()
    serializer_class= NocTypeSerializer
    
class NocProcessAPI(BaseAPIViewSet):
    queryset = NocProcess.objects.all()
    serializer_class= NocProcessSerializer

    
    
class NOCApprovalsAPI(BaseAPIViewSet):
    queryset = NocApprovals.objects.all()
    serializer_class= NOCApprovalsSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return NOCApprovalsListSerializer
        return super().get_serializer_class()
    
  