from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics,viewsets
from .models import *
from .serializers import *
from rest_framework.views import APIView
from employee_basic_information.views import BaseAPIViewSet
from rest_framework.decorators import action

class LeaveApplyWithApprovalsAPI(BaseAPIViewSet):
    queryset = LeaveApply.objects.all()
    serializer_class = LeaveApplyWithApprovalsSerializer 
    def get_serializer_class(self):
        if self.action == 'list':
                return LeaveApplyWithApprovalsListSerializer
        return super().get_serializer_class()
   
class LeaveBalancesAPIView(generics.ListAPIView):
    serializer_class = LeaveBalancesSerializer

    def get_queryset(self):
        employee_id = self.kwargs['employee_id']  # Assuming you pass the employee_id in the URL
        employee = Employee.objects.get(pk=employee_id)

        leave_types_list = LeaveType.objects.all()
        leave_balances = []
        non_dependable_detail=[]
        dependable_bucket=[]
        for leavetype in leave_types_list:
            non_dependable = LeaveNonDependableDetail.objects.filter(
                employee=employee,
                leave_type=leavetype
            ).order_by('-leave_to_date').first()
            if not leavetype.accrue and not non_dependable:
                 non_dependable={
                    "leave_type_allowed":leavetype.entire_service_limit,
                    "leave_type_used": 0,
                    "leave_type_remaining": leavetype.entire_service_limit,
                    "employee": employee,
                    "leave_type": leavetype
                }
                 
            if non_dependable:
                non_dependable_detail.append(non_dependable)
            dependable = LeaveDependableBucket.objects.filter(
                employee=employee,
                leave_type=leavetype
            ).order_by('-leave_date').first()
            if  leavetype.accrue and not dependable:
                related_accrue_record=AccrueTable.objects.filter(leave_bucket=leavetype,employee=employee).order_by('-month').first()
                if related_accrue_record:
                    dependable= {
                        "leave_deduction_bucket_allowed": related_accrue_record.accrued_leaves,
                        "leave_type":leavetype,
                        "leave_deduction_bucket": leavetype,
                        "leave_deduction_used": 0,
                        "leave_type_used": 0,
                        "leave_deduction_running_balance": 0,
                        "employee": employee
                    }
            if dependable:
                dependable_bucket.append(dependable)

        leave_balances.append({'employee_id': employee, 'leave_non_dependable_balance': non_dependable_detail, 'leave_dependable_balance': dependable_bucket})
        return leave_balances
            
class LeaveSetupAPI(BaseAPIViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer

class LeaveApplyAPI(BaseAPIViewSet):
    queryset = LeaveApply.objects.all()
    serializer_class = LeaveApplySerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return LeaveApply_list_Serializer
        return super().get_serializer_class()

class LeaveDependableDetailAPI(BaseAPIViewSet):
    queryset = LeaveDependableDetail.objects.all()
    serializer_class = LeaveDependableDetailSerializer
    def list(self, request):
        queryset = LeaveDependableDetail.objects.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = LeaveDependableDetail_list_Serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = LeaveDependableDetail_list_Serializer(queryset, many=True)
        return Response(serializer.data)


class LeaveDependencyAPI(BaseAPIViewSet):
    queryset = LeaveDependency.objects.all()
    serializer_class = LeaveDependencySerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return LeaveDependency_list_Serializer
        return super().get_serializer_class()

class LeaveDependableBucketAPI(BaseAPIViewSet):
    queryset = LeaveDependableBucket.objects.all()
    serializer_class = LeaveDependableBucketSerializer

class SalaryDeductibleAPI(BaseAPIViewSet):
    queryset = SalaryDeductible.objects.all()
    serializer_class = SalaryDeductibleSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return SalaryDeductible_list_Serializer
        return super().get_serializer_class()

class LeaveTypeAPI(BaseAPIViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer
    

    
class LeaveCountAPI(BaseAPIViewSet):
    queryset = LeaveCount.objects.all()
    serializer_class = LeaveCountSerializer

class LeaveApprovalsAPI(BaseAPIViewSet):
    queryset = LeaveApprovals.objects.all()
    serializer_class = LeaveApprovalsSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return LeaveApprovalsListSerializer
        return super().get_serializer_class()

class ApprovalsAPI(BaseAPIViewSet):
    queryset = Approvals.objects.all()
    serializer_class = ApprovalsSerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action=='retrieve':
                return ApprovalsListSerializer
        return super().get_serializer_class()

class SuperApprovalsAPI(BaseAPIViewSet):
    queryset = SuperApprovals.objects.all()
    serializer_class = SuperApprovalsPostSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return SuperApprovalsListSerializer
        return super().get_serializer_class()



