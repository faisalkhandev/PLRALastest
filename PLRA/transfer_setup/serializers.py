
from rest_framework import serializers
from django.contrib.auth import get_user_model
from.models import *
from employee_basic_information.serializers import *
User = get_user_model()

class BaseSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        model_name = self.Meta.model.__name__
        try:
            model = globals()[model_name]
        except KeyError:
            raise serializers.ValidationError(f"{model_name} is not a valid model name.")
        instance = model(**validated_data)
        instance.clean()
        instance.save()
        
        return instance

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.clean()
        instance.save()
        return instance

class TransferWindowPositionSerializer(serializers.Serializer):
    position = Position_list_Serializer()  # Use your existing Position serializer here
    start_date = serializers.DateField(format="%Y-%m-%d")
    end_date = serializers.DateField(format="%Y-%m-%d")
    window_id = serializers.IntegerField()
    class Meta:
        model = Position
        fields = '__all__'




class TransferRatingTypeSerializer(BaseSerializer):
    class Meta:
        model = TransferRatingType
        fields = '__all__'

class DistanceRatingFormulaSerializer(BaseSerializer):
    class Meta:
        model = DistanceRatingFarmula
        fields = '__all__'

class WedlockRatingFormulaSerializer(BaseSerializer):
    class Meta:
        model = WedlockRatingFarmula
        fields = '__all__'

class TenureRatingFormulaSerializer(BaseSerializer):
    class Meta:
        model = TenureRatingFarmula
        fields = '__all__'
class SameDistrictRestrictionRuleListSerializer(BaseSerializer):
    restriction_job = Job_list_Serializer()
    class Meta:
        model = SameDistrictRestrictionRule
        fields = '__all__'
class DisabilityRatingFormulaSerializer(BaseSerializer):
    class Meta:
        model = DisabilityRatingFarmula
        fields = '__all__'
class SameDistrictRestrictionRuleSerializer(BaseSerializer):
    class Meta:
        model = SameDistrictRestrictionRule
        fields = '__all__'
class E_Transfer_Rating_MatrixSerializer(BaseSerializer):
    class Meta:
        model = E_Transfer_Rating_Matrix
        fields = '__all__'
class TransferRatingModelSerializer(BaseSerializer):
    class Meta:
        model = TransferRatingModel
        fields = '__all__'
class TransferRatingModelTypeSerializer(BaseSerializer):
    class Meta:
        model = TransferRatingModelType
        fields = '__all__'
class E_Transfer_Window_PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = E_Transfer_Window_Period
        fields = '__all__'
class E_Transfer_Window_PeriodListSerializer(serializers.ModelSerializer):
    open_position=Position_list_Serializer(many=True) 
    class Meta:
        model = E_Transfer_Window_Period
        fields = '__all__'
class E_Transfer_ProcessSerializer(BaseSerializer):
    class Meta:
        model = E_Transfer_Process
        fields = '__all__'

class E_Transfer_ProcessListSerializer(BaseSerializer):
    employee=User_list_Serializers()
    transfer_window = E_Transfer_Window_PeriodListSerializer()
    transfer_position= Position_list_Serializer()

    class Meta:
        model = E_Transfer_Process
        fields = '__all__'

class ConcernOfficerApprovalCustomSerializer(serializers.ModelSerializer):
    e_transfer_process = E_Transfer_ProcessListSerializer()
    class Meta:
        model = ConcernOfficerApproval
        fields = '__all__'

class ConcernOfficerListApprovalSerializer(serializers.Serializer):
    no_of_applicants = serializers.IntegerField()
    marked_employees = serializers.IntegerField()
    unmarked_employees = serializers.IntegerField()
    position = Position_list_Serializer()
    window = E_Transfer_Window_PeriodSerializer()
    approval = ConcernOfficerApprovalCustomSerializer(many=True)
    

class ConcernOfficerApprovalSerializer(BaseSerializer):
    class Meta:
        model = ConcernOfficerApproval
        fields = '__all__'
        

class ConcernOfficerApprovalListSerializer(BaseSerializer):
    e_transfer_process=E_Transfer_ProcessListSerializer()
    concern_officer_authority=UserSerializers()
    class Meta:
        model = ConcernOfficerApproval
        fields = '__all__'
class HRDirectorETransferApprovalSerializer(BaseSerializer):
    class Meta:
        model = HRDirectorETransferApproval
        fields = '__all__'
class HRDirectorETransferApprovalListSerializer(BaseSerializer):
    e_transfer_process=E_Transfer_ProcessListSerializer(many=True)
    concern_officer_authority=UserSerializers()
    position=Position_list_Serializer() 
    class Meta:
        model = HRDirectorETransferApproval
        fields = '__all__'



    # def to_representation(self, instance):
    #     data = super(E_Transfer_ProcessListSerializer, self).to_representation(instance)
 
    #     approvals = []
    #     approvals.extend(ConcernOfficerApprovalListSerializer(instance.ConcernOfficerApproval.all(), many=True).data)
    #     approvals.extend(HRDirectorETransferApprovalListSerializer(instance.HRDirectorETransferApproval.all(), many=True).data)
 
    #     data['approvals'] = approvals
    #     return data
