from rest_framework import permissions


class BasePermissions(permissions.BasePermission):
#  employee_basic_information.change_sub_wing
    def has_permission(self, request, view):
        # Get the model's app label and model name
        app_label = view.queryset.model._meta.app_label
        model_name = view.queryset.model._meta.model_name
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


