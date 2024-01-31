
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
 
class TerminationRequestlistSerializer(BaseSerializer):
    employee=EmployeeSerializers()
    class Meta:
        model = TerminationRequest
        fields = '__all__' 
            
class TerminationRequestSerializer(BaseSerializer):
    class Meta:
        model = TerminationRequest
        fields = '__all__' 