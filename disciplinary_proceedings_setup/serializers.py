
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
        instance.clean()
        instance.save()
        return instance
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.clean()
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

class DisciplinaryProceedingInquirySerializer(BaseSerializer):
    
    class Meta:
        model = DisciplinaryProceedingRequest
        fields = '__all__'

class DisciplinaryProceedingInquiry_lists_Serializer(BaseSerializer):
    employee=EmployeeSerializers()
    class Meta:
        model = DisciplinaryProceedingRequest
        fields = '__all__'
        
class InquiryType_list_Serializer(BaseSerializer):
    inquiryoutcomes=InquiryOutcomesSerializer()
    class Meta:
        model = InquiryType
        fields = '__all__'

class ProbeOfficerApprovalSerializer(BaseSerializer):
    class Meta:
        model = ProbeOfficerApproval
        fields = '__all__'

class ProbeOfficerApprovalListSerializer(BaseSerializer):
    designation = serializers.CharField(default='PROBE OFFICER')
    approving_authority=EmployeeSerializers()
    disciplinary_proceeding_request=DisciplinaryProceedingInquiry_lists_Serializer()
    class Meta:
        model = ProbeOfficerApproval
        fields = '__all__'

class DGFirstApprovalSerializer(BaseSerializer):
    class Meta:
        model = DGFirstApproval
        fields = '__all__'

class DGFirstApprovalListSerializer(BaseSerializer):
    designation = serializers.CharField(default='DG')
    approving_authority=EmployeeSerializers()
    disciplinary_proceeding_request=DisciplinaryProceedingInquiry_lists_Serializer()

    
    class Meta:
        model = DGFirstApproval
        fields = '__all__'

class RegularInquiryOfficerApprovalSerializer(BaseSerializer):
    class Meta:
        model = RegularInquiryOfficerApproval
        fields = '__all__'

class RegularInquiryOfficerApprovalListSerializer(BaseSerializer):
    designation = serializers.CharField(default='INQUIRY OFFICER')
    approving_authority=EmployeeSerializers()
    disciplinary_proceeding_request=DisciplinaryProceedingInquiry_lists_Serializer()
    
    
    class Meta:
        model = RegularInquiryOfficerApproval
        fields = '__all__'

class HRUserApprovalSerializer(BaseSerializer):
    class Meta:
        model = HRUserApproval
        fields = '__all__'

class HRUserApprovalListSerializer(BaseSerializer):
    designation = serializers.CharField(default='HR USER')
    approving_authority=EmployeeSerializers()
    disciplinary_proceeding_request=DisciplinaryProceedingInquiry_lists_Serializer()

    
    class Meta:
        model = HRUserApproval
        fields = '__all__'

class DirectorHrApprovalSerializer(BaseSerializer):
    class Meta:
        model = DirectorHrApproval
        fields = '__all__'

class DirectorHrApprovalListSerializer(BaseSerializer):
    designation = serializers.CharField(default='DIRECTOR HR')
    approving_authority=EmployeeSerializers()
    disciplinary_proceeding_request=DisciplinaryProceedingInquiry_lists_Serializer()

    
    class Meta:
        model = DirectorHrApproval
        fields = '__all__'

class DGFinalApprovalSerializer(BaseSerializer):
    class Meta:
        model = DGFinalApproval
        fields = '__all__'

class DGFinalApprovalListSerializer(BaseSerializer):
    designation = serializers.CharField(default='DG')
    approving_authority=EmployeeSerializers()
    disciplinary_proceeding_request=DisciplinaryProceedingInquiry_lists_Serializer()

    
    class Meta:
        model = DGFinalApproval
        fields = '__all__'



class DisciplinaryProceedingInquiry_list_Serializer(BaseSerializer):
    employee=EmployeeSerializers()
    inquiry_type=InquiryType_list_Serializer()
    prob_officer=EmployeeSerializers()
    regular_inquiry_officer=EmployeeSerializers()
    
    class Meta:
        model = DisciplinaryProceedingRequest
        fields = '__all__'
 
    def to_representation(self, instance):
        data = super(DisciplinaryProceedingInquiry_list_Serializer, self).to_representation(instance)
 
        approvals = []
        approvals.extend(ProbeOfficerApprovalListSerializer(instance.ProbeOfficerApproval.all(), many=True).data)
        approvals.extend(DGFirstApprovalListSerializer(instance.DGFirstApproval.all(), many=True).data)
        approvals.extend(RegularInquiryOfficerApprovalListSerializer(instance.RegularInquiryOfficer.all(), many=True).data)
        approvals.extend(HRUserApprovalListSerializer(instance.HRUserApproval.all(), many=True).data)
        approvals.extend(DirectorHrApprovalListSerializer(instance.DirectorHrApproval.all(), many=True).data)
        approvals.extend(DGFinalApprovalListSerializer(instance.DGFinalApproval.all(), many=True).data)
 
        data['approvals'] = approvals
        return data