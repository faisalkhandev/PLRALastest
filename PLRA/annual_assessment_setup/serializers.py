from .models import *
from rest_framework import serializers
from employee_basic_information.serializers import *
from HR_Setups.serializers import *

class BaseSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        model_name = self.Meta.model.__name__
        model = globals()[model_name]
        instance = model(**validated_data)
        instance.save()
        return instance
    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        return instance


class RatingModelSerializer(BaseSerializer):
    class Meta:
        model = RatingModel
        fields = '__all__'

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
    aar_process = AARProcessSerializer()
    reporting_officer = EmployeeSerializers()

    class Meta:
        model = AARReportingOfficerApproval
        fields = ['id', 'aar_process', 'reporting_officer', 'status']

class AARCounterAssigningOfficerApprovalListSerializer(serializers.ModelSerializer):
    aar_process = AARProcessSerializer()
    counter_assigning_officer = EmployeeSerializers()

    class Meta:
        model = AARCounterAssigningOfficerApproval
        fields = ['id', 'aar_process', 'counter_assigning_officer', 'status']

class AARHOReportingOfficerApprovalListSerializer(serializers.ModelSerializer):
    aar_process = AARProcessSerializer()
    reporting_officer = EmployeeSerializers()

    class Meta:
        model = AARHOReportingOfficerApproval
        fields = ['id', 'aar_process', 'reporting_officer', 'status']

class AARHOCounterAssigningOfficerApprovalListSerializer(serializers.ModelSerializer):
    aar_process = AARProcessSerializer()
    counter_assigning_officer = EmployeeSerializers()

    class Meta:
        model = AARHOCounterAssigningOfficerApproval
        fields = ['id', 'aar_process', 'counter_assigning_officer', 'status']