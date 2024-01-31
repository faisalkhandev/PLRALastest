from .models import *
from rest_framework import serializers
from employee_basic_information.serializers import *

class BaseSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        model_name = self.Meta.model.__name__
        model = globals()[model_name]
        instance = model(**validated_data)
        instance.save()
        return instance
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance
class LeaveTypeSerializer(BaseSerializer):
    class Meta:
        model = LeaveType
        fields = '__all__'
class LeaveTypeNameSerializer(BaseSerializer):
    class Meta:
        model = LeaveType
        fields = ('leave_id','leave_type','leave_description')



class LeaveApplySerializer(BaseSerializer):
    class Meta:
        model = LeaveApply
        fields = '__all__'

class LeaveApply_list_Serializer(BaseSerializer):
    employee=UserSerializers()
    leave_type=LeaveTypeSerializer()
    leave_deduction_bucket_id=LeaveTypeSerializer()
    class Meta:
        model = LeaveApply
        fields = '__all__'


class LeaveDependableDetailSerializer(BaseSerializer):
    class Meta:
        model = LeaveDependableDetail
        fields = '__all__'


class LeaveDependencySerializer(BaseSerializer):
   
    class Meta:
        model = LeaveDependency
        fields = '__all__'


class LeaveDependableBucketSerializer(BaseSerializer):
    leave_type=LeaveTypeNameSerializer()
    leave_deduction_bucket=LeaveTypeNameSerializer()
    class Meta:
        model = LeaveDependableBucket
        fields = ('leave_deduction_bucket_allowed','leave_type','leave_deduction_bucket','leave_deduction_used','leave_type_used','leave_deduction_running_balance','employee')




class SalaryDeductibleSerializer(BaseSerializer):
    class Meta:
        model = SalaryDeductible
        fields = '__all__'

class SalaryDeductible_list_Serializer(BaseSerializer):
    leave_type=LeaveTypeSerializer()
    ppg_level=Ppg_Level_SetupSerializer()
    class Meta:
        model = SalaryDeductible
        fields = '__all__'

class LeaveDependency_list_Serializer(BaseSerializer):
    leave_with_adjustable=LeaveTypeSerializer()
    depends_upon=LeaveTypeSerializer()
    class Meta:
        model = LeaveDependency
        fields = '__all__'

class LeaveDependableDetail_list_Serializer(BaseSerializer):
    leave_request=LeaveApplySerializer()
    employee=UserSerializers()
    leave_type=LeaveTypeSerializer()
    leave_deduction_bucket=LeaveTypeSerializer()
    class Meta:
        model = LeaveDependableDetail
        fields = '__all__'

class LeaveCountSerializer(BaseSerializer):
    class Meta:
        model = LeaveCount
        fields = '__all__'

class LeaveApprovalsSerializer(BaseSerializer):
    class Meta:
        model = LeaveApprovals
        fields = '__all__'

class ApprovalsSerializer(BaseSerializer):
    class Meta:
        model = Approvals
        fields = '__all__'


class SuperApprovalsSerializer(BaseSerializer):
    class Meta:
        model = SuperApprovals
        fields = '__all__'
class SuperApprovalsPostSerializer(BaseSerializer): 
    class Meta:
        model = SuperApprovals
        fields = '__all__'
        

class LeaveApprovalsListSerializer(BaseSerializer):
    leave_count=LeaveCountSerializer()
    class Meta:
        model = LeaveApprovals
        fields = '__all__'
class ApprovalsListSerializer(BaseSerializer):
    leave = LeaveApply_list_Serializer()
    approving_authority = EmployeeSerializers()
    leave_approval = LeaveApprovalsSerializer()
    class Meta:
        model = Approvals
        fields = '__all__'

class SuperApprovalsListSerializer(BaseSerializer):
    leave = LeaveApplySerializer()
    approving_authority = EmployeeSerializers()
    class Meta:
        model = SuperApprovals
        fields = '__all__'



class NewApprovingAuthoritySerializer(BaseSerializer):
    class Meta:
        model = Employee
        fields = ['first_name','last_name','employee_image','id']

class NewLeaveApprovalSerializer(BaseSerializer):
    class Meta:
        model = LeaveApprovals
        fields = ['approving_authority','approving_time','id']
class NewApprovalsSerializer(BaseSerializer):
    approving_authority = NewApprovingAuthoritySerializer()
    leave_approval = NewLeaveApprovalSerializer()

    class Meta:
        model = Approvals
        fields = '__all__'

class NewSuperApprovalsSerializer(BaseSerializer):
    approving_authority = NewApprovingAuthoritySerializer()

    class Meta:
        model = SuperApprovals
        fields = '__all__'
class NewLeaveTypeSerializer(BaseSerializer):

    class Meta:
        model = LeaveType
        fields = ['leave_type','leave_description',]

class LeaveApplyWithApprovalsSerializer(serializers.ModelSerializer):
    approvals = NewApprovalsSerializer(many=True, source='approvals_set')
    superapprovals = NewSuperApprovalsSerializer(many=True, source='superapprovals_set')
    leave_type=LeaveTypeNameSerializer()
    class Meta:
        model = LeaveApply
        fields = '__all__'
class LeaveApplyWithApprovalsListSerializer(serializers.ModelSerializer):
    approvals = NewApprovalsSerializer(many=True, source='approvals_set')
    superapprovals = NewSuperApprovalsSerializer(many=True, source='superapprovals_set')
    leave_type=NewLeaveTypeSerializer()
    employee=User_list_Serializers()
    class Meta:
        model = LeaveApply
        fields = '__all__'
class LeaveNonDependableDetailSerializer(serializers.ModelSerializer):
    leave_type=LeaveTypeNameSerializer()
    class Meta:
        model = LeaveNonDependableDetail
        fields = ('leave_type_allowed','leave_type_used','leave_type_remaning','employee','leave_type')

class LeaveBalancesSerializer(serializers.Serializer):
    employee_id = User_list_Serializers()
    # leave_type = LeaveTypeSerializer()
    leave_non_dependable_balance = LeaveNonDependableDetailSerializer(many=True)
    leave_dependable_balance = LeaveDependableBucketSerializer(many=True)