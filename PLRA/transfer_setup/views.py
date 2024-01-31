# views.py
from employee_basic_information.views import BaseAPIViewSet
from .models import *
from .serializers import *
class TransferRatingTypeViewSet(BaseAPIViewSet):
    queryset = TransferRatingType.objects.all()
    serializer_class = TransferRatingTypeSerializer

class DistanceRatingFormulaViewSet(BaseAPIViewSet):
    queryset = DistanceRatingFarmula.objects.all()
    serializer_class = DistanceRatingFormulaSerializer
    # def get_serializer_class(self):
    #     if self.action == 'list':
    #             return DistanceRatingFormulalistSerializer
    #     return super().get_serializer_class()

class WedlockRatingFormulaViewSet(BaseAPIViewSet):
    queryset = WedlockRatingFarmula.objects.all()
    serializer_class = WedlockRatingFormulaSerializer

class TenureRatingFormulaViewSet(BaseAPIViewSet):
    queryset = TenureRatingFarmula.objects.all()
    serializer_class = TenureRatingFormulaSerializer

class DisabilityRatingFormulaViewSet(BaseAPIViewSet):
    queryset = DisabilityRatingFarmula.objects.all()
    serializer_class = DisabilityRatingFormulaSerializer
class E_Transfer_Rating_MatrixViewSet(BaseAPIViewSet):
    queryset = E_Transfer_Rating_Matrix.objects.all()
    serializer_class = E_Transfer_Rating_MatrixSerializer
