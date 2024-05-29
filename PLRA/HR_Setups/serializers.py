from .models import *
from rest_framework import serializers
from employee_basic_information.serializers import *
from HR_Setups.serializers import *

class BaseSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        model_name = self.Meta.model.__name__
        model = globals()[model_name]
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

class HRCelanderYearSerializer(BaseSerializer):
    class Meta:
        model = HRCelanderYear
        fields = '__all__'

class Holiday_datesSerializer(BaseSerializer):
    class Meta:
        model = Holiday_dates
        fields = '__all__'

class HolidaySerializer(BaseSerializer):
    class Meta:
        model = Holiday
        fields = '__all__'
