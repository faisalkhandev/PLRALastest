from django.shortcuts import render
from rest_framework.response import Response

from .models import *
from .serializers import *
from employee_basic_information.views import BaseAPIViewSet
from rest_framework import generics,viewsets


# Create your views here.


class RatingModelViewSet(BaseAPIViewSet):
    queryset = RatingModel.objects.all()
    serializer_class = RatingModelSerializer
    def get_serializer_class(self):
        if self.action == 'list'or self.action=='retrive':
                return RatingModel_list_Serializer
        return super().get_serializer_class()
    

class RatingTypeLikertScaleViewSet(BaseAPIViewSet):
    queryset = RatingTypeLikertScale.objects.all()
    serializer_class = RatingTypeLikertScaleSerializer
    def get_serializer_class(self):
        if self.action == 'list'or self.action=='retrive':
                return RatingTypeLikertScale_list_Serializer
        return super().get_serializer_class()
    

class RatingTypePointsViewSet(BaseAPIViewSet):
    queryset = RatingTypePoints.objects.all()
    serializer_class = RatingTypePointsSerializer
    def get_serializer_class(self):
        if self.action == 'list'or self.action=='retrive':
                return RatingTypePoints_list_Serializer
        return super().get_serializer_class()
    

class CheckJobViewset(generics.ListAPIView):
        serializer_class = checkjobSerializer

        def get_queryset(self):
                results=[]
                employee_id = self.kwargs['employee_id']
                employee = Employee.objects.get(pk=employee_id)
                res =None
                res=AARprescribedForm.objects.filter(job=employee.position.job).exists()
                print(res)
                results.append({'headoffice': res})
                return results
    

class AARprescribedFormViewSet(BaseAPIViewSet):
    queryset = AARprescribedForm.objects.all()
    serializer_class = AARprescribedFormSerializer
    def get_serializer_class(self):
        if self.action == 'list'or self.action=='retrive':
                return AARprescribedForm_list_Serializer
        return super().get_serializer_class()
    
    

class AARProcessViewSet(BaseAPIViewSet):
    queryset = AARProcess.objects.all()
    serializer_class = AARProcessSerializer
    def get_serializer_class(self):
        if self.action == 'list'or self.action=='retrive':
                return AARProcess_list_Serializer
        return super().get_serializer_class()

class AARProcessListViewSet(BaseAPIViewSet):
    queryset = AARProcess.objects.all()
    serializer_class = AARProcessListSerializer

class AARCompetentAuthorityApprovalViewSet(BaseAPIViewSet):
    queryset = AARCompetentAuthorityApproval.objects.all()
    serializer_class = AARCompetentAuthorityApprovalSerializer 
    def get_serializer_class(self):
        if self.action == 'list'or self.action=='retrive':
                return AARCompetentAuthorityApprovallistSerializer
        return super().get_serializer_class()



class RatingTypePointsAssignmentViewSet(BaseAPIViewSet):
    queryset = RatingTypePointsAssignment.objects.all()
    serializer_class = RatingTypePointsAssignmentSerializer
    def get_serializer_class(self):
        if self.action == 'list'or self.action=='retrive':
                return RatingTypePointsAssignment_list_Serializer
        return super().get_serializer_class()
    



# views.py

class AARReportingOfficerApprovalViewSet(BaseAPIViewSet):
    queryset = AARReportingOfficerApproval.objects.all()
    serializer_class = AARReportingOfficerApprovalSerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action=='retrieve':
                return AARReportingOfficerApprovalListSerializer
        return super().get_serializer_class()

class AARCounterAssigningOfficerApprovalViewSet(BaseAPIViewSet):
    queryset = AARCounterAssigningOfficerApproval.objects.all()
    serializer_class = AARCounterAssigningOfficerApprovalSerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action=='retrieve':
                return AARCounterAssigningOfficerApprovalListSerializer
        return super().get_serializer_class()

class AARHOReportingOfficerApprovalViewSet(BaseAPIViewSet):
    queryset = AARHOReportingOfficerApproval.objects.all()
    serializer_class = AARHOReportingOfficerApprovalSerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action=='retrieve':
                return AARHOReportingOfficerApprovalListSerializer
        return super().get_serializer_class()

class AARHOCounterAssigningOfficerApprovalViewSet(BaseAPIViewSet):
    queryset = AARHOCounterAssigningOfficerApproval.objects.all()
    serializer_class = AARHOCounterAssigningOfficerApprovalSerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action=='retrieve':
                return AARHOCounterAssigningOfficerApprovalListSerializer
        return super().get_serializer_class()