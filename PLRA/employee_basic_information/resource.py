from import_export import resources 
from .models import *

class EmployeeResource(resources.ModelResource):
    class Meta:
        model = Employee

class WingResource(resources.ModelResource):
    class Meta:
        model = Wing

class SubWingResource(resources.ModelResource):
    class Meta:
        model = Sub_Wing

class RegionResource(resources.ModelResource):
    class Meta:
        model = Region

class DivisionResource(resources.ModelResource):
    class Meta:
        model = Division

class DistrictResource(resources.ModelResource):
    class Meta:
        model = District

class TehsilResource(resources.ModelResource):
    class Meta:
        model = Tehsil

class CenterResource(resources.ModelResource):
    class Meta:
        model = Center

class PositionTypeResource(resources.ModelResource):
    class Meta:
        model = PositionType

class PpgLevelSetupResource(resources.ModelResource):
    class Meta:
        model = Ppg_Level_Setup

class JobResource(resources.ModelResource):
    class Meta:
        model = Job

class JobLevelResource(resources.ModelResource):
    class Meta:
        model = JobLevel

class PositionResource(resources.ModelResource):
    class Meta:
        model = Position

class JobLevelAssignmentResource(resources.ModelResource):
    class Meta:
        model = JobLevelAssignment

class ApprovalMatrixResource(resources.ModelResource):
    class Meta:
        model = ApprovalMatrix

class EmployeeTitleResource(resources.ModelResource):
    class Meta:
        model = Employee_Title

class PositionAssignmentResource(resources.ModelResource):
    class Meta:
        model = PositionAssignment

class JobLevelValidityResource(resources.ModelResource):
    class Meta:
        model = JobLevelValidity
class EmployeePayrollClassResource(resources.ModelResource):
    class Meta:
        model = EmployeePayrollClass