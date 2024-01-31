from employee_basic_information.views import BaseAPIViewSet
from .serializers import *
from .models import *
# Create your views here.
class NocTypeAPI(BaseAPIViewSet):
    queryset = NocType.objects.all()
    serializer_class= NocTypeSerializer
    
class NocProcessAPI(BaseAPIViewSet):
    queryset = NocProcess.objects.all()
    serializer_class= NocProcessSerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return NocProcesslistSerializer
        return super().get_serializer_class()