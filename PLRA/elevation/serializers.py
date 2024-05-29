from rest_framework import serializers
from elevation.models import *
from employee_basic_information.serializers import User_list_Serializers

class GenerateElevationL2Serializer(serializers.ModelSerializer):    
    class Meta:
        model = ElevtionToEmployee
        fields = '__all__'


class DocumentSerializer(serializers.ModelSerializer):
    toL2Employees = GenerateElevationL2Serializer(many=True, read_only=True)
    employee = User_list_Serializers()
    class Meta:
        model = ElevtionToEmployee 
        fields = "__all__"

class DocumentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ElevtionDocument 
        fields = "__all__"


class PendingEmployeeSerializer(serializers.ModelSerializer):
    employee = User_list_Serializers()
    # index = serializers.SerializerMethodField()

    class Meta:
        model = PendingElevation
        fields = ['id', 'employee', 'status', 'current_level', 'months_in_current_level', 'current_level_start_date']
    # def get_index(self, obj):
    #     last_record = PendingElevation.objects.filter(Q(status='New') | Q(status='Reject')).order_by('-index').first()
    #     next_index = 1 if not last_record else last_record.index + 1
    #     return next_index

class ElevtionToEmployeeSerializer(serializers.ModelSerializer):
    document = DocumentHistorySerializer()
    employee=User_list_Serializers()
    
    class Meta:
        model = ElevtionToEmployee 
        fields = "__all__"


class UpdateApprovalDateSerializer(serializers.Serializer):
    id = serializers.IntegerField(
        label= 'id',
        write_only=True
    )

    approval_date = serializers.DateField(
        label= 'approval_date',
        write_only=True
    )

class UpdateStatusSerializer(serializers.Serializer):
    id = serializers.IntegerField(
        label= 'id',
        write_only=True
    )

    status = serializers.CharField(
        label= 'status',
        write_only=True
    )


class PromoteToL2Serializer(serializers.Serializer):
    elevtion_to_l2_doc_rec_id = serializers.IntegerField(
        label= 'elevtion_to_l2_doc_rec_id',
        write_only=True

    )

    elevation_effective_date = serializers.DateField(
        label= 'elevation_effective_date',
        write_only=True
    )
