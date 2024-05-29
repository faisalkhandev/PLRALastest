
from rest_framework import generics
from disciplinary_proceedings_setup.models import *
from leave_setup.leave_calculations import LeaveCalculationService
from .serializers import *
from leave_setup.models import *
from termination.models import *
from resignation.models import *
from elevation.models import *
from progression.models import *
from simple_transfer_Setup.models import *
from annual_assessment_setup.models import *
from transfer_setup.models import *
from noc.models import *
from rest_framework.response import Response
from rest_framework.views import APIView
import random
from django.http import JsonResponse


class EmployeeMiniDashboard(generics.ListAPIView):
    serializer_class = EmployeeDashboardProcessCountsSerializer

    def get_queryset(self):
        employee = self.request.user
        

        return [self.aggregate_counts(employee)]
    def has_model_permission(self, user, model_cls):
        # Dynamically get the app label and model name
        app_label = model_cls._meta.app_label
        model_name = model_cls._meta.model_name

        # Construct the permission string
        permission_view = f'{app_label}.view_{model_name}'
        permission_add = f'{app_label}.add_{model_name}'
        permission_change = f'{app_label}.change_{model_name}'
        permission_delete = f'{app_label}.delete_{model_name}'

        # Check if the user has any of the permissions related to the model
        return any([
            user.has_perm(permission_view),
            user.has_perm(permission_add),
            user.has_perm(permission_change),
            user.has_perm(permission_delete)
        ])

    def aggregate_counts(self, employee):
        process_counts = {}
        if self.has_model_permission(self.request.user, LeaveApply):
            current_year = datetime.now().year
            service = LeaveCalculationService(employee, current_year)
            results = service.calculate_leave_counts()
            process_counts['Leave'] = results
        if self.has_model_permission(self.request.user, TerminationRequest):
            process_counts['Termination'] = [{
                'count': TerminationRequest.objects.filter(status='In process').count(),
                'name': 'In Process'
            },{
                'count': TerminationRequest.objects.filter(status='Closed').count(),
                'name': 'Closed'
            }]
        if self.has_model_permission(self.request.user, ResignationRequest):
            
            process_counts['Resignation'] = [{
                'count': ResignationRequest.objects.filter(employee=employee, status='In process').count(),
                'name': 'In Process'
            }, {
                'count': ResignationRequest.objects.filter(employee=employee, status='Approved').count(),
                'name': 'Approved'
            }, {
                'count': ResignationRequest.objects.filter(employee=employee, status='Rejected').count(),
                'name': 'Rejected'
            }]
            
        if self.has_model_permission(self.request.user, PendingElevation):
            process_counts['Elevation']= [{
                'count': PendingElevation.objects.filter(status='New').count(),
                'name': 'Up-comming Elevation'
            },{
                'count': PendingElevation.objects.filter(status='In Process').count(),
                'name': 'In Process'
            },{
                'count': PendingElevation.objects.filter(status='Approved').count(),
                'name': 'Approved'
            },{
                'count': PendingElevation.objects.filter(status='Reject').count(),
                'name': 'Rejected'
            },]
        if self.has_model_permission(self.request.user, PendingProgression):
            process_counts['Progression']=[{
                'count': PendingProgression.objects.filter(status='New').count(),
                'name': 'Up-comming Progression'
            },{
                'count': PendingProgression.objects.filter(status='In Process').count(),
                'name': 'In Process'
            },{
                'count': PendingProgression.objects.filter(status='Approved').count(),
                'name': 'Approved'
            },{
                'count': PendingProgression.objects.filter(status='Reject').count(),
                'name': 'Rejected'
            },]
        if self.has_model_permission(self.request.user, Transfer_Process):
            process_counts['Administrative_Transfer']=[{
                'count': Transfer_Process.objects.filter(status='In Process').count(),
                'name': 'In Process'
            },{
                'count': Transfer_Process.objects.filter(status='Approved').count(),
                'name': 'Approved'
            },
            {
                'count': Transfer_Process.objects.filter(status='Rejected').count(),
                'name': 'Rejected'
            },]
        if self.has_model_permission(self.request.user, E_Transfer_Process):
            process_counts['E_Transfer']= [{
                'count': E_Transfer_Process.objects.filter(employee=employee,status='In Process').count(),
                'name': 'In Process'
            },{
                'count': E_Transfer_Process.objects.filter(employee=employee,status='Approved').count(),
                'name': 'Approved'
            },{
                'count': E_Transfer_Process.objects.filter(employee=employee,status='Reject').count(),
                'name': 'Rejected'
            }]
        if self.has_model_permission(self.request.user, AARProcess):
            process_counts['Annual_Assessment']= [{
                'count': AARProcess.objects.filter(employee=employee,status='In process').count(),
                'name': 'In process'
            },{
                'count': AARProcess.objects.filter(employee=employee,status='Completed').count(),
                'name': 'Completed'
            }]
        if self.has_model_permission(self.request.user, DisciplinaryProceedingRequest):
            process_counts['Disciplinary']= [{
                'count': DisciplinaryProceedingRequest.objects.filter(employee=employee,inquiry_status='In process').count(),
                'name': 'In process'
            },{
                'count': DisciplinaryProceedingRequest.objects.filter(employee=employee,inquiry_status='Closed').count(),
                'name': 'Closed'
            }]
        
        return {
            'employee_id': employee,
            'process_counts': process_counts
        }


class EmployeeApprovalCounts(generics.ListAPIView):
    serializer_class = EmployeeApprovalCountsSerializer

    def get_queryset(self):
        employee = self.request.user
        

        return [self.aggregate_counts(employee)]
    def check_reporting_officer(self, employee):
        try:
            return Employee.objects.filter(reporting_officer=employee).exists()
        except Exception as e:
            print(f"Error checking reporting officer: {e}")
            return False

    def check_counter_signing_officer(self, employee):
        try:
            return Employee.objects.filter(counter_assigning_officer=employee).exists()
        except Exception as e:
            print(f"Error checking counter signing officer: {e}")
            return False
    def check_Director_Hr(self, employee):
        try:
            hr_position = CompetentAuthority.objects.filter(designation='HR DIRECTOR').first()
            return employee.position == hr_position.employee_position
        except Exception as e:
            print(f"Error checking Director HR: {e}")
            return False
    def check_DG(self, employee):
        try:
            dg_position = CompetentAuthority.objects.filter(designation='DG').first()
            return employee.position == dg_position.employee_position
        except Exception as e:
            print(f"Error checking DG: {e}")
            return False
        
    def check_Leave_super_approval(self, employee):
        try:
            related_position = CompetentAuthority.objects.filter(designation='LEAVE SUPER APPROVAL').first()
            return employee.position == related_position.employee_position
        except Exception as e:
            print(f"Error checking Leave super approval: {e}")
            return False
    def check_hr_user(self, employee):
        try:
            related_positions = CompetentAuthority.objects.filter(designation='HR User')
            return any(employee.position == pos.employee_position for pos in related_positions)
        except Exception as e:
            print(f"Error checking HR user: {e}")
            return False
    def check_concern_officer(self, employee):
        try:
            related_positions = CompetentAuthority.objects.filter(designation='CONCERN OFFICER')
            return any(employee.position == pos.employee_position for pos in related_positions)
        except Exception as e:
            print(f"Error checking HR user: {e}")
            return False
    def check_wing_director(self, employee):
        try:
            return employee.position.wing.director_concern_position == employee.position
        except Exception as e:
            print(f"Error checking wing director: {e}")
            return False
  
    def check_wing_adg(self, employee):
        try:
            return employee.position.wing.adg == employee.position
        except Exception as e:
            print(f"Error checking wing ADG: {e}")
            return False
   
        
    def check_probe_officer(self, employee):
        try:
            return DisciplinaryProceedingRequest.objects.filter(prob_officer=employee).exists()
        except Exception as e:
            print(f"Error checking probe officer: {e}")
            return False
    def check_regular_inquiry_officer(self, employee):
        try:
            return DisciplinaryProceedingRequest.objects.filter(regular_inquiry_officer=employee).exists()
        except Exception as e:
            print(f"Error checking regular inquiry officer: {e}")
            return False
    def aggregate_counts(self, employee):
        process_counts = {}

        if self.check_DG(employee=employee):
            process_counts.setdefault('Annual_Assessment', []).append(
                {'counts': AARCompetentAuthorityApproval.objects.filter(competent_authority=employee, visible=True).count(),
                'name': 'Competent Authority Approvals', 'path': 'annualassesment/center/competentauthority'}
            )
            process_counts.setdefault('Disciplinary', []).extend([
                {'counts': DGFirstApproval.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'DG First Level Approvals', 'path': 'disciplinaryprocedingapproval/dgfirstapproval'},
                {'counts': DGFinalApproval.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'DG Final Level Approvals', 'path': 'disciplinaryprocedingapproval/dgfinalapproval'}
            ])
            process_counts.setdefault('Progression', []).append(
                {'counts': ProgressionDocument.objects.filter(status='In Process').count(),
                'name': 'Progression Approvals', 'path': 'ProgressionProcess'}
            )
            process_counts.setdefault('Elevation', []).append(
                {'counts': ProgressionDocument.objects.filter(status='In Process').count(),
                'name': 'Elevation Approvals', 'path': 'ElevationProcess'}
            )

        if self.check_reporting_officer(employee=employee) or self.check_wing_adg(employee=employee) or self.check_wing_director(employee=employee) or self.check_DG(employee=employee):
            process_counts.setdefault('Leave', []).append(
                {'counts': Approvals.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'Leave Approvals', 'path': 'leaveapproval'}
            )

        if self.check_Leave_super_approval(employee=employee) :
            process_counts.setdefault('Leave', []).append(
                {'counts': SuperApprovals.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'Alternate Leave Approvals', 'path': 'superapproval'}
            )
            
       

        if self.check_reporting_officer(employee=employee) or self.check_DG(employee=employee) or self.check_Director_Hr(employee=employee) or self.check_wing_adg(employee=employee):
            process_counts.setdefault('Resignation', []).append(
                {'counts': ResignationApprovals.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'Resignation Approvals', 'path': 'resignationapproval'}
            )

            process_counts.setdefault('Termination', []).append(
                {'counts': TerminationApprovals.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'Termination Approvals', 'path': 'terminationapproval'}
            )

        if self.check_Director_Hr(employee=employee):
            process_counts.setdefault('NOC', []).append(
                {'counts': NocApprovals.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'NOC Approvals', 'path': 'nocapproval'}
            )
            process_counts.setdefault('Administrative_Transfer', []).append(
                {'counts': TransferApprovals.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'Administrative Transfer Approvals', 'path': 'transferapproval'}
            )
            

        if self.check_counter_signing_officer(employee=employee):
            process_counts.setdefault('Annual_Assessment', []).extend([
                {'counts': AARHOCounterAssigningOfficerApproval.objects.filter(counter_assigning_officer=employee, visible=True).count(),
                'name': 'Counter-Signing Officer Head Office Approvals', 'path': 'annualassesment/headoffice/counter'},
                {'counts': AARCounterAssigningOfficerApproval.objects.filter(counter_assigning_officer=employee, visible=True).count(),
                'name': 'Counter-Signing Officer Center Approvals', 'path': 'annualassesment/center/counter'}
            ])

        if self.check_reporting_officer(employee=employee):
            process_counts.setdefault('Annual_Assessment', []).extend([
                {'counts': AARHOReportingOfficerApproval.objects.filter(reporting_officer=employee, visible=True).count(),
                'name': 'Reporting Officer Head Office Approvals', 'path': 'annualassesment/headoffice/reportingOfficer'},
                {'counts': AARReportingOfficerApproval.objects.filter(reporting_officer=employee, visible=True).count(),
                'name': 'Reporting Officer Center Approvals', 'path': 'annualassesment/center/reportingofficer'}
            ])

        if self.check_hr_user(employee=employee):
            process_counts.setdefault('Disciplinary', []).append(
                {'counts': HRUserApproval.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'HR User Approvals', 'path': 'disciplinaryprocedingapproval/hruserapproval'}
            )
        if self.check_concern_officer(employee=employee):
            process_counts.setdefault('E_Transfer', []).append(
                {'counts': ConcernOfficerApproval.objects.filter(concern_officer_authority=employee, visible=True).count(),
                'name': 'Concern Officer Approvals', 'path': 'transferwindow'}
            )

        if self.check_Director_Hr(employee=employee):
            process_counts.setdefault('Disciplinary', []).append(
                {'counts': DirectorHrApproval.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'Director HR Approvals', 'path': 'disciplinaryprocedingapproval/dirhrapproval'}
            )
            process_counts.setdefault('Progression', []).append(
                {'counts': ProgressionDocument.objects.filter(status='In Process').count(),
                'name': 'Progression Approvals', 'path': 'ProgressionProcess'}
            )
            process_counts.setdefault('Elevation', []).append(
                {'counts': ProgressionDocument.objects.filter(status='In Process').count(),
                'name': 'Elevation Approvals', 'path': 'ElevationProcess'}
            )
            process_counts.setdefault('E_Transfer', []).append(
                {'counts': HRDirectorETransferApproval.objects.filter(concern_officer_authority=employee, visible=True).count(),
                'name': 'HR Director Approvals', 'path': 'hrdirtransferapproval'}
            )

        if self.check_probe_officer(employee=employee):
            process_counts.setdefault('Disciplinary', []).append(
                {'counts': ProbeOfficerApproval.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'Probe Officer Approvals', 'path': 'disciplinaryprocedingapproval/probofficerapproval'}
            )

        if self.check_regular_inquiry_officer(employee=employee):
            process_counts.setdefault('Disciplinary', []).append(
                {'counts': RegularInquiryOfficerApproval.objects.filter(approving_authority=employee, visible=True).count(),
                'name': 'Regular Inquiry Officer Approvals', 'path': 'disciplinaryprocedingapproval/regularinquiryofficerapproval'}
            )

        return {
            'process_counts': process_counts
        }


class CurrentDateAPI(APIView):

    def get(self, request):
        current_date = datetime.now().date()
        formatted_date = current_date.strftime('%d/%m/%Y')
        return Response({"current_date": formatted_date})

class CenterWiseEmployees(APIView):
    serializer_class=Wing_Wise_Employees
    def get_queryset(self):
        Wing.objects.all()
        
def get_dashboard_count(request):
    res=[]
    path=request.get_full_path().split('?')[1].split('=')
    if 'all=1' in request.get_full_path().split('?')[1]:
        total_positions= Position.objects.all().count()
        vacant_positions= Position.objects.filter(Q(open_position=True)).count()
        occupied= Position.objects.filter(Q(open_position=False)).count()
        total_employees= Employee.objects.all().count()
        male_employees= PersonalInformation.objects.filter(Q(gender='male')).count()
        female_employees= PersonalInformation.objects.filter(Q(gender='female')).count()
        other_gender_employees= PersonalInformation.objects.filter(Q(gender='other')).count() + (total_employees-male_employees-female_employees)
        employees_on_leave= LeaveApply.objects.filter(Q(from_date__lte=date.today()) & Q(to_date__gte=date.today()) &Q(status='Approved')).count()
        res.append({
            'total_positions': total_positions,
            'total_employees': total_employees,
            'vacant_positions': vacant_positions,
            'occupied': occupied,
            'male_employees': male_employees,
            'female_employees': female_employees,
            'other_gender_employees':other_gender_employees,
            'employees_on_leave': employees_on_leave,
            'absent_employees': random.randint(1, 19)
 
        })
    else:
        if 'region' in path:
            total_positions= Position.objects.filter(Q(location__region__r_rec_id=path[1])).count()
            vacant_positions= Position.objects.filter(Q(open_position=True) & Q(location__region__r_rec_id=path[1])).count()
            occupied= Position.objects.filter(Q(open_position=False) & Q(location__region__r_rec_id=path[1])).count()
            total_employees= Employee.objects.filter(Q(center__region__r_rec_id=path[1])).count()
            male_employees= PersonalInformation.objects.filter(Q(gender='male') & Q(employee__center__region__r_rec_id=path[1])).count()
            female_employees= PersonalInformation.objects.filter(Q(gender='female') & Q(employee__center__region__r_rec_id=path[1])).count()
            other_gender_employees= PersonalInformation.objects.filter(Q(gender='other') & Q(employee__center__region__r_rec_id=path[1])).count() + (total_employees-male_employees-female_employees)
            employees_on_leave= LeaveApply.objects.filter(Q(from_date__lte=date.today()) & Q(to_date__gte=date.today()) &Q(status='Approved') & Q(employee__center__region__r_rec_id=path[1])).count()
            res.append({
                'total_positions': total_positions,
                'total_employees': total_employees,
                'vacant_positions': vacant_positions,
                'occupied': occupied,
                'male_employees': male_employees,
                'female_employees': female_employees,
                'other_gender_employees':other_gender_employees,
                'employees_on_leave': employees_on_leave,
                'absent_employees': random.randint(1, 19)
 
            })
        elif 'division' in path:
            total_positions= Position.objects.filter(Q(location__division__d_rec_id=path[1])).count()
            vacant_positions= Position.objects.filter(Q(open_position=True) & Q(location__division__d_rec_id=path[1])).count()
            occupied= Position.objects.filter(Q(open_position=False) & Q(location__division__d_rec_id=path[1])).count()
            total_employees= Employee.objects.filter(Q(center__division__d_rec_id=path[1])).count()
            male_employees= PersonalInformation.objects.filter(Q(gender='male') & Q(employee__center__division__d_rec_id=path[1])).count()
            female_employees= PersonalInformation.objects.filter(Q(gender='female') & Q(employee__center__division__d_rec_id=path[1])).count()
            other_gender_employees= PersonalInformation.objects.filter(Q(gender='other') & Q(employee__center__division__d_rec_id=path[1])).count() + (total_employees-male_employees-female_employees)
            employees_on_leave= LeaveApply.objects.filter(Q(from_date__lte=date.today()) & Q(to_date__gte=date.today()) &Q(status='Approved') & Q(employee__center__division__d_rec_id=path[1])).count()
            res.append({
                'total_positions': total_positions,
                'total_employees': total_employees,
                'vacant_positions': vacant_positions,
                'occupied': occupied,
                'male_employees': male_employees,
                'female_employees': female_employees,
                'other_gender_employees':other_gender_employees,
                'employees_on_leave': employees_on_leave,
                'absent_employees': random.randint(1, 19)
 
            })
        elif 'district' in path:
            total_positions= Position.objects.filter(Q(location__district__district_rec_id=path[1])).count()
            vacant_positions= Position.objects.filter(Q(open_position=True) & Q(location__district__district_rec_id=path[1])).count()
            occupied= Position.objects.filter(Q(open_position=False) & Q(location__district__district_rec_id=path[1])).count()
            total_employees= Employee.objects.filter(Q(center__district__district_rec_id=path[1])).count()
            male_employees= PersonalInformation.objects.filter(Q(gender='male') & Q(employee__center__district__district_rec_id=path[1])).count()
            female_employees= PersonalInformation.objects.filter(Q(gender='female') & Q(employee__center__district__district_rec_id=path[1])).count()
            other_gender_employees= PersonalInformation.objects.filter(Q(gender='other') & Q(employee__center__district__district_rec_id=path[1])).count() + (total_employees-male_employees-female_employees)
            employees_on_leave= LeaveApply.objects.filter(Q(from_date__lte=date.today()) & Q(to_date__gte=date.today()) &Q(status='Approved') & Q(employee__center__district__district_rec_id=path[1])).count()
            res.append({
                'total_positions': total_positions,
                'total_employees': total_employees,
                'vacant_positions': vacant_positions,
                'occupied': occupied,
                'male_employees': male_employees,
                'female_employees': female_employees,
                'other_gender_employees':other_gender_employees,
                'employees_on_leave': employees_on_leave,
                'absent_employees': random.randint(1, 19)
 
            })
        elif 'tehsil' in path:
            total_positions= Position.objects.filter(Q(location__tehsil__t_rec_id=path[1])).count()
            vacant_positions= Position.objects.filter(Q(open_position=True) & Q(location__tehsil__t_rec_id=path[1])).count()
            occupied= Position.objects.filter(Q(open_position=False) & Q(location__tehsil__t_rec_id=path[1])).count()
            total_employees= Employee.objects.filter(Q(center__tehsil__t_rec_id=path[1])).count()
            male_employees= PersonalInformation.objects.filter(Q(gender='male') & Q(employee__center__tehsil__t_rec_id=path[1])).count()
            female_employees= PersonalInformation.objects.filter(Q(gender='female') & Q(employee__center__tehsil__t_rec_id=path[1])).count()
            other_gender_employees= PersonalInformation.objects.filter(Q(gender='other') & Q(employee__center__tehsil__t_rec_id=path[1])).count() + (total_employees-male_employees-female_employees)
            employees_on_leave= LeaveApply.objects.filter(Q(from_date__lte=date.today()) & Q(to_date__gte=date.today()) &Q(status='Approved') & Q(employee__center__tehsil__t_rec_id=path[1])).count()
            res.append({
                'total_positions': total_positions,
                'total_employees': total_employees,
                'vacant_positions': vacant_positions,
                'occupied': occupied,
                'male_employees': male_employees,
                'female_employees': female_employees,
                'other_gender_employees':other_gender_employees,
                'employees_on_leave': employees_on_leave,
                'absent_employees': random.randint(1, 19)
 
            })
        elif 'center' in path:
            total_positions= Position.objects.filter(Q(location__c_rec_id=path[1])).count()
            vacant_positions= Position.objects.filter(Q(open_position=True) & Q(location__c_rec_id=path[1])).count()
            occupied= Position.objects.filter(Q(open_position=False) & Q(location__c_rec_id=path[1])).count()
            total_employees= Employee.objects.filter(Q(center__tehsil__t_rec_id=path[1])).count()
            male_employees= PersonalInformation.objects.filter(Q(gender='male') & Q(employee__center__c_rec_id=path[1])).count()
            female_employees= PersonalInformation.objects.filter(Q(gender='female') & Q(employee__center__c_rec_id=path[1])).count()
            other_gender_employees= PersonalInformation.objects.filter(Q(gender='other') & Q(employee__center__c_rec_id=path[1])).count() + (total_employees-male_employees-female_employees)
            employees_on_leave= LeaveApply.objects.filter(Q(from_date__lte=date.today()) & Q(to_date__gte=date.today()) &Q(status='Approved') & Q(employee__center__c_rec_id=path[1])).count()
            res.append({
                'total_positions': total_positions,
                'total_employees': total_employees,
                'vacant_positions': vacant_positions,
                'occupied': occupied,
                'male_employees': male_employees,
                'female_employees': female_employees,
                'other_gender_employees':other_gender_employees,
                'employees_on_leave': employees_on_leave,
                'absent_employees': random.randint(1, 19)
 
            })
        elif 'wing' in path:
            total_positions= Position.objects.filter(Q(wing__w_rec_id=path[1])).count()
            vacant_positions= Position.objects.filter(Q(open_position=True) & Q(wing__w_rec_id=path[1])).count()
            occupied= Position.objects.filter(Q(open_position=False) & Q(wing__w_rec_id=path[1])).count()
            total_employees= Employee.objects.filter(Q(position__wing__w_rec_id=path[1])).count()
            male_employees= PersonalInformation.objects.filter(Q(gender='male') & Q(employee__position__wing__w_rec_id=path[1])).count()
            female_employees= PersonalInformation.objects.filter(Q(gender='female') & Q(employee__position__wing__w_rec_id=path[1])).count()
            other_gender_employees= PersonalInformation.objects.filter(Q(gender='other') & Q(employee__position__wing__w_rec_id=path[1])).count() + (total_employees-male_employees-female_employees)
            employees_on_leave= LeaveApply.objects.filter(Q(from_date__lte=date.today()) & Q(to_date__gte=date.today()) &Q(status='Approved') & Q(employee__position__wing__w_rec_id=path[1])).count()
            res.append({
                'total_positions': total_positions,
                'total_employees': total_employees,
                'vacant_positions': vacant_positions,
                'occupied': occupied,
                'male_employees': male_employees,
                'female_employees': female_employees,
                'other_gender_employees':other_gender_employees,
                'employees_on_leave': employees_on_leave,
                'absent_employees': random.randint(1, 19)
 
            })
        elif 'subwing' in path:
            total_positions= Position.objects.filter(Q(sub_wing__sw_rec_id=path[1])).count()
            vacant_positions= Position.objects.filter(Q(open_position=True) & Q(sub_wing__sw_rec_id=path[1])).count()
            occupied= Position.objects.filter(Q(open_position=False) & Q(sub_wing__sw_rec_id=path[1])).count()
            total_employees= Employee.objects.filter(Q(position__sub_wing__sw_rec_id=path[1])).count()
            male_employees= PersonalInformation.objects.filter(Q(gender='male') & Q(employee__position__sub_wing__sw_rec_id=path[1])).count()
            female_employees= PersonalInformation.objects.filter(Q(gender='female') & Q(employee__position__sub_wing__sw_rec_id=path[1])).count()
            other_gender_employees= PersonalInformation.objects.filter(Q(gender='other') & Q(employee__position__sub_wing__sw_rec_id=path[1])).count() + (total_employees-male_employees-female_employees)
            employees_on_leave= LeaveApply.objects.filter(Q(from_date__lte=date.today()) & Q(to_date__gte=date.today()) &Q(status='Approved') & Q(employee__position__sub_wing__sw_rec_id=path[1])).count()
            res.append({
                'total_positions': total_positions,
                'total_employees': total_employees,
                'vacant_positions': vacant_positions,
                'occupied': occupied,
                'male_employees': male_employees,
                'female_employees': female_employees,
                'other_gender_employees':other_gender_employees,
                'employees_on_leave': employees_on_leave,
                'absent_employees': random.randint(1, 19)
 
            })
    return JsonResponse(data=res, safe=False)