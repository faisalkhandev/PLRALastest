
from django.forms.models import model_to_dict
from rest_framework import serializers
from django.contrib.auth import get_user_model
from employee_basic_information.serializers import EmployeeSerializers
from.models import *
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
 
class ResignationRequestlistSerializer(BaseSerializer):
    employee=EmployeeSerializers()
    class Meta:
        model = ResignationRequest
        fields = '__all__' 
            
            
class ResignationRequestSerializer(BaseSerializer):
    class Meta:
        model = ResignationRequest
        fields = '__all__' 
            