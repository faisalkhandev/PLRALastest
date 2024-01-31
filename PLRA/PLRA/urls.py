"""
URL configuration for PLRA project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings
from employee_basic_information.views import userApi,Logout
from employee_basic_information.views import loginApi
from employee_basic_information.views import otpApi

from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="PLRA API DOCUMENTATION",
        default_version='v1',
        description="This is the API documentation for the PLRA project. It provides information about the available endpoints, request and response formats, and authentication methods.",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name = 'base.html')),
    path('basic-info/', include('employee_basic_information.urls')),
    path('master-data/', include('employee_master_data.urls')),
    path('leave/', include('leave_setup.urls')),
    path('competent_authority/', include('competent_authority.urls')),
    path('elevation/', include('elevation.urls')),
    path('progression/', include('progression.urls')),
    path('hr-celander/', include('HR_Setups.urls')),
    path('desiplinary-preceeding/', include('disciplinary_proceedings_setup.urls')),
    path('E_transfer/', include('transfer_setup.urls')),
    path('Administrative_transfer/', include('simple_transfer_Setup.urls')),
    path('annual-assessment/', include('annual_assessment_setup.urls')),
    path('resignation/', include('resignation.urls')),
    path('termination/', include('termination.urls')),
    path('noc/', include('noc.urls')),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('userApi/', userApi),
    path('loginApi/', loginApi),
    path('loginoutApi/', Logout),
    path('otpApi/', otpApi),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
