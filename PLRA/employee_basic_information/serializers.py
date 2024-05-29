
import json
from django.forms.models import model_to_dict
from rest_framework import serializers, permissions
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from.models import *
from django.contrib.auth.models import Permission, Group
from django.contrib.admin.models import LogEntry,ACTION_FLAG_CHOICES
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission
from notifications.models import Notification

User = get_user_model()

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
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__' 
class ModelListSerializer(serializers.Serializer):
    app_name = serializers.CharField()
    model_name = serializers.CharField()
    base_permissions = serializers.ListField(child=serializers.DictField())
    advanced_permissions = serializers.ListField(child=serializers.DictField())

class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentType
        fields = '__all__'
class PermissionSerializer(serializers.ModelSerializer):
    content_type=ContentTypeSerializer()
    class Meta:
        model = Permission
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__' 

#     class Meta:
#         pass
class EmployeeSerializers(BaseSerializer):
     
    class Meta:
        model = Employee
        fields = '__all__'
class CenterSerializer(BaseSerializer):
    class Meta:
        model = Center
        fields = '__all__'
class PositionSerializer(BaseSerializer):
    class Meta:
        model = Position
        fields = "__all__"
        # ['p_rec_id','no_of_position','open_position','job','location','wing','sub_wing','position_type','position_desc','position_id']
# class UserSerializers(BaseSerializer):
class UserSerializers(serializers.ModelSerializer):
    # def to_internal_value(self, data):
    #     print("Original data:", data)
    #     if 'groups' in data:
    #         try:
    #             # Attempt to parse the string as a JSON list
    #             groups_list = json.loads(data['groups'])
    #             # Convert all items to integers
    #             data['groups'] = [int(group) for group in groups_list]
    #         except (ValueError, TypeError):
    #             raise serializers.ValidationError({
    #                 'groups': 'Invalid format for groups, expected a JSON array of integers.'
    #             })
       
    #     processed_data = super().to_internal_value(data)
    #     print("Processed data:", processed_data)
    #     return processed_data
 
    class Meta:
        model = User
        fields = '__all__'
#         fields = ['employee_image','employee_domicile_image','employee_cnic_image','id','employee_no','cnic','first_name','last_name','father_name','passport_number','domicile_district','phoneNumber','title','date_of_joining','service_duration','center','position','reporting_officer','counter_assigning_officer','is_staff','is_active','is_superuser',
# ]

class Employee_TitleSerializer(BaseSerializer):
    class Meta:
        model = Employee_Title
        fields = '__all__'



class LoginSerializers(serializers.Serializer):
    username = serializers.CharField(
        label="Username",
        write_only=True
    )
    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if not user:
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        attrs['user'] = user
        return attrs

class OtpSerializer(serializers.Serializer):
    otp = serializers.CharField(
        label= 'otp',
        write_only= True
    )





        
class JobSerializer(BaseSerializer):
    class Meta:
        model = Job
        fields = ['j_rec_id','ppg_level','job_title','job_abbrivation','no_of_seniority_level']
        
  


class DistrictSerializer(BaseSerializer):
    class Meta:
        ref_name = 'DistrictSerializerBasicInfo'
        model = District
        fields = '__all__'
        
        
class JobLevelSerializer(BaseSerializer):
    class Meta:
        model = JobLevel
        fields = '__all__'

class JobLevelsSerializer(BaseSerializer):
    job=JobSerializer()
    class Meta:
        model = JobLevel
        fields = '__all__'
        
        
class PositionTypeSerializer(BaseSerializer):
    class Meta:
        model = PositionType
        fields = '__all__'
        
class Ppg_Level_SetupSerializer(BaseSerializer):
    class Meta:
        model = Ppg_Level_Setup
        fields = '__all__'
        
class RegionSerializer(BaseSerializer):
    class Meta:
        model = Region
        fields = '__all__'
        
class WingSerializer(BaseSerializer):
    class Meta:
        model = Wing
        fields = ['wing_id','w_rec_id','wing_name','director_concern_position','adg']
class WingListSerializer(BaseSerializer):
    director_concern_position=PositionSerializer()
    adg=PositionSerializer()
    class Meta:
        model = Wing
        fields = ['wing_id','w_rec_id','wing_name','director_concern_position','adg']
class Sub_WingSerializer(BaseSerializer):
    class Meta:
        model = Sub_Wing
        fields = '__all__'
class Sub_Wing_list_Serializer(BaseSerializer):
    wing=WingSerializer()
    class Meta:
        ref_name = 'Sub_Wing_list_Serializer'
        model = Sub_Wing
        fields = '__all__'
        
class TehsilSerializer(BaseSerializer):
    class Meta:
        ref_name = 'TehsilSerializerBasicInfo'
        model = Tehsil
        fields = '__all__'
        
class DivisionSerializer(BaseSerializer):
    class Meta:
        model = Division
        fields = '__all__'
class JobLevelAssignmentSerializer(BaseSerializer):
    class Meta:
        model = JobLevelAssignment
        fields = '__all__'
class PositionAssignmentSerializer(BaseSerializer):
    class Meta:
        model = PositionAssignment
        fields = '__all__'
class JobLevelValiditySerializer(BaseSerializer):
    class Meta:
        model = JobLevelValidity
        fields = '__all__'
class ApprovalMatrixSerializer(BaseSerializer):
    class Meta:
        model = ApprovalMatrix
        fields = '__all__'

class Center_list_Serializer(BaseSerializer):
    region=RegionSerializer()
    division=DivisionSerializer()
    district=DistrictSerializer()
    tehsil=TehsilSerializer()
    class Meta:
        ref_name = 'Center_list_Serializer' 
        model = Center
        fields = '__all__'
class Division_list_Serializer(BaseSerializer):
    region=RegionSerializer()
    class Meta:
        ref_name = 'Division_list_Serializer'
        model = Division
        fields = '__all__'
class District_list_Serializer(BaseSerializer):
    division=Division_list_Serializer()
    class Meta:
        ref_name = 'District_list_Serializer'
        model = District
        fields = '__all__'
class Tehsil_list_Serializer(BaseSerializer):
    district=District_list_Serializer()
    class Meta:
        ref_name = 'Tehsil_list_Serializer'
        model = Tehsil
        fields = '__all__'

class JobLevel_list_Serializer(BaseSerializer):
    job=JobSerializer()
    class Meta:
        ref_name = 'JobLevel_list_Serializer'
        model = JobLevel
        fields = '__all__'
        
class JobLevelAssignment_list_Serializer(BaseSerializer):
    employee=UserSerializers()
    job_level=JobLevel_list_Serializer()
    class Meta:
        ref_name = 'JobLevelAssignment_list_Serializer'
        model = JobLevelAssignment
        fields = '__all__'
class JobListSerializer(BaseSerializer):
    ppg_level=Ppg_Level_SetupSerializer()
    class Meta:
        model = Job
        fields = ['j_rec_id','ppg_level','job_title','job_abbrivation','no_of_seniority_level']     
class Position_list_Serializer(BaseSerializer):
    job=JobListSerializer()
    location=Center_list_Serializer()
    wing=WingSerializer()
    sub_wing=Sub_WingSerializer()
    position_type=PositionTypeSerializer()
    class Meta:
        ref_name = 'Position_list_Serializer'
        model = Position
        fields = "__all__"
        
class PositionAssignment_level_Serializer(BaseSerializer):
    employee=UserSerializers()
    position=Position_list_Serializer()
    class Meta:
        ref_name = 'PositionAssignment_level_Serializer'
        model = PositionAssignment
        fields = '__all__'
        
class JobLevelValidity_list_Serializer(BaseSerializer):
    job_level=JobLevelsSerializer()
    class Meta:
        model = JobLevelValidity
        fields = '__all__'

class Job_list_Serializer(BaseSerializer):
    ppg_level=Ppg_Level_SetupSerializer()
    class Meta:
        ref_name = 'Job_list_Serializer'
        model = Job
        fields = '__all__'
        
class JobLevelValidity_level_Serializer(BaseSerializer):
    job_level=JobLevelsSerializer()
    class Meta:
        ref_name = 'JobLevelValidity_level_Serializer'
        model = JobLevelValidity
        fields = '__all__'
class Approval_list_MatrixSerializer(BaseSerializer):
    position=Position_list_Serializer()
    reporting_position=Position_list_Serializer()
    counter_assigning_position=Position_list_Serializer()
    dg_admin=Position_list_Serializer()
    
    class Meta:
        ref_name = 'Approval_list_MatrixSerializer'
        model = ApprovalMatrix
        fields = '__all__'
        
class ContentTypeSerializer(BaseSerializer):
    
    class Meta:
        model = ContentType
        fields = '__all__'   
        



# class RecentActionSerializer(serializers.ModelSerializer):
#     user = UserSerializers()
#     action_flag = serializers.SerializerMethodField()
#     content_type = ContentTypeSerializer()

#     class Meta:
#         model = LogEntry
#         fields = '__all__'

#     def get_action_flag(self, obj):
#         return dict(ACTION_FLAG_CHOICES).get(obj.action_flag, 'Unknown')

class RecentActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'

    def create(self, validated_data):
        validated_data['change_message'] = self.get_change_message(validated_data)
        return super().create(validated_data)

    def get_change_message(self, obj):
        # return obj.get_change_message()
        # Get the frontend last visit link from the request or any other source
        frontend_last_visit_link = self.context.get('request').build_absolute_uri()

        # Combine the frontend last visit link with the default link
        return f"{obj.get_change_message()} | {frontend_last_visit_link}"


class User_list_Serializers(BaseSerializer):
    # history = serializers.SerializerMethodField()
    
    reporting_officer=EmployeeSerializers()
    counter_assigning_officer=EmployeeSerializers()
    center=CenterSerializer()
    position=Position_list_Serializer()
    title=Employee_TitleSerializer()
    groups=GroupSerializer(many=True)
    class Meta:
        ref_name = 'User_list_Serializers'
        model = User
        fields = '__all__'
        # fields = ['id','employee_no','cnic','first_name','last_name','father_name','passport_number','domicile_district','phoneNumber','title','date_of_joining','service_duration','center','position','reporting_officer','counter_assigning_officer','is_staff','is_active','is_superuser',
# ]

    # def get_history(self, obj):
    #     history_records = obj.history.all()
    #     serialized_history = []

    #     for record in history_records:
    #         serialized_record = model_to_dict(record)
    #         serialized_history.append(serialized_record)

    #     return serialized_history
from rest_framework import serializers

class CountWithNameSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    name = serializers.CharField()

class ProcessCountsSerializer(serializers.Serializer):
    leave_count = CountWithNameSerializer()
    termination_count = CountWithNameSerializer()
    resignation_count = CountWithNameSerializer()
    elevation_count = CountWithNameSerializer()
    progression_count = CountWithNameSerializer()
    administrative_transfer_count = CountWithNameSerializer()
    e_transfer_count = CountWithNameSerializer()
    annual_assessment_count = CountWithNameSerializer()
    noc_count=CountWithNameSerializer()

class EmployeeMiniDashboardSerializer(serializers.Serializer):
    employee_id = User_list_Serializers() # Adjust based on your model structure
    process_counts = ProcessCountsSerializer()
