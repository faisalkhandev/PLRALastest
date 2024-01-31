
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
        instance.save()
        return instance

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


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

class DisabilityRatingFormulaSerializer(BaseSerializer):
    class Meta:
        model = DisabilityRatingFarmula
        fields = '__all__'
class SameDistrictRestrictionRuleSerializer(BaseSerializer):
    class Meta:
        model = SameDistrictRestrictionRule
        fields = '__all__'
class TransferRatingModelSerializer(BaseSerializer):
    class Meta:
        model = TransferRatingModel
        fields = '__all__'
class TransferRatingModelTypeSerializer(BaseSerializer):
    class Meta:
        model = TransferRatingModelType
        fields = '__all__'
class E_Transfer_Window_PeriodSerializer(BaseSerializer):
    class Meta:
        model = E_Transfer_Window_Period
        fields = '__all__'
class E_Transfer_ProcessSerializer(BaseSerializer):
    class Meta:
        model = E_Transfer_Process
        fields = '__all__'
class ConcernOfficerApprovalSerializer(BaseSerializer):
    class Meta:
        model = ConcernOfficerApproval
        fields = '__all__'
class HRDirectorETransferApprovalSerializer(BaseSerializer):
    class Meta:
        model = HRDirectorETransferApproval
        fields = '__all__'
class E_Transfer_Rating_MatrixSerializer(BaseSerializer):
    class Meta:
        model = E_Transfer_Rating_Matrix
        fields = '__all__'
