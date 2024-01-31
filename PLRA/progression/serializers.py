from rest_framework import serializers
from progression.models import *

class PromoteToProgressionSerializer(serializers.Serializer):
    progression_document_rec_id = serializers.IntegerField(
        label= 'progression_document_rec_id',
        write_only=True

    )

    progression_effective_date = serializers.DateField(
        label= 'progression_effective_date',
        write_only=True
    )

class ProgressionEmployeeSerializer(serializers.ModelSerializer):    
    class Meta:
        model = ProgressionEmployee
        fields = '__all__'


class ProgressionDocumentSerializer(serializers.ModelSerializer):
    toL2Employees = ProgressionEmployeeSerializer(many=True, read_only=True)
    class Meta:
        model = ProgressionDocument 
        fields = '__all__'