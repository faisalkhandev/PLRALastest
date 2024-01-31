from django.shortcuts import render
from rest_framework import viewsets
from employee_basic_information.models import *
from django.db.models import Q
from elevation.models import *
from datetime import date
from elevation.serializers import *
from rest_framework.response import Response

# Create your views here.
class GenerateElevationL2(viewsets.ViewSet):
    def list(self, request):
        job_level_validity = JobLevelValidity.objects.all()
        for job_level_validate in job_level_validity:
            job_completion = JobLevelAssignment.objects.filter(Q(active = True) & Q(months_in_position__gte = job_level_validate.validity) & Q(job_level__job_abbrivation_seniority=1))
        doc = ElevtionToL2.objects.create(
            document_date= date.today(),
            status= 'In Process'
        )
        for i in job_completion:
            ElevtionToL2Employee.objects.create(
                document= doc,
                employee= i.employee,
                elevation_approval_date=date.today(),
                elevation_effective_date= i.assignment_end,
                status= 'In Process'
            )
        queryset=ElevtionToL2.objects.all()
        serilizer=DocumentSerializer(queryset,many=True)
        return Response(serilizer.data)

class PromoteToL2(viewsets.ViewSet):
    def create(self, request):
        serializer = PromoteToL2Serializer(data=request.data, context={ 'request': request })
        serializer.is_valid(raise_exception=True)
        doc_id = serializer.validated_data.get('elevtion_to_l2_doc_rec_id')
        elevation_date =serializer.validated_data.get('elevation_effective_date')
        print(doc_id)
        result = ElevtionToL2.objects.get(elevtion_to_l2_doc_rec_id=doc_id)
        result.status='Close'
        result.save()
        emp_in_doc = ElevtionToL2Employee.objects.filter(document__elevtion_to_l2_doc_rec_id=doc_id)
        for i in emp_in_doc:
            if i.status == 'Approved':
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
                print(f'hello {job_to_be_inactivated}')

        return Response(data="ok",status=201)




class GenerateElevationL3(viewsets.ViewSet):
    def list(self, request):
        job_level_validity = JobLevelValidity.objects.all()
        for job_level_validate in job_level_validity:
            print(job_level_validate.job_level.job_abbrivation_seniority)
            job_completion = JobLevelAssignment.objects.filter(Q(active = True) & Q(months_in_position__gte = job_level_validate.validity) & Q(job_level__job_abbrivation_seniority=2))
        doc = ElevtionToL3.objects.create(
            document_date= date.today(),
            status= 'In Process'
        )
        print(doc)
        for i in job_completion:
            ElevtionToL3Employee.objects.create(
                document= doc,
                employee= i.employee,
                elevation_approval_date=date.today(),
                elevation_effective_date= i.assignment_end,
                status= 'In Process'
            )
        print(job_completion)
        queryset=ElevtionToL3.objects.all()
        serilizer=DocumentSerializerL3(queryset,many=True)
        return Response(serilizer.data)

class PromoteToL3(viewsets.ViewSet):
    def create(self, request):
        serializer = PromoteToL3Serializer(data=request.data, context={ 'request': request })
        serializer.is_valid(raise_exception=True)
        doc_id = serializer.validated_data.get('elevtion_to_l3_doc_rec_id')
        elevation_date =serializer.validated_data.get('elevation_effective_date')
        print(doc_id)
        result = ElevtionToL3.objects.get(elevtion_to_l3_doc_rec_id=doc_id)
        result.status='Close'
        result.save()
        emp_in_doc = ElevtionToL3Employee.objects.filter(document__elevtion_to_l3_doc_rec_id=doc_id)
        for i in emp_in_doc:
            if i.status == 'Approved':
                print(f'hi {i.employee.position.job}')
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
                print(f'hello {job_to_be_inactivated}')

        return Response(data="ok",status=201)