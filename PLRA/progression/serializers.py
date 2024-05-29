from rest_framework import serializers
from progression.models import *
from employee_basic_information.serializers import *

class PendingProgressionSerializer(serializers.ModelSerializer):
    employee = User_list_Serializers()
    promote_job= Job_list_Serializer()
    promote_ppg_level= Ppg_Level_SetupSerializer()
    class Meta:
        model= PendingProgression
        fields= '__all__'

class PromoteToProgressionSerializer(serializers.Serializer):
    progression_document_rec_id = serializers.IntegerField(
        label= 'progression_document_rec_id',
        write_only=True

    )

    progression_effective_date = serializers.DateField(
        label= 'progression_effective_date',
        write_only=True
    )

class ProgressionDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressionDocument 
        fields = '__all__'

class ProgressionEmployeeSerializer(serializers.ModelSerializer):
    employee = User_list_Serializers()
    document = ProgressionDocumentSerializer()
    promote_job= Job_list_Serializer()
    promote_ppg_level= Ppg_Level_SetupSerializer()
    promote_job_level= JobLevel_list_Serializer()
    class Meta:
        model = ProgressionEmployee
        fields = '__all__'

class UpdateApprovalDateSerializer(serializers.Serializer):
    id = serializers.IntegerField(
        label= 'id',
        write_only=True
    )

    approval_date = serializers.DateField(
        label= 'approval_date',
        write_only=True
    )