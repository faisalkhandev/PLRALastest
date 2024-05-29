

from django.db import IntegrityError
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import viewsets
from employee_basic_information.models import *
from django.db.models import Q
from elevation.models import *
from datetime import date
from progression.serializers import *
from rest_framework.response import Response
from disciplinary_proceedings_setup.models import *
from progression.models import *
from employee_basic_information.views import BaseAPIViewSet
from rest_framework.decorators import api_view
from rest_framework.renderers import JSONRenderer
from rest_framework import status

# Create your views here.
class GeneratePendingProgressions(BaseAPIViewSet):
    queryset = PendingProgression.objects.all()
    serializer_class = PendingProgressionSerializer
    def list(self, request):
        job_level_validity = JobLevelValidity.objects.all()
        job_completion_employees=''
        for job_level_validate in job_level_validity:
            print(job_level_validate.job_level.job_abbrivation_seniority)
            job_completion_employees = JobLevelAssignment.objects.filter(Q(active = True) & Q(months_in_position__gte = job_level_validate.validity) & Q(job_level__job_abbrivation_seniority=3))
        for i in job_completion_employees:
            # print(Job.objects.get(j_rec_id=i.employee.position.job.j_rec_id).ppg_level.ppg_level_seniority)
            crr_ppg_level = Job.objects.filter(j_rec_id=i.employee.position.job.j_rec_id).first().ppg_level.ppg_level_seniority
            nxt_ppg_lvl = Ppg_Level_Setup.objects.get(ppg_level_seniority=crr_ppg_level+1)
            nxt_job = Job.objects.filter(ppg_level__ppg_level_seniority=nxt_ppg_lvl.ppg_level_seniority).first()
            # print(f'job {Job.objects.get(ppg_level__ppg_level_seniority=nxt_ppg_lvl.ppg_level_seniority)}')
            vacant_post = Position.objects.filter(Q(job=nxt_job) & Q(open_position=True))
            nxt_job_level = JobLevel.objects.get(Q(job__j_rec_id=nxt_job.j_rec_id) & Q(job_abbrivation_seniority=1))
            # print(JobLevelAssignment.objects.get(Q(employee__id=i.employee.id) & Q(active=True)).assignment_end)
            obj, created = PendingProgression.objects.get_or_create(
                    employee=i.employee,
                    defaults={
                        'pending_inquiry': True if DisciplinaryProceedingRequest.objects.filter(Q(employee=i.employee) & Q(inquiry_status="In Process")).exists() else False,
                        'major_penalities': True if DisciplinaryProceedingRequest.objects.filter(Q(employee=i.employee) & Q(inquiry_type__inquiryoutcomes__inquiry_name="Major")).exists() else False,
                        'promote_ppg_level': nxt_ppg_lvl,
                        'promote_job': nxt_job,
                        'promote_job_level': nxt_job_level,
                        'post_vacant': True if Position.objects.filter(Q(job=nxt_job) and Q(open_position=True)).exists() else False,
                        'status': 'New'
                    }
                )
        queryset=PendingProgression.objects.filter(Q(status="New") | Q(status='Reject'))
        serilizer=PendingProgressionSerializer(queryset,many=True)
        return Response(serilizer.data, status=status.HTTP_200_OK)

def updatePosition(self, id, position):
    try:
        emp = PendingProgression.objects.get(id=id)
        emp.promoted_post= Position.objects.get(p_rec_id=position)
        emp.save()
        return HttpResponse("ok", status=201)
    except Exception as e:
        return HttpResponse(f"ERROR GETTING POSITION {e}", status=400)

def GenerateProgression(self, id, *args, **kwargs):
    job_completion_employees=""
    queryset=[]
    job_level_validity = JobLevelValidity.objects.all()
    for job_level_validate in job_level_validity:
        print(job_level_validate.job_level.job_abbrivation_seniority)
        job_completion_employees = PendingProgression.objects.filter(id=id)
        job_completion_employees.first().status="In Process"
        job_completion_employees.first().save()
    doc = ProgressionDocument.objects.create(
        progression_document_date= date.today(),
        status= 'In Process'
    )
    
    for i in job_completion_employees:
        print(Job.objects.get(j_rec_id=i.employee.position.job.j_rec_id).ppg_level.ppg_level_seniority)
        crr_ppg_level = Job.objects.filter(j_rec_id=i.employee.position.job.j_rec_id).first().ppg_level.ppg_level_seniority
        nxt_ppg_lvl = Ppg_Level_Setup.objects.get(ppg_level_seniority=crr_ppg_level+1)
        nxt_job = Job.objects.filter(j_rec_id=job_completion_employees.first().promoted_post.job.j_rec_id).first()
        print(nxt_job)
        vacant_post = Position.objects.filter(Q(job=nxt_job) & Q(open_position=True))
        nxt_job_level = JobLevel.objects.filter(Q(job__j_rec_id=nxt_job.j_rec_id) & Q(job_abbrivation_seniority=1)).first()
        ins = ProgressionEmployee.objects.create(
            document=doc,
            employee=i.employee,
            pending_inquiry=True if DisciplinaryProceedingRequest.objects.filter(Q(employee=i.employee) & Q(inquiry_status="In Process")).exists() else False,
            major_penalities=True if DisciplinaryProceedingRequest.objects.filter(Q(employee=i.employee) & Q(inquiry_type__inquiryoutcomes__inquiry_name="Major")).exists() else False,
            promote_ppg_level=nxt_ppg_lvl,
            promote_job=nxt_job,
            promote_job_level=nxt_job_level,
            promoted_post= i.promoted_post,
            post_vacant=True if Position.objects.filter(Q(job=nxt_job) and Q(open_position=True)).exists() else False,
            progression_approval_date=JobLevelAssignment.objects.filter(Q(employee__id=i.employee.id) & Q(active=True)).last().assignment_end,
            progression_effective_date=JobLevelAssignment.objects.filter(Q(employee__id=i.employee.id) & Q(active=True)).last().assignment_end,
            status='In Process'
        )
        remove_from_pending_list= PendingProgression.objects.get(employee=i.employee)
        remove_from_pending_list.status = 'In Process'
        remove_from_pending_list.save()
        queryset.append(ins)
    serilizer = ProgressionEmployeeSerializer(queryset, many=True)
    return HttpResponse(serilizer.data)

class PromoteProgression(viewsets.ViewSet):
    def create(self, request):
        serializer = PromoteToProgressionSerializer(data=request.data, context={ 'request': request })
        serializer.is_valid(raise_exception=True)
        doc_id = serializer.validated_data.get('progression_document_rec_id')
        elevation_date =serializer.validated_data.get('progression_effective_date')
        print(doc_id)
        result = ProgressionDocument.objects.get(progression_document_rec_id=doc_id)
        result.status='Close'
        result.save()
        print(ProgressionEmployee.objects.filter(document__progression_document_rec_id=doc_id))
        emp_in_doc = ProgressionEmployee.objects.filter(document__progression_document_rec_id=doc_id)
        
        for i in emp_in_doc:
            if i.status == 'Approved':
                crr_ppg_level = Job.objects.get(j_rec_id=i.employee.position.job.j_rec_id).ppg_level.ppg_level_seniority
                nxt_ppg_lvl = Ppg_Level_Setup.objects.get(ppg_level_seniority=crr_ppg_level+1)
                nxt_job = Job.objects.get(ppg_level__ppg_level_seniority=nxt_ppg_lvl.ppg_level_seniority)
                vacant_post = Position.objects.filter(Q(job=nxt_job) & Q(open_position=True))
                nxt_job_level = JobLevel.objects.get(Q(job__j_rec_id=nxt_job.j_rec_id) & Q(job_abbrivation_seniority=1))
                print(f'hi {i.employee.position.job}')
                job_to_be_inactivated = JobLevelAssignment.objects.get(Q(employee__id=i.employee.id) & Q(active=True))
                job_to_be_inactivated.active= False
                job_to_be_inactivated.save()
                position_to_be_inactivated = PositionAssignment.objects.get(Q(employee__id=i.employee.id) & Q(active=True) & Q(primary_position=True))
                position_to_be_inactivated.active= False
                position_to_be_inactivated.primary_position= False
                position_to_be_inactivated.save()
                print(nxt_job_level)
                JobLevelAssignment.objects.create(
                            job_level= nxt_job_level,
                            employee= i.employee,
                            assignment_start= i.progression_approval_date,
                            active=True
                        ).save()

                PositionAssignment.objects.create(
                    employee=i.employee,
                    position=i.promoted_post,
                    assignment_start=i.progression_approval_date,
                    primary_position=True,
                    active=True
                ).save()
                approve_from_pending_list= PendingProgression.objects.get(employee=i.employee)
                approve_from_pending_list.status = 'Approved'
                approve_from_pending_list.save()
                print('hello')
            if i.status == 'Reject':
                reject_from_pending_list= PendingProgression.objects.get(employee=i.employee)
                reject_from_pending_list.status = 'Reject'
                reject_from_pending_list.save()

        return Response(data="ok",status=201)

def UpdateProgressionForPendingEmployees(self, *args, **kwargs):
    try:
        id = kwargs.get('id')
        record_to_update = PendingProgression.objects.get(id=id)
        print(record_to_update.status)
        record_to_update.status = 'Marked'
        record_to_update.save()
        return HttpResponse("ok", status=201)
    except PendingElevation.DoesNotExist:
        print(f"PendingElevation record with ID {id} does not exist.")
    except Exception as e:
        print(f"An error occurred: {e}")

def getDocument(self, *args, **kwargs):
    progression_document_rec_id = kwargs.get('id')
    queryset = ProgressionEmployee.objects.filter(document__progression_document_rec_id=progression_document_rec_id)
    serializer = ProgressionEmployeeSerializer(queryset, many=True)
    json_data = JSONRenderer().render(serializer.data)
    
    return HttpResponse(json_data, content_type='application/json')

@api_view(['POST'])
def update_approvalDate(request):
    try:
        instance = ProgressionEmployee.objects.get(id=request.data['id'])
        instance.progression_approval_date= request.data['approval_date']
        instance.save()
        return Response(data=status.HTTP_200_OK, status=status.HTTP_200_OK)
    except instance.DoesNotExist:
        return Response(data="Progression record not found", status=404)

@api_view(['POST'])
def update_status(request):
    try:
        instance = ProgressionEmployee.objects.get(id=request.data['id'])
        if request.data['status'] == 'Approved':
            doc = ProgressionEmployee.objects.get(id=request.data['id']).document
            if CompetentAuthority.objects.get(designation='DG') and CompetentAuthority.objects.get(employee_position=request.user.position):
                doc.approved_by= "DG"
            elif CompetentAuthority.objects.get(designation='HR DIRECTOR') and CompetentAuthority.objects.get(employee_position=request.user.position):
                doc.approved_by= "Hr Director"
            else:
                raise ValidationError("Add Competent Authorities!")
            crr_ppg_level = Job.objects.get(j_rec_id=instance.employee.position.job.j_rec_id).ppg_level.ppg_level_seniority
            nxt_ppg_lvl = Ppg_Level_Setup.objects.get(ppg_level_seniority=crr_ppg_level+1)
            nxt_job = instance.promote_job
            nxt_job_level = JobLevel.objects.get(Q(job__j_rec_id=nxt_job.j_rec_id) & Q(job_abbrivation_seniority=1))
            position_to_be_inactivated = PositionAssignment.objects.get(Q(employee__id=instance.employee.id) & Q(active=True) & Q(primary_position=True))
            position_to_be_inactivated.active= False
            position_to_be_inactivated.primary_position= False
            position_to_be_inactivated.save()
            job_to_be_inactivated = JobLevelAssignment.objects.get(Q(employee__id=instance.employee.id) & Q(active=True) & Q(job_level__job=position_to_be_inactivated.position.job))
            job_to_be_inactivated.active= False
            job_to_be_inactivated.save()
            print(instance.promoted_post)
            JobLevelAssignment.objects.create(
                            job_level= nxt_job_level,
                            employee= instance.employee,
                            assignment_start= instance.progression_approval_date,
                            active=True
                        ).save()

            PositionAssignment.objects.create(
                employee=instance.employee,
                position=instance.promoted_post,
                assignment_start=instance.progression_approval_date,
                primary_position=True,
                active=True
            ).save()
            approve_from_pending_list= PendingProgression.objects.get(employee=instance.employee)
            approve_from_pending_list.status = 'Approved'
            approve_from_pending_list.save()
            doc.status = 'Close'
            doc.save()
            instance.status= request.data['status']
            instance.save()
        elif request.data['status'] == 'Reject':
            doc = ProgressionEmployee.objects.get(id=request.data['id']).document
            if CompetentAuthority.objects.get(designation='DG') and CompetentAuthority.objects.get(employee_position=request.user.position):
                doc.approved_by= "DG"
            elif CompetentAuthority.objects.get(designation='HR DIRECTOR') and CompetentAuthority.objects.get(employee_position=request.user.position):
                doc.approved_by= "Hr Director"
            else:
                raise ValidationError("Add Competent Authorities!")
            approve_from_pending_list= PendingProgression.objects.get(employee=instance.employee)
            approve_from_pending_list.status = 'Reject'
            approve_from_pending_list.save()
            doc.status = 'Close'
            doc.save()
            instance.status= request.data['status']
            instance.save()
            
        return Response(data=status.HTTP_200_OK, status=status.HTTP_200_OK)
    except ElevtionToEmployee.DoesNotExist:
        return Response(data="Progression record not found", status=404)

class Approvals(BaseAPIViewSet):
    queryset = ProgressionEmployee.objects.all()
    serializer_class = ProgressionEmployeeSerializer

class ApprovalsHistory(BaseAPIViewSet):
    queryset = ProgressionEmployee.objects.filter(Q(status="Approved") | Q(status="Reject"))
    serializer_class = ProgressionEmployeeSerializer
    
def get_positions(self, id):
    promoted_positions = Position.objects.filter(Q(position_active=True) and Q(open_position=True) and Q(job__ppg_level__ppg_rec_id=id))
    print(promoted_positions)
    
class get_positions(BaseAPIViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return Position_list_Serializer  
        return super().get_serializer_class()
    def get_queryset(self):
        id = self.kwargs.get('id')  # assuming 'id' is a parameter in your URL conf
        queryset = Position.objects.filter(
            Q(position_active=True) & Q(open_position=True) & Q(job__ppg_level__ppg_rec_id=id)
        )
        return queryset
    