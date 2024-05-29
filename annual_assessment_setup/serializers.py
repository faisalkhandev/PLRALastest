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
 
class RatingModelSerializer(BaseSerializer):
    class Meta:
        model = RatingModel
        fields = '__all__'
class checkjobSerializer(serializers.Serializer):
    headoffice = serializers.BooleanField()
 
class RatingTypeLikertScaleSerializer(BaseSerializer):
    class Meta:
        model = RatingTypeLikertScale
        fields = '__all__'
 
class RatingTypePointsSerializer(BaseSerializer):
    class Meta:
        model = RatingTypePoints
        fields = '__all__'
 
 
 
class AARprescribedFormSerializer(BaseSerializer):
    class Meta:
        model = AARprescribedForm
        fields = '__all__'
 
class AARProcessSerializer(BaseSerializer):
    class Meta:
        model = AARProcess
        fields = '__all__'
 
 
 
 
 
class RatingTypePointsAssignmentSerializer(BaseSerializer):
    class Meta:
        model = RatingTypePointsAssignment
        fields = '__all__'
class RatingModel_list_Serializer(BaseSerializer):
    year=HRCelanderYearSerializer()
    class Meta:
        model = RatingModel
        fields = '__all__'
       
class RatingTypeLikertScale_list_Serializer(BaseSerializer):
    rating_model=RatingModelSerializer()
    class Meta:
        model = RatingTypeLikertScale
        fields = '__all__'
       
class RatingTypePoints_list_Serializer(BaseSerializer):
    rating_model=RatingModelSerializer()
    class Meta:
        model = RatingTypePoints
        fields = '__all__'
       
 
       
class AARprescribedForm_list_Serializer(BaseSerializer):
    job=JobSerializer()
    class Meta:
        model = AARprescribedForm
        fields = '__all__'
       
class AARProcess_list_Serializer(BaseSerializer):
    year=HRCelanderYearSerializer()
    employee=UserSerializers()
    class Meta:
        model = AARProcess
        fields = '__all__'
 
class RatingTypePointsAssignment_list_Serializer(BaseSerializer):
    employee=UserSerializers()
    class Meta:
        model = RatingTypePointsAssignment
        fields = '__all__'
 
 
 
# serializers.py
 
class AARReportingOfficerApprovalSerializer(BaseSerializer):
    class Meta:
        model = AARReportingOfficerApproval
        fields = '__all__'
 
class AARCounterAssigningOfficerApprovalSerializer(BaseSerializer):
    class Meta:
        model = AARCounterAssigningOfficerApproval
        fields = '__all__'
 
class AARCompetentAuthorityApprovallistSerializer(BaseSerializer):
    approving_authority=EmployeeSerializers(source="competent_authority")
    aar_process=AARProcess_list_Serializer()
    designation = serializers.CharField(default='COMPETENT AUTHORITY')
 
    class Meta:
        model = AARCompetentAuthorityApproval
        fields = '__all__'
class AARCompetentAuthorityApprovalSerializer(BaseSerializer):
 
    class Meta:
        model = AARCompetentAuthorityApproval
        fields = '__all__'
 
class AARHOReportingOfficerApprovalSerializer(BaseSerializer):
    class Meta:
        model = AARHOReportingOfficerApproval
        fields = '__all__'
 
class AARHOCounterAssigningOfficerApprovalSerializer(BaseSerializer):
    class Meta:
        model = AARHOCounterAssigningOfficerApproval
        fields = '__all__'
 
 
# serializers.py
 
class AARReportingOfficerApprovalListSerializer(serializers.ModelSerializer):
    aar_process = AARProcess_list_Serializer()
    approving_authority = EmployeeSerializers(source='reporting_officer')
    designation = serializers.CharField(default='REPORTING OFFICER')
    over_All_grading=RatingTypeLikertScaleSerializer()
 
 
    class Meta:
        model = AARReportingOfficerApproval
        fields = '__all__'
    
    
 
class AARCounterAssigningOfficerApprovalListSerializer(serializers.ModelSerializer):
    aar_process = AARProcess_list_Serializer()
    approving_authority = EmployeeSerializers(source='counter_assigning_officer')
    designation = serializers.CharField(default='COUNTERSIGNING OFFICER')

   
   
    class Meta:
        model = AARCounterAssigningOfficerApproval
        fields = '__all__'
 
class AARHOReportingOfficerApprovalListSerializer(serializers.ModelSerializer):
    aar_process = AARProcess_list_Serializer()
    approving_authority = EmployeeSerializers(source='reporting_officer')
    # over_All_grading=RatingTypeLikertScaleSerializer()
    designation = serializers.CharField(default='REPORTING OFFICER')
 
 
 
    class Meta:
        model = AARHOReportingOfficerApproval
        fields = '__all__'
 
class AARHOCounterAssigningOfficerApprovalListSerializer(serializers.ModelSerializer):
    aar_process = AARProcess_list_Serializer()
    approving_authority = EmployeeSerializers(source='counter_assigning_officer')
    over_All_grading=RatingTypeLikertScaleSerializer()

    designation = serializers.CharField(default='COUNTERSIGNING OFFICER')
 
    class Meta:
        model = AARHOCounterAssigningOfficerApproval
        fields = '__all__'
class AARProcessListSerializer(BaseSerializer):
    year=HRCelanderYear()
    employee=User_list_Serializers()
    class Meta:
        model = AARProcess
        fields = '__all__'
 
    def to_representation(self, instance):
        data = super(AARProcessListSerializer, self).to_representation(instance)
 
        is_head_office = instance.is_head_office
        approvals = []
        points=[]
 
        if not is_head_office:
            approvals.extend(AARReportingOfficerApprovalListSerializer(instance.aarreportingofficerapproval_set.all(), many=True).data)
            points.extend(RatingTypePointsAssignmentSerializer(instance.RatingTypePointsAssignment.all(), many=True).data)
            approvals.extend(AARCounterAssigningOfficerApprovalListSerializer(instance.aarcounterassigningofficerapproval_set.all(), many=True).data)
        else:
            approvals.extend(AARHOReportingOfficerApprovalListSerializer(instance.aarhoreportingofficerapproval_set.all(), many=True).data)
            approvals.extend(AARHOCounterAssigningOfficerApprovalListSerializer(instance.aarhocounterassigningofficerapproval_set.all(), many=True).data)
 
        # Add the AARCompetentAuthorityApprovalSerializer field in approvals array
        approvals.extend(AARCompetentAuthorityApprovallistSerializer(instance.aarcompetentauthorityapproval_set.all(), many=True).data)
 
        data['approvals'] = approvals
        data['points'] = points
        return data