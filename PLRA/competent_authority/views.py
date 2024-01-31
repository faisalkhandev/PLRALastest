from django.shortcuts import render
from employee_basic_information.views import *
from.models import *
from.serializers import *
# Create your views here.
class CompetentAuthorityAPI(BaseAPIViewSet):
    queryset = CompetentAuthority.objects.all()
    serializer_class = CompetentAuthoritySerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
                return CompetentAuthorityListSerializer
        return super().get_serializer_class() 