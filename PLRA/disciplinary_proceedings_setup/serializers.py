
from django.forms.models import model_to_dict
from rest_framework import serializers, permissions
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from.models import *
from employee_basic_information.serializers import *

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
    
class InquiryOutcomesSerializer(BaseSerializer):
    class Meta:
        model = InquiryOutcomes
        fields = '__all__'

class InquiryTypeSerializer(BaseSerializer):
    class Meta:
        model = InquiryType
        fields = '__all__'

# class DisciplinaryProceedingInquirySerializer(BaseSerializer):
    
#     class Meta:
#         model = DisciplinaryProceedingInquiry
#         fields = '__all__'
        
# class DisciplinaryProceedingInquiry_list_Serializer(BaseSerializer):
#     employee=UserSerializers()
#     probe_officer=UserSerializers()
#     regular_inquiry_officer=UserSerializers()
#     inquiry_outcome=InquiryOutcomesSerializer()
#     inquiry_type=InquiryTypeSerializer()
#     class Meta:
#         model = DisciplinaryProceedingInquiry
#         fields = '__all__'
        
class InquiryType_list_Serializer(BaseSerializer):
    inquiryoutcomes=InquiryOutcomesSerializer()
    class Meta:
        model = InquiryType
        fields = '__all__'
