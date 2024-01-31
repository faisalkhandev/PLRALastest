from rest_framework import serializers
from elevation.models import *

class GenerateElevationL2Serializer(serializers.ModelSerializer):    
    class Meta:
        model = ElevtionToL2Employee
        fields = '__all__'


class DocumentSerializer(serializers.ModelSerializer):
    toL2Employees = GenerateElevationL2Serializer(many=True, read_only=True)
    class Meta:
        model = ElevtionToL2 
        fields = [ 'elevtion_to_l2_doc_rec_id', 'document_date', 'status', 'toL2Employees' ]


class PromoteToL2Serializer(serializers.Serializer):
    elevtion_to_l2_doc_rec_id = serializers.IntegerField(
        label= 'elevtion_to_l2_doc_rec_id',
        write_only=True

    )

    elevation_effective_date = serializers.DateField(
        label= 'elevation_effective_date',
        write_only=True
    )




class GenerateElevationL3Serializer(serializers.ModelSerializer):    
    class Meta:
        model = ElevtionToL3Employee
        fields = '__all__'


class DocumentSerializerL3(serializers.ModelSerializer):
    toL3Employees = GenerateElevationL3Serializer(many=True, read_only=True)
    class Meta:
        model = ElevtionToL3 
        fields = '__all__'


class PromoteToL3Serializer(serializers.Serializer):
    elevtion_to_l3_doc_rec_id = serializers.IntegerField(
        label= 'elevtion_to_l3_doc_rec_id',
        write_only=True

    )

    elevation_effective_date = serializers.DateField(
        label= 'elevation_effective_date',
        write_only=True
    )