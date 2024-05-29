from rest_framework import permissions

from django.contrib.auth.models import Permission as pr
from django.contrib.contenttypes.models import ContentType

def assign_model_permissions_to_user(model_class, user):
    # Get the content type for the given model
    content_type = ContentType.objects.get_for_model(model_class)
    
    # Get all permissions for the model
    permissions = pr.objects.filter(content_type=content_type)
    
    # Assign each permission to the user
    for permission in permissions:
        user.user_permissions.add(permission)
    user.save()
class BasePermissions(permissions.BasePermission):
#  employee_basic_information.change_sub_wing
    def has_permission(self, request, view):
        # Get the model's app label and model name
        app_label = view.queryset.model._meta.app_label
        model_name = view.queryset.model._meta.model_name
        # Bypass permission checks for GET requests
        if request.method == 'GET':
            return True
        if request.method in permissions.SAFE_METHODS:
            perm_string = f'{app_label}.view_{model_name}'
            if request.user.has_perm(perm_string):
                return True
            return False
        elif request.method == 'POST':
            perm_string = f'{app_label}.add_{model_name}'
            
            if request.user.has_perm(perm_string):
                return True
            return False
        elif request.method == 'DELETE':
            perm_string = f'{app_label}.delete_{model_name}'
            
            if request.user.has_perm(perm_string):
                return True
            return False
        elif request.method == 'PUT':
            perm_string = f'{app_label}.change_{model_name}'
            
            if request.user.has_perm(perm_string):
                return True
            return False


