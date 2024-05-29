
from rest_framework import serializers
from django.contrib.auth import get_user_model
from.models import *
from employee_basic_information.serializers import *
from leave_setup.serializers import NewApprovingAuthoritySerializer

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
class NewApprovalsResignationSerializer(BaseSerializer):
    approving_authority = NewApprovingAuthoritySerializer()

    class Meta:
        model = NocApprovals
        fields = '__all__'
 
class NocTypeSerializer(BaseSerializer):
    class Meta:
        model = NocType
        fields = '__all__' 
class NocProcessWithApprovalslistSerializer(BaseSerializer):
    approvals = NewApprovalsResignationSerializer(many=True, source='noc_approvals')
    employee=User_list_Serializers()
    noc_type=NocTypeSerializer()

    class Meta:
        model = NocProcess
        fields = '__all__' 

 
            
class NocProcessSerializer(BaseSerializer):
    class Meta:
        model = NocProcess
        fields = '__all__' 

class NocProcesslistSerializer(BaseSerializer):
    employee=EmployeeSerializers()
    noc_type=NocTypeSerializer()
    class Meta:
        model = NocProcess
        fields = '__all__' 
class NOCApprovalsSerializer(BaseSerializer):
    class Meta:
        model = NocApprovals
        fields = '__all__' 
class NOCApprovalsListSerializer(BaseSerializer):
    noc_request=NocProcesslistSerializer()
    class Meta:
        model = NocApprovals
        fields = '__all__' 
            