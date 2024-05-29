
from django.shortcuts import render
from rest_framework import viewsets
from employee_basic_information.models import *
from rest_framework.decorators import api_view
from django.db.models import Q
from elevation.models import *
from datetime import date
from elevation.serializers import *
from rest_framework.response import Response
from django.http import HttpResponse
from employee_basic_information.views import BaseAPIViewSet
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from competent_authority.models import *
from rest_framework import status
# Create your views here.
class GenerateElevationL2(viewsets.ViewSet):
    def list(self, request):
        employees_l1 = PendingElevation.objects.filter(status='Marked')
        if len(employees_l1) != 0:
            doc = ElevtionDocument.objects.create(
            document_date= date.today(),
            status= 'In Process'
            )
            queryset = []
            for i in employees_l1:
                ass_end = JobLevelAssignment.objects.filter(Q(active=True) & Q(employee=i.employee))[0].assignment_end
                instance = ElevtionToEmployee.objects.create(
                    document= doc,
                    employee= i.employee,
                    promote_to_level= i.current_level+1,
                    elevation_approval_date=date.today(),
                    elevation_effective_date= ass_end,
                    status= 'Marked'
                )
                i.status= 'In Process'
                i.save()
                queryset.append(instance)
            serilizer=DocumentSerializer(queryset,many=True)
            return Response(data = serilizer.data, status=status.HTTP_200_OK)
        else:
            return Response("No Employee Marked!")

class GenerateElevationForPendingEmployees(viewsets.ViewSet):
    def list(self, request):
        job_level_validity = JobLevelValidity.objects.all()
        elevation_completed = ''
        for job_level_validate in job_level_validity:
            elevation_completed = JobLevelAssignment.objects.filter(Q(active = True) & Q(months_in_position__gte = job_level_validate.validity) & Q(job_level__job_abbrivation_seniority__lt = 3))
        for emp in elevation_completed:
            obj, created = PendingElevation.objects.get_or_create(
                employee=emp.employee,
                defaults={
                    'current_level': emp.job_level.job_abbrivation_seniority,
                    'status': 'New',
                    'months_in_current_level': emp.months_in_position,
                    'current_level_start_date': emp.assignment_start
                }
            )
        queryset=PendingElevation.objects.filter(Q(status='New') | Q(status='Reject'))
        serilizer=PendingEmployeeSerializer(queryset,many=True)
        return Response(data = serilizer.data)

class PromoteToL2(viewsets.ViewSet):
    def create(self, request):
        serializer = PromoteToL2Serializer(data=request.data, context={ 'request': request })
        serializer.is_valid(raise_exception=True)
        doc_id = serializer.validated_data.get('elevtion_to_l2_doc_rec_id')
        elevation_date =serializer.validated_data.get('elevation_effective_date')
        result = ElevtionDocument.objects.get(elevtion_to_l2_doc_rec_id=doc_id)
        result.save()
        emp_in_doc = ElevtionToEmployee.objects.filter(document__elevtion_to_l2_doc_rec_id=doc_id)
        for i in emp_in_doc:
            if i.status == 'Reject':
                rejected = PendingElevation.objects.filter(employee=i.employee)[0]
                rejected.status="Reject"
                rejected.save()
            elif i.status == 'Approved' and i.promote_to_level == 2:
                print(f'hi {i.employee.position.job}')
                job_to_be_inactivated = JobLevelAssignment.objects.get(Q(employee__id=i.employee.id) & Q(active=True))
                job_to_be_inactivated.active= False
                job_to_be_inactivated.save()
                a = JobLevel.objects.filter(job=i.employee.position.job)
                for j in a:
                    if j.job_abbrivation_seniority==2:
                        # assign the job level in below 
                        JobLevelAssignment.objects.create(
                            job_level= j,
                            employee= i.employee,
                            assignment_start= elevation_date,
                            active=True
                        ).save()
                deleted = PendingElevation.objects.filter(employee=i.employee)[0]
                deleted.delete()
            elif i.status == 'Approved' and i.promote_to_level == 3:
                job_to_be_inactivated = JobLevelAssignment.objects.get(Q(employee__id=i.employee.id) & Q(active=True))
                job_to_be_inactivated.active= False
                job_to_be_inactivated.save()
                a = JobLevel.objects.filter(job=i.employee.position.job)
                for j in a:
                    if j.job_abbrivation_seniority==3:
                        # assign the job level in below 
                        JobLevelAssignment.objects.create(
                            job_level= j,
                            employee= i.employee,
                            assignment_start= elevation_date,
                            active=True
                        ).save()
                deleted = PendingElevation.objects.filter(employee=i.employee)[0]
                deleted.delete()
        result.status='Close'

        return Response(data="ok",status=201)

def UpdateElevationForPendingEmployees(self, *args, **kwargs):
    try:
        id = kwargs.get('id')
        record_to_update = PendingElevation.objects.get(id=id)
        print(record_to_update.status)
        record_to_update.status = 'Marked'
        record_to_update.save()
        return HttpResponse("ok", status=201)
    except PendingElevation.DoesNotExist:
        print(f"PendingElevation record with ID {id} does not exist.")
    except Exception as e:
        print(f"An error occurred: {e}")


def getDocument(self, *args, **kwargs):
    document_id = kwargs.get('id')
    queryset = ElevtionToEmployee.objects.filter(document_id=document_id)
    serializer = DocumentSerializer(queryset, many=True)
    json_data = JSONRenderer().render(serializer.data)
    
    return HttpResponse(json_data, content_type='application/json')

@api_view(['POST'])
def update_approvalDate(request):
    try:
        instance = ElevtionToEmployee.objects.get(id=request.data['id'])
        instance.elevation_approval_date= request.data['approval_date']
        instance.save()
        return Response(data="Elevation approval date updated successfully", status=201)
    except instance.DoesNotExist:
        return Response(data="Elevation record not found", status=404)

@api_view(['POST'])
def update_status(request):
    try:
        instance = ElevtionToEmployee.objects.get(id=request.data['id'])
        instance.status= request.data['status']
        instance.save()
        if CompetentAuthority.objects.get(designation='DG').exists() and CompetentAuthority.objects.get(employee_position=request.user.position):
            instance.approved_by= "DG"
        elif CompetentAuthority.objects.get(designation='HR DIRECTOR').exists() and CompetentAuthority.objects.get(employee_position=request.user.position):
            instance.approved_by= "Hr Director"
        else:
            raise ValidationError("Add Competent Authorities!")
        return Response(data="Elevation status updated successfully", status=201)
    except ElevtionToEmployee.DoesNotExist:
        return Response(data="Elevation record not found", status=404)

class GetHistory(BaseAPIViewSet):
    queryset = ElevtionToEmployee.objects.all()
    serializer_class = ElevtionToEmployeeSerializer
    
class GetDocHistory(BaseAPIViewSet):
    queryset = ElevtionDocument.objects.all()
    serializer_class = DocumentHistorySerializer
