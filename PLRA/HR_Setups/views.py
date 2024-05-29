from django.shortcuts import render
from HR_Setups.serializers import *
from HR_Setups.models import *
from rest_framework import viewsets
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from employee_basic_information.views import BaseAPIViewSet
# Create your views here.


class HRCelanderYearAPI(BaseAPIViewSet):
    queryset = HRCelanderYear.objects.all()
    serializer_class = HRCelanderYearSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return HRCelanderYearSerializer
        return super().get_serializer_class()

class HolidayAPI(BaseAPIViewSet):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return HolidaySerializer
        return super().get_serializer_class()