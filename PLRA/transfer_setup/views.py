# views.py
from django.http import HttpResponse, JsonResponse
from employee_basic_information.views import BaseAPIViewSet
from .models import *
from employee_basic_information.models import*
from employee_basic_information.serializers import*
from .serializers import *
from rest_framework.response import Response
from django.db.models import F
from rest_framework import status

class TransferRatingTypeViewSet(BaseAPIViewSet):
    queryset = TransferRatingType.objects.all()
    serializer_class = TransferRatingTypeSerializer

class DistanceRatingFormulaViewSet(BaseAPIViewSet):
    queryset = DistanceRatingFarmula.objects.all()
    serializer_class = DistanceRatingFormulaSerializer
    # def get_serializer_class(self):
    #     if self.action == 'list':
    #             return DistanceRatingFormulalistSerializer
    #     return super().get_serializer_class()

class WedlockRatingFormulaViewSet(BaseAPIViewSet):
    queryset = WedlockRatingFarmula.objects.all()
    serializer_class = WedlockRatingFormulaSerializer

    
class SameDistrictRestrictionRuleViewSet(BaseAPIViewSet):
    queryset = SameDistrictRestrictionRule.objects.all()
    serializer_class = SameDistrictRestrictionRuleSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return SameDistrictRestrictionRuleListSerializer
        return super().get_serializer_class()
class TenureRatingFormulaViewSet(BaseAPIViewSet):
    queryset = TenureRatingFarmula.objects.all()
    serializer_class = TenureRatingFormulaSerializer

class DisabilityRatingFormulaViewSet(BaseAPIViewSet):
    queryset = DisabilityRatingFarmula.objects.all()
    serializer_class = DisabilityRatingFormulaSerializer
class E_Transfer_Rating_MatrixViewSet(BaseAPIViewSet):
    queryset = E_Transfer_Rating_Matrix.objects.all()
    serializer_class = E_Transfer_Rating_MatrixSerializer
class TransferRatingModelView(BaseAPIViewSet):
    queryset = TransferRatingModel.objects.all()
    serializer_class = TransferRatingModelSerializer
class TransferRatingModelTypeView(BaseAPIViewSet):
    queryset = TransferRatingModelType.objects.all()
    serializer_class = TransferRatingModelTypeSerializer
    
from rest_framework import generics,viewsets
class ConcernOfficerApprovalViewSet(viewsets.ModelViewSet):
    queryset = ConcernOfficerApproval.objects.all()
    serializer_class = ConcernOfficerListApprovalSerializer
    def get_queryset(self):
        res=[]
        applied_positions = E_Transfer_Process.objects.distinct().values_list('transfer_position', flat=True)
        for pos in applied_positions:
            no_of_applicants = E_Transfer_Process.objects.filter(transfer_position__p_rec_id=pos).count()
            marked_employees = E_Transfer_Process.objects.filter(Q(status='Marked') & Q(transfer_position__p_rec_id=pos)).count()
            unmarked_employees = E_Transfer_Process.objects.filter(Q(status='In Process') & Q(transfer_position__p_rec_id=pos)).count()
            approval = ConcernOfficerApproval.objects.filter(Q(visible=True) & Q(e_transfer_process__transfer_position__p_rec_id=pos))
            res.append({
                "position":Position.objects.get(p_rec_id=pos), 
                "approval": approval, 
                "no_of_applicants":no_of_applicants, 
                "marked_employees":marked_employees,
                "unmarked_employees":unmarked_employees,
                "window": E_Transfer_Window_Period.objects.filter(Q(status = True) & Q(open_position__p_rec_id=pos)).distinct().first()
                })
        return res
def ConcernOfficerApprovalViewSetByPositionId(self, pos):
    res=[]
    no_of_applicants = E_Transfer_Process.objects.filter(transfer_position__p_rec_id=pos).count()
    marked_employees = E_Transfer_Process.objects.filter(Q(status='Marked') & Q(transfer_position__p_rec_id=pos)).count()
    unmarked_employees = E_Transfer_Process.objects.filter(Q(status='In Process') & Q(transfer_position__p_rec_id=pos)).count()
    approval = ConcernOfficerApproval.objects.filter(Q(visible=True) & Q(e_transfer_process__transfer_position__p_rec_id=pos))
    res.append({
        "position":Position.objects.get(p_rec_id=pos), 
        "approval": approval, 
        "no_of_applicants":no_of_applicants, 
        "marked_employees":marked_employees,
        "unmarked_employees":unmarked_employees,
        "window": E_Transfer_Window_Period.objects.filter(Q(status = True) & Q(open_position__p_rec_id=pos)).distinct().first()
        })
    serializer = ConcernOfficerListApprovalSerializer(res, many=True) 
    return JsonResponse(serializer.data, safe=False) 
    
class HRDirectorETransferApprovalViewSet(BaseAPIViewSet):
    queryset = HRDirectorETransferApproval.objects.all()
    serializer_class = HRDirectorETransferApprovalListSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return HRDirectorETransferApprovalListSerializer
        return super().get_serializer_class()

class PositionsAvailableForWindow(BaseAPIViewSet):
    queryset = Position.objects.all()
    serializer_class = Position_list_Serializer

    def get_queryset(self):
        if self.action == 'list':
            current_date = datetime.now()
            matching_windows = E_Transfer_Window_Period.objects.filter(Q(from_date__lte=date.today()) and
                Q(to_date__gte=date.today()) and Q(status=True)).distinct()
            positions=Position.objects.filter(Q(position_active=True) and Q(open_position=True))
            # Exclude positions that are part of any matching window
            for window in matching_windows:
                positions = positions.exclude(
                    p_rec_id__in=window.open_position.all().values_list('p_rec_id', flat=True)
                )
            return positions
        return Position.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return Position_list_Serializer
        return super().get_serializer_class()

class E_Transfer_ProcessViewSet(BaseAPIViewSet):
    queryset = E_Transfer_Process.objects.all()
    serializer_class = E_Transfer_ProcessSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return E_Transfer_ProcessListSerializer
        return super().get_serializer_class()
class E_Transfer_Window_PeriodViewSet(BaseAPIViewSet):
    queryset = E_Transfer_Window_Period.objects.all()
    serializer_class = E_Transfer_Window_PeriodSerializer
    def get_serializer_class(self):
        if self.action == 'list':
                return E_Transfer_Window_PeriodListSerializer
        return super().get_serializer_class()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
 
    def perform_update(self, serializer):
        if serializer.validated_data.get('status') is True and E_Transfer_Window_Period.objects.filter(status=True).exclude(pk=serializer.instance.pk).exists():
            raise serializers.ValidationError("Only one record can have status=True")
        serializer.save()
        
class ApplyPositionsViewSet(BaseAPIViewSet):
    queryset = Position.objects.all()
    serializer_class = TransferWindowPositionSerializer
 
 
    def list(self, request, *args, **kwargs):
        if self.action == 'list':
            user = self.request.user
            emp_processes= E_Transfer_Process.objects.filter(employee=user)
            try:
                user_job = user.position.job
            except Exception as e:
                raise ValidationError("No Position Open For Transfer Right Now!")
            current_date = datetime.now()
            matching_windows = E_Transfer_Window_Period.objects.filter(
                Q(from_date__lte=date.today()) and
                Q(to_date__gte=date.today()) and
                Q(open_position__job=user_job) and
                Q(status=True)
            ).distinct()
            positions=[]
            for window in matching_windows:
                for position in window.open_position.all():
                    transfer_positions = E_Transfer_Process.objects.filter(
                        employee=user,
                        transfer_position=position  # Assuming transfer_position is a foreign key to Position in E_Transfer_Process
                    )
                    if transfer_positions.exists():
                        print(position)
                    elif position.job == user_job:
                        positions.append({"position": position,"start_date": window.from_date, "end_date":window.to_date,"window_id":window.id})
            serializer = self.get_serializer(positions, many=True)
            return Response(serializer.data)
 
        return super().list(request, *args, **kwargs)


def update_Status(request, id, status):
    # Convert status to boolean
    if status.lower() in ['true', '1', 't']:
        status_bool = True
    elif status.lower() in ['false', '0', 'f']:
        status_bool = False
    else:
        return HttpResponse('Invalid status value', status=400)

    # Assuming you have a model named 'MyModel' that you're updating
    instance = E_Transfer_Window_Period.objects.get(pk=id)
    instance.status = status_bool
    instance.save()
    
    return HttpResponse('Status updated successfully', status=200)

def mark_employee(self, id):
    try:
        process_to_be_marked = E_Transfer_Process.objects.get(e_transfer_rec_id=id)
        process_to_be_marked.status='Marked'
        process_to_be_marked.save()
        return JsonResponse(data=f"Employee Marked!", status=status.HTTP_200_OK, safe=False)
    except Exception as e:
        return JsonResponse(data=f"Employee Does not exsists! {e}", status=status.HTTP_404_NOT_FOUND, safe=False)

def proceed(self, positionid):
    # Filter the queryset for the given position ID
    process_under_position = E_Transfer_Process.objects.filter(transfer_position__p_rec_id=positionid)
    
    # Check if any instance has status = 'marked' and print unmarked instances
    marked_exists = False
    for process in process_under_position:
        if process.status == 'Marked':
            marked_exists = True
        else:
            return JsonResponse(data=f"All Employees Should Marked Before Processing! {process.employee.first_name} {process.employee.last_name} is still not Marked!", status=status.HTTP_404_NOT_FOUND, safe=False)

    if marked_exists:
        try:
            approving_authority_position = CompetentAuthority.objects.get(designation='HR DIRECTOR')
            
        except ObjectDoesNotExist:
            raise ValueError("Concern Officer authority not found.")
        try:
            approving_authority=Employee.objects.filter(position=approving_authority_position.employee_position).first()
        except ObjectDoesNotExist:
            raise ValueError("There is no employee on HR Director position.") 
        existing_record=HRDirectorETransferApproval.objects.filter( position=Position.objects.get(p_rec_id=positionid),
            concern_officer_authority=approving_authority,e_transfer_process__in=process_under_position)
        if not existing_record:
            hr_director_approval = HRDirectorETransferApproval.objects.create(
                position=Position.objects.get(p_rec_id=positionid),
                concern_officer_authority=approving_authority
            )
            hr_director_approval.e_transfer_process.set(process_under_position)
            hr_director_approval.save()
        for pro in process_under_position:
            approval = ConcernOfficerApproval.objects.filter(e_transfer_process__e_transfer_rec_id=pro.e_transfer_rec_id).distinct().first()
            approval.visible=False
            approval.save()
            return JsonResponse(data=f"Successfully Marked!", status=status.HTTP_200_OK, safe=False)

    return JsonResponse(data=f"All Employees Should Marked Before Processing!", status=status.HTTP_404_NOT_FOUND, safe=False)

def processFinalApproval(self, approval_id, dat, approved_process):
    try:
        get_approval = HRDirectorETransferApproval.objects.get(id=approval_id)
        transfer_position = Position.objects.get(p_rec_id=get_approval.position.p_rec_id)
        process_in_approval = get_approval.e_transfer_process.all()
        if process_in_approval.__len__() != 0:
            for process in process_in_approval:
                if process.e_transfer_rec_id == approved_process:
                    process.status = 'Approved'
                    process.new_joining_date = dat
                    process.e_transfer_approval_date= date.today()
                    process.save()
                else:
                    process.status = 'Reject'
                    process.save()
        get_approval.visible= False
        get_approval.save()
        return JsonResponse(data=f"Successfully Approved!", status=status.HTTP_200_OK, safe=False)
    except Exception as e:
        return JsonResponse(data=f"{e}", status=status.HTTP_404_NOT_FOUND, safe=False)