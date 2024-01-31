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

# Create your views here.
class GenerateProgression(viewsets.ViewSet):
    def list(self, request):
        job_level_validity = JobLevelValidity.objects.all()
        for job_level_validate in job_level_validity:
            print(job_level_validate.job_level.job_abbrivation_seniority)
            job_completion_employees = JobLevelAssignment.objects.filter(Q(active = True) & Q(months_in_position__gte = job_level_validate.validity) & Q(job_level__job_abbrivation_seniority=3))
        doc = ProgressionDocument.objects.create(
            progression_document_date= date.today(),
            status= 'In Process'
        ).save()
        queryset=ProgressionDocument.objects.all()
        serilizer=ProgressionDocumentSerializer(queryset,many=True)
        return Response(serilizer.data)
        
        for i in job_completion_employees:
            print(Job.objects.get(j_rec_id=i.employee.position.job.j_rec_id).ppg_level.ppg_level_seniority)
            crr_ppg_level = Job.objects.get(j_rec_id=i.employee.position.job.j_rec_id).ppg_level.ppg_level_seniority
            nxt_ppg_lvl = Ppg_Level_Setup.objects.get(ppg_level_seniority=crr_ppg_level+1)
            nxt_job = Job.objects.get(ppg_level__ppg_level_seniority=nxt_ppg_lvl.ppg_level_seniority)
            print(f'job {Job.objects.get(ppg_level__ppg_level_seniority=nxt_ppg_lvl.ppg_level_seniority)}')
            vacant_post = Position.objects.filter(Q(job=nxt_job) & Q(open_position=True))
            nxt_job_level = JobLevel.objects.get(Q(job__j_rec_id=nxt_job.j_rec_id) & Q(job_abbrivation_seniority=1))
            print(JobLevelAssignment.objects.get(Q(employee__id=i.employee.id) & Q(active=True)).assignment_end)
            ProgressionEmployee.objects.create(
                document= doc,
                employee= i.employee,
                pending_inquiry= True if DisciplinaryProceedingInquiry.objects.filter(Q(employee=i.employee) & Q(inquiry_status="In Process")).exists() else False,
                major_penalities= True if DisciplinaryProceedingInquiry.objects.filter(Q(employee=i.employee) & Q(inquiry_outcome__inquiry_type="Major")).exists() else False,
                promote_ppg_level= nxt_ppg_lvl,
                promote_job= nxt_job,
                promote_job_level= nxt_job_level,
                post_vacant= True if Position.objects.filter(Q(job=nxt_job) and Q(open_position=True)).exists() else False,
                progression_approval_date= i.assignment_end,
                progression_effective_date= JobLevelAssignment.objects.get(Q(employee__id=i.employee.id) & Q(active=True)).assignment_end,
                status= 'In Process'
            )

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
                print('hello')

        return Response(data="ok",status=201)
