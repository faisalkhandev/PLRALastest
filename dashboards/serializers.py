
from rest_framework import serializers
from employee_basic_information.serializers import User_list_Serializers
from employee_basic_information.models import *

class LeaveTypeSerializer(serializers.Serializer):
    leave_type = serializers.CharField()
    Size = serializers.IntegerField(required=False)
    Historical = serializers.IntegerField(required=False)
    Available = serializers.IntegerField(required=False)
    Balance = serializers.IntegerField(required=False)
    Approved = serializers.IntegerField(required=False)
class CountWithNameSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    name = serializers.CharField()

class ProcessCountsSerializer(serializers.Serializer):
    Leave = LeaveTypeSerializer(many=True, required=False)
    Termination = CountWithNameSerializer(many=True, required=False)
    Resignation = CountWithNameSerializer(many=True, required=False)
    Elevation = CountWithNameSerializer(many=True, required=False)
    Progression = CountWithNameSerializer(many=True, required=False)
    Administrative_Transfer = CountWithNameSerializer(many=True, required=False)
    E_Transfer = CountWithNameSerializer(many=True, required=False)
    Annual_Assessment = CountWithNameSerializer(many=True, required=False)
    NOC = CountWithNameSerializer(many=True, required=False)
    Disciplinary = CountWithNameSerializer(many=True, required=False)

    

class EmployeeDashboardProcessCountsSerializer(serializers.Serializer):
    employee_id = User_list_Serializers()
    process_counts = ProcessCountsSerializer()


class ApprovalCountWithNameSerializer(serializers.Serializer):
    counts = serializers.IntegerField( required=False)
    name = serializers.CharField()
    path = serializers.CharField(required=False)
    
class Wing_Wise_Employees(serializers.Serializer):
    counts=serializers.IntegerField(required=False)
    class Meta:
        model = Wing
        fields = '__all__'


class ApprovalProcessCountsSerializer(serializers.Serializer):
    Leave = ApprovalCountWithNameSerializer(many=True, required=False)
    Termination = ApprovalCountWithNameSerializer(many=True, required=False)
    Resignation = ApprovalCountWithNameSerializer(many=True, required=False)
    Administrative_Transfer = ApprovalCountWithNameSerializer(many=True, required=False)
    Annual_Assessment = ApprovalCountWithNameSerializer(many=True, required=False)
    Disciplinary = ApprovalCountWithNameSerializer(many=True, required=False)
    Progression = ApprovalCountWithNameSerializer(many=True, required=False)
    Elevation = ApprovalCountWithNameSerializer(many=True, required=False)
    E_Transfer = ApprovalCountWithNameSerializer(many=True, required=False)
    NOC = ApprovalCountWithNameSerializer(many=True, required=False)

class EmployeeApprovalCountsSerializer(serializers.Serializer):
    process_counts = ApprovalProcessCountsSerializer()