from employee_basic_information.views import BaseAPIViewSet
from .serializers import *
from .Models import *

class PayrollSetupAPI(BaseAPIViewSet):
    queryset = PayrollSetup.objects.all()
    serializer_class= PayrollSetupSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return PayrollSetupSerializer
        return super().get_serializer_class()

class TransactionTypeSetupAPI(BaseAPIViewSet):
    queryset = TransactionTypeSetup.objects.all()
    serializer_class= TransactionTypeSetupSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return TransactionTypeSetupSerializer
        return super().get_serializer_class()