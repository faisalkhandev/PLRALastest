from rest_framework import serializers
from .models import CompetentAuthority
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


class CompetentAuthoritySerializer(BaseSerializer):
    class Meta:
        model = CompetentAuthority
        fields = '__all__'


class CompetentAuthorityListSerializer(BaseSerializer):
    employee_position=PositionSerializer()
    class Meta:
        model = CompetentAuthority
        fields = '__all__'
