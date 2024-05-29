from rest_framework import serializers
from .models import *
from employee_basic_information.serializers import BaseSerializer
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
class CitiesSerializer(BaseSerializer):
    class Meta:
        model = Cities 
        fields = '__all__'
class DistrictSerializer(BaseSerializer):
    class Meta:
        model = District 
        fields = '__all__'
class TehsilSerializer(BaseSerializer):
    class Meta:
        model = Tehsil 
        fields = '__all__'
class EmployeeAddressSerializer(BaseSerializer):
    class Meta:
        model = EmployeeAddress
        fields = '__all__'
class EmployeeAddressListSerializer(BaseSerializer):
    district = DistrictSerializer()
    tehsil = TehsilSerializer()
    city = CitiesSerializer()
    class Meta:
        model = EmployeeAddress
        fields = '__all__'
class EmployeeContactInformationSerializer(BaseSerializer):
    class Meta:
        model = EmployeeContactInformation
        fields = '__all__'
class CountriesSerializer(BaseSerializer):
    class Meta:
        model = Countries
        fields = '__all__'
class PersonalInformationSerializer(BaseSerializer):
    class Meta:
        model = PersonalInformation
        fields = '__all__'
class FamilyInformationSerializer(BaseSerializer):
    class Meta:
        model = FamilyInformation
        fields = '__all__'
class EmployeeReferanceSerializer(BaseSerializer):
    class Meta:
        model = EmployeeReferance
        fields = '__all__'
class DependentEmploymentHistorySerializer(BaseSerializer):
    class Meta:
        model = DependentEmploymentHistory
        fields = '__all__'
class EmploymentHistorySerializer(BaseSerializer):
    class Meta:
        model = EmploymentHistory
        fields = '__all__'
class Level_of_EducationSerializer(BaseSerializer):
    class Meta:
        model = Level_of_Education
        fields = '__all__'
class Level_of_SkillSerializer(BaseSerializer):
    class Meta:
        model = Level_of_Skill
        fields = '__all__'
class EducationSerializer(BaseSerializer):
    class Meta:
        model = Education
        fields = '__all__'
class Education_list_Serializer(BaseSerializer):
    level_of_education=Level_of_EducationSerializer()
    class Meta:
        model = Education
        fields = '__all__'
class TrainingSerializer(BaseSerializer):
    class Meta:
        model = Training
        fields = '__all__'
class SkillSerializer(BaseSerializer):
    class Meta:
        model = Skill
        fields = '__all__'
class Skill_List_Serializer(BaseSerializer):
    level_of_skill=Level_of_SkillSerializer()
    class Meta:
        model = Skill
        fields = '__all__'
class Personal_DocumentSerializer(BaseSerializer):
    class Meta:
        model = Personal_Document
        fields = '__all__'
class PersonalInformation_list_Serializer(BaseSerializer):
    nationality=CountriesSerializer()
    birth_city=CitiesSerializer()
    domicel=CitiesSerializer()
    
    class Meta:
        model = PersonalInformation
        fields = '__all__'
class DependentEmploymentHistory_list_Serializer(BaseSerializer):
    spouse_dependent=FamilyInformationSerializer()
    job_district=DistrictSerializer()
    class Meta:
        model = DependentEmploymentHistory
        fields = '__all__'
        
class EmploymentHistory_list_Serializer(BaseSerializer):
    job_district=DistrictSerializer()
    class Meta:
        model = EmploymentHistory
        fields = '__all__'
class Education_list_Serializer(BaseSerializer):
    level_of_education=Level_of_EducationSerializer()
    institution_country=CountriesSerializer()
    class Meta:
        model = Education
        fields = '__all__'