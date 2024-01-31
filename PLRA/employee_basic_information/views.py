from django.shortcuts import render
from django.db.models import ProtectedError
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.contrib.auth import get_user_model
from .serializers import PositionSerializer,LoginSerializers,UserSerializers,OtpSerializer
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login
from rest_framework.permissions import IsAuthenticated,DjangoModelPermissionsOrAnonReadOnly
import json
from rest_framework.decorators import throttle_classes
from django.apps import apps
# from rest_framework.throttling import AnonRateThrottle
from django.contrib.admin.models import LogEntry
from rest_framework.views import APIView
from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import logout
from rest_framework import permissions
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
# from twilio.rest import Client
import random
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from .permissions import BasePermissions
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import permission_required
from django.core.cache import cache
from rest_framework import generics,viewsets
from .models import *
from .serializers import *
from notifications.models import Notification
# Create your views here.
class BaseAPIViewSet(viewsets.ModelViewSet):
    
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter]
    ordering_fields = "__all__"
    pagination_class = LimitOffsetPagination
    permission_classes = [BasePermissions]
    # authentication_classes= [TokenAuthentication]
    search_fields ='__all__'

    def get_queryset(self):
        queryset = super().get_queryset()
        model = self.serializer_class.Meta.model
        self.filterset_fields = {}
        for field in model._meta.fields:
            if not isinstance(field, models.FileField):
                if isinstance(field, (models.IntegerField, models.BooleanField,models.FloatField, models.DecimalField, models.DateField, models.DateTimeField)):
                    self.filterset_fields[field.name] = ['exact', 'lte', 'gte', 'range']
                elif isinstance(field, (models.CharField, models.BooleanField,models.TextField, models.ForeignKey, models.OneToOneField, models.ManyToManyField)):
                    if isinstance(field, models.ForeignKey):
                        related_model = field.related_model
                        if related_model:
                            related_fields = related_model._meta.fields
                            for related_field in related_fields:
                                if isinstance(related_field, (models.CharField, models.TextField,models.BooleanField)):
                                    self.filterset_fields[f'{field.name}__{related_field.name}'] = ['iexact', 'startswith', 'contains']
                                elif isinstance(related_field, (models.IntegerField, models.FloatField, models.DecimalField, models.DateField, models.DateTimeField)):
                                    self.filterset_fields[f'{field.name}__{related_field.name}'] = ['exact', 'lte', 'gte', 'range']
                    else:
                        if isinstance(field, (models.CharField, models.TextField)):
                            self.filterset_fields[field.name] = ['iexact', 'startswith', 'contains']
                        elif isinstance(field, (models.IntegerField, models.FloatField, models.DecimalField, models.DateField, models.DateTimeField)):
                            self.filterset_fields[field.name] = ['exact', 'lte', 'gte', 'range']
        
        return queryset
    def is_instance_associated(self, instance):
        from django.db.models.deletion import Collector
        using = instance._state.db  # Get the database alias associated with the instance
        collector = Collector(using=using)
        try:
           
            collector.collect([instance])
            return False
        except Exception as e:
            return True
            
    @method_decorator(csrf_exempt)
    def update(self, request, *args, **kwargs):
            instance = self.get_object()
            print('executed')
            if self.is_instance_associated(instance):
                return Response(
                    {"error": "Cannot update this instance as it is associated with another instance."},
                    status=status.HTTP_409_CONFLICT
                )
       
            return super().update(request, *args, **kwargs)
    @method_decorator(csrf_exempt)
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        model = self.serializer_class.Meta.model
 
        try:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            model_name = model._meta.verbose_name
            protected_objects_list = list(e.protected_objects)
            related_model_name = protected_objects_list[0]._meta.verbose_name if protected_objects_list else ''
            related_objects_names = ', '.join(str(obj) for obj in protected_objects_list)
            error_message = (
                f"Cannot delete this {model_name} because it is referenced by some {related_model_name}(s): {related_objects_names}."
            )
            return Response(data={"error": error_message}, status=status.HTTP_409_CONFLICT)
        except TypeError as e:
            error_message = str(e)
            return Response(data={"error": error_message}, status=status.HTTP_400_BAD_REQUEST)
   

    class Meta:
        abstract = True
class AdvanceAPIViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter,filters.SearchFilter]
    ordering_fields = "__all__"
    pagination_class = LimitOffsetPagination
    permission_classes = [BasePermissions]
    search_fields ='__all__'

    def get_queryset(self):
        queryset = super().get_queryset()
        model = self.serializer_class.Meta.model
        self.filterset_fields = {}
        for field in model._meta.fields:
            if not isinstance(field, models.FileField):
                if isinstance(field, (models.IntegerField, models.FloatField, models.DecimalField, models.DateField, models.DateTimeField)):
                    self.filterset_fields[field.name] = ['exact', 'lte', 'gte', 'range']
                elif isinstance(field, (models.CharField, models.TextField, models.ForeignKey, models.OneToOneField, models.ManyToManyField)):
                    if isinstance(field, models.ForeignKey):
                        related_model = field.related_model
                        if related_model:
                            related_fields = related_model._meta.fields
                            for related_field in related_fields:
                                if isinstance(related_field, (models.CharField, models.TextField)):
                                    self.filterset_fields[f'{field.name}__{related_field.name}'] = ['iexact', 'startswith', 'contains']
                                elif isinstance(related_field, (models.IntegerField, models.FloatField, models.DecimalField, models.DateField, models.DateTimeField)):
                                    self.filterset_fields[f'{field.name}__{related_field.name}'] = ['exact', 'lte', 'gte', 'range']
                    else:
                        if isinstance(field, (models.CharField, models.TextField)):
                            self.filterset_fields[field.name] = ['iexact', 'startswith', 'contains']
                        elif isinstance(field, (models.IntegerField, models.FloatField, models.DecimalField, models.DateField, models.DateTimeField)):
                            self.filterset_fields[field.name] = ['exact', 'lte', 'gte', 'range']
        
        return queryset
    def get_serializer(self, *args, **kwargs):
        if self.request is not None:
            serializer = super().get_serializer(*args, **kwargs)
            user = self.request.user
            model = serializer.child.Meta.model if isinstance(serializer, serializers.ListSerializer) else serializer.Meta.model
            content_type = ContentType.objects.get_for_model(model)
            permissions = Permission.objects.filter(content_type=content_type)

            if isinstance(serializer, serializers.ListSerializer):
                # Handle list serializer
                child_serializer = serializer.child
                fields = list(child_serializer.fields.keys())
                for field in fields:
                    has_permission = user.has_perm(f'{content_type.app_label}.can_view_{field}')
                    if not has_permission:
                        child_serializer.fields.pop(field, None)
            else:
                # Handle regular serializer
                fields = list(serializer.fields.keys())
                for field in fields:
                    has_permission = user.has_perm(f'{content_type.app_label}.can_add_{field}')
                    if not has_permission:
                        serializer.fields.pop(field, None)
                    has_permission = user.has_perm(f'{content_type.app_label}.can_change_{field}')
                    if not has_permission:
                        serializer.fields.pop(field, None)

            return serializer
    def is_instance_associated(self, instance):
            from django.db.models.deletion import Collector
            using = instance._state.db  # Get the database alias associated with the instance
            collector = Collector(using=using)
            try:
            
                collector.collect([instance])
                return False
            except Exception as e:
                return True
            
    @method_decorator(csrf_exempt)
    def update(self, request, *args, **kwargs):
            instance = self.get_object()
            print('executed')
            if self.is_instance_associated(instance):
                return Response(
                    {"error": "Cannot update this instance as it is associated with another instance."},
                    status=status.HTTP_409_CONFLICT
                )
       
            return super().update(request, *args, **kwargs)
    @method_decorator(csrf_exempt)
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        model = self.serializer_class.Meta.model
 
        try:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            model_name = model._meta.verbose_name
            protected_objects_list = list(e.protected_objects)
            related_model_name = protected_objects_list[0]._meta.verbose_name if protected_objects_list else ''
            related_objects_names = ', '.join(str(obj) for obj in protected_objects_list)
            error_message = (
                f"Cannot delete this {model_name} because it is referenced by some {related_model_name}(s): {related_objects_names}."
            )
            return Response(data={"error": error_message}, status=status.HTTP_409_CONFLICT)
        except TypeError as e:
            error_message = str(e)
            return Response(data={"error": error_message}, status=status.HTTP_400_BAD_REQUEST)
   

    class Meta:
        abstract = True
User = get_user_model()
@api_view(['POST','PATCH','GET'])
# @authentication_classes((TokenAuthentication, ))
# @permission_classes((IsAuthenticated, ))
def userApi( request):
    user = User.objects.all()
    serializer = UserSerializers(user, many=True)
    return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@ensure_csrf_cookie
# @throttle_classes([AnonRateThrottle])
def loginApi(request):
    # permission_classes = (IsAuthenticated,)
    serializer = LoginSerializers(data=request.data, context={ 'request': request })
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']
    password = serializer.validated_data['password']
    authenticate(request, username=user, password=password)
    account_sid = 'AC759a55b26665d3659422aca2014e394f'
    auth_token = '833f9ffef845fb6aaee4fe2b1a572b9f'
    # client = Client(account_sid, auth_token)
    otpGenerated = random.randint(1000, 9999)
    cache.set('otp', otpGenerated, timeout = 120)
    cache.set('user', user)
    # message = client.messages.create(
    # from_='+15417033631',
    # body=f'Your OTP is {otpGenerated}. Do not share your OTP with anyone.',
    # to='+923175001831'
    # )
    return Response(data=otpGenerated,status=status.HTTP_200_OK)
@api_view(['POST'])
def otpApi(request):
    otpGenerated = cache.get('otp')
    userCache = cache.get('user')
    serializer = OtpSerializer(data=request.data, context={ 'request': request })
    serializer.is_valid(raise_exception=True)
    otp = serializer.validated_data.get('otp')
 
    if int(otp) == otpGenerated:
        try:
            Token.objects.filter(user=userCache).delete()
        except:
            pass
        login(request, userCache)
        token = Token.objects.create(user=userCache)
        user = User_list_Serializers(userCache)
       
        # Set user ID in the frontend cookie
        response = Response(data={"Authorization": token.key, "user": user.data}, status=status.HTTP_200_OK)
        response.set_cookie('user_id', userCache.id)  # Assuming user ID is an integer
 
        return response
 
    return Response(data={"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def Logout(request):
    # Check if the user is authenticated before logging out
    if request.user.is_authenticated:
        token = Token.objects.get(user=request.user)
        token.delete()
        logout(request)
        return Response(data={"message":"200"},status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
class Positionapi(BaseAPIViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return Position_list_Serializer  
        return super().get_serializer_class()
    
   #this is django user api

class UserAPI(BaseAPIViewSet):
    
    queryset = User.objects.all()
    serializer_class = UserSerializers
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return User_list_Serializers
        return super().get_serializer_class()
    # def list(self, request):
    #     queryset = User.objects.all()
    #     page = self.paginate_queryset(queryset)
    #     if page is not None:
    #         serializer = User_list_Serializers(page, many=True)     
    #         return self.get_paginated_response(serializer.data)
    #     serializer = User_list_Serializers(queryset, many=True)
    #     return Response(serializer.data)
  

class PermissionAPI(BaseAPIViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer 
class NotificationAPI(BaseAPIViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer 
class GroupAPI(BaseAPIViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer 

class ModelListView(generics.ListAPIView):
    def get_queryset(self):
        user = User.objects.get(cnic=self.request.user.cnic)
        models = ContentType.objects.exclude(app_label__in=["authtoken", "admin", "contenttypes", "sessions"]).exclude(model__in=["permission"]).all()
        data = {}
 
        for model in models:
            if user.has_perm(f'{model.app_label}.view_{model.model}'):
                permissions = []
                advanced_permissions = []
                field_permissions={}
               
                for perm in Permission.objects.filter(content_type=model):
                    if user.has_perm(f'{model.app_label}.{perm.codename}'):
                        if any(word in perm.codename for word in ['can_view', 'can_add', 'can_change']):
                            field_name = perm.name.replace("Can ", "").replace("_", " ").upper()
                            permission_data = {
                                'id': perm.id,
                                'name': perm.name.replace("Can ", "").replace("_", " ").upper()
                            }

                            # Extract the common part of the field_name
                            common_part = field_name.replace("ADD", "").replace("VIEW", "").replace("CHANGE", "")

                            # Check if the common_part is already in the dictionary
                            if common_part in field_permissions:
                                # Append permission_data to the existing list
                                field_permissions[common_part].append(permission_data)
                            else:
                # Create a new entry with a list containing permission_data
                                field_permissions[common_part] = [permission_data]
                            advanced_permissions = [{ key.replace("ADD","").replace("VIEW","").replace("CHANGE",""): value} for key, value in field_permissions.items()]
                        else:
                            permissions.append({
                                'id': perm.id,
                                'name': perm.codename.split('_', 1)[0].title() 
                            })
                
                app_label_name = model.model_class()._meta.app_label
                app_name = str(apps.get_app_config(app_label_name).verbose_name)
                model_name = model.model_class()._meta.verbose_name.title() if model.model_class()._meta.verbose_name else model.model
                
                if app_name not in data:
                    data[app_name] = []
                
                data[app_name].append({
                    'model_name': model_name.replace(" ","_").replace("__","_"),
                    'base_permissions': permissions,
                    'advanced_permissions': advanced_permissions
                })
        return data
 
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response(data=queryset, status=status.HTTP_200_OK)
class Routes(generics.ListAPIView):
    def get_queryset(self):
        user = User.objects.get(cnic=self.request.user.cnic)
        models = ContentType.objects.all()
        data = {'setups': {}, 'processes': {}}
 
        for model in models:
            try:
                model_class = model.model_class()  
                if user.has_perm(f'{model.app_label}.view_{model.model}'):
                    permissions = []
                    advanced_permissions = []
   
                    perms = Permission.objects.filter(content_type=model)
   
                    for perm in perms:
                        codename = perm.codename
   
                        if user.has_perm(f'{model.app_label}.{codename}'):
                            if any(word in codename for word in ['can_view', 'can_add', 'can_change']):
                                advanced_permissions.append({
                                    'name': perm.name.replace("Can ", "").replace("_", " ").upper()
                                })
                            else:
                                permissions.append({
                                    'Permission': codename.split('_', 1)[0]
                                })
   
                    # Retrieve verbose names if available, otherwise use actual names
                    app_leabel_name =   model.model_class()._meta.app_label
                    # app_verbose_name =
                    app_name = str(apps.get_app_config(app_leabel_name).verbose_name)
                   
                    model_name = model.model_class()._meta.verbose_name.title() if model.model_class()._meta.verbose_name else model.model
   
                    model_data = {
                        'model_name': model_name.replace(" ","_").replace("__","_"),
                        'base_permissions': permissions,
                        'advanced_permissions': advanced_permissions
                    }
   
                    # If the model belongs to 'employee_master_data', append it to 'employee_basic_information'
                    if app_name == 'Employee_Master_Data':
                        app_name = 'Employee'
   
                    if model.model not in ["employee","leaveapply","leavedependablebucket","leavedependabledetail","nocprocess","resignationrequest","accruetable","aarprocess","aarprocessho","disciplinaryproceedinginquiry","leavenondependabledetail","terminationrequest","permission", "positionassignment", "joblevelassignment", "Disciplinary_Proceeding_Inquiry"] and model.app_label not  in ["employee_master_data","progression","elevation", "authtoken", "admin", "contenttypes", "sessions"]:
                        if app_name not in data['setups']:
                            data['setups'][app_name] = []
                        data['setups'][app_name].append(model_data)
                    elif model.app_label not in ["auth", "authtoken", "admin", "contenttypes", "sessions"] and model.model not in [ "joblevelassignment","cities","countries","district","tehsil","level_of_education","level_of_skill"]:
                        if app_name not in data['processes']:
                            data['processes'][app_name] = []
                        data['processes'][app_name].append(model_data)
            except Exception as e:
                print(f"Error processing model {model}: {e}")
        return data
 
    def list(self, request, *args, **kwargs):
        print(request.user)
        queryset = self.get_queryset()
        return Response(data=queryset, status=status.HTTP_200_OK)

class RecentActionsAPI(BaseAPIViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = RecentActionSerializer
class JobAPI(BaseAPIViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return Job_list_Serializer  
        return super().get_serializer_class()
   
class CenterAPI(BaseAPIViewSet):
    # permission_classes=[IsAuthenticated]
    queryset = Center.objects.all()
    serializer_class = CenterSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return Center_list_Serializer  
        return super().get_serializer_class()
    
class RegionAPI(BaseAPIViewSet):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError as e:
            error_message = (
                f"Cannot delete this Region because it is referenced by some Division(s): {', '.join(map(str, e.protected_objects))}."
            )
            return Response(data={"error": error_message}, status=status.HTTP_409_CONFLICT)
        

class WingAPI(BaseAPIViewSet):
    queryset = Wing.objects.all()
    serializer_class = WingSerializer
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
                return WingListSerializer
        return super().get_serializer_class() 

class SubWingAPI(BaseAPIViewSet):
    queryset = Sub_Wing.objects.all()
    serializer_class = Sub_WingSerializer
    
    def get_serializer_class(self):
        if self.action == 'list':
            return Sub_Wing_list_Serializer  
        return super().get_serializer_class()
    
class DivisionAPI(BaseAPIViewSet):
    queryset = Division.objects.all()
    serializer_class = DivisionSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return Division_list_Serializer  
        return super().get_serializer_class()
class DistrictAPI(BaseAPIViewSet):
    queryset = District.objects.all()
    serializer_class = DistrictSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return District_list_Serializer  
        return super().get_serializer_class()
class EmployeeTitleAPI(BaseAPIViewSet):
    queryset = Employee_Title.objects.all()
    serializer_class = Employee_TitleSerializer
class TehsilAPI(BaseAPIViewSet):
    queryset = Tehsil.objects.all()
    serializer_class = TehsilSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return Tehsil_list_Serializer  
        return super().get_serializer_class()
class PositionTypeAPI(BaseAPIViewSet):
    queryset = PositionType.objects.all()
    serializer_class = PositionTypeSerializer
class PpgLevelSetupAPI(BaseAPIViewSet):
    queryset = Ppg_Level_Setup.objects.all()
    serializer_class = Ppg_Level_SetupSerializer
class JobLevelAPI(BaseAPIViewSet):
    queryset = JobLevel.objects.all()
    serializer_class = JobLevelSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return JobLevel_list_Serializer  
        return super().get_serializer_class()
class JobLevelAssignmentAPI(BaseAPIViewSet):
    queryset = JobLevelAssignment.objects.all()
    serializer_class = JobLevelAssignmentSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return JobLevelAssignment_list_Serializer  
        return super().get_serializer_class()
class PositionAssignmentAPI(BaseAPIViewSet):
    queryset = PositionAssignment.objects.all()
    serializer_class = PositionAssignmentSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return PositionAssignment_level_Serializer  
        return super().get_serializer_class()
    
class JobLevelValidityAPI(BaseAPIViewSet):
    queryset = JobLevelValidity.objects.all()
    serializer_class = JobLevelValiditySerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return JobLevelValidity_level_Serializer  
        return super().get_serializer_class()
class ApprovalMatrixAPI(BaseAPIViewSet):
    queryset = ApprovalMatrix.objects.all()
    serializer_class = ApprovalMatrixSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return Approval_list_MatrixSerializer  
        return super().get_serializer_class()
