from django.conf import settings
from leave_setup.models import AccrueTable, LeaveType
from employee_basic_information.models import Employee,PositionAssignment
from datetime import datetime
from django.db.models import Q
from resignation.models import ResignationRequest,ResignationApprovals 
from termination.models import TerminationApprovals
from django.core.exceptions import ObjectDoesNotExist

from simple_transfer_Setup.models import *
from HR_Setups.models import HRCelanderYear
from transfer_setup.models import *
from leave_setup.models import *
import calendar
def sehedule_api():
    current_datetime = datetime.now()
    current_month = current_datetime.month
    current_year = current_datetime.year
    hryear=HRCelanderYear.objects.filter().order_by('-hr_year').first()
    for employee in Employee.objects.all():
        for leave_type in LeaveType.objects.filter(accrue=True):

            existing_record = AccrueTable.objects.filter(leave_bucket=leave_type, employee=employee, hr_year=current_year).order_by('-month').first()

            if not current_month == hryear.hr_celander_ending_date.month :
                if existing_record and existing_record.month.month!=current_month:
                    accrued_leaves = leave_type.accrue_per_month + existing_record.accrued_leaves
                    print("Within the year and existing record: Created record")
                    AccrueTable.objects.create(
                        month=current_datetime,
                        hr_year=hryear.hr_year,
                        leave_bucket=leave_type,
                        employee=employee,
                        accrued_leaves=accrued_leaves,
                    )
                else:
                    accrued_leaves=leave_type.accrue_per_month+leave_type.add_in_first_hr_month
            elif  current_month == 1 and  current_datetime.day == 1:
                accrued_leaves = leave_type.accrue_per_month+leave_type.add_in_first_hr_month
                AccrueTable.objects.create(
                        month=current_datetime,
                        hr_year=hryear.hr_year,
                        leave_bucket=leave_type,
                        employee=employee,
                        accrued_leaves=accrued_leaves,
                    )

            if current_month == 1 and current_datetime.day == 1:
                print("First month of the year: Created record")
            elif existing_record:
                print("Within the year and existing record: Created record")

print("this is my job")


def real_time():
    print("RealTimeJob")

    # print("Realtime Job")
    # leave_approvals()
    # add_accrue_record()
    # handle_resignations()
    # handle_termination()
    # auto_year_closing()
    # monthly_leave_accrual()
    AdministrativeTransferEmployee()
    # E_TransferEmployee()
    

def leave_approvals():
    print("Leave Approvals Job ")
    system_leave_approvals=Approvals.objects.filter(system_approval=True)
    for approval in system_leave_approvals:
        approving_time=calculate_approving_time(approval)
        current_date_and_time=datetime.now().replace(tzinfo=None)
        applay_date=approval.leave.apply_date.replace(tzinfo=None)
        system_approval_time = applay_date + timedelta(hours=approving_time * 24)
        if current_date_and_time >=system_approval_time:
            approval.status='Approved'
            approval.comments=f'Approved by System After{system_approval_time}'
            approval.save()
            print("System Approved Leave ")

def calculate_approving_time(approval):
    approving_time=0
    if approval.order==1:
        approving_time=approval.leave_approval.approving_time
    else:
        all_related_approvals=Approvals.objects.filter(leave=approval.leave, order__lt=approval.order).order_by('order')
        approving_time=1
        for i in all_related_approvals:
            approving_time=approving_time+i.leave_approval.approving_time
    return approving_time


def add_accrue_record():
    current_datetime = datetime.now()
    current_month = current_datetime.month
    current_year = current_datetime.year
    hryear = HRCelanderYear.objects.filter().order_by('-hr_year').first()

    # for employee in Employee.objects.all():
    #     # if employee.date_of_joining:
    #         # handle_employee_joining(employee, current_month, current_datetime, hryear)
    #     # fill_missing_accruals(employee, current_month, current_year, hryear)
    #     for leave_type in LeaveType.objects.filter(accrue=True):
    #         accrued_leaves=None
    #         if leave_type.leave_type=="Casual":
    #             accrued_leaves = 23
    #         elif leave_type.leave_type=="Earned":
    #             accrued_leaves = 44
    #         accrue_date = datetime(current_year, current_month, 1)  # Use the first day of each month
    #         AccrueTable.objects.create(
    #             month=accrue_date,
    #             hr_year=hryear.hr_year,
    #             leave_bucket=leave_type,
    #             employee=employee,
    #             accrued_leaves=accrued_leaves,
    #         )
            # print(f"Accrual record created for {employee} for month {month} of {year}.")
def handle_employee_joining(employee, current_month, current_datetime, hryear):
    for leave_type in LeaveType.objects.filter(accrue=True):
        try:
            accruetable = AccrueTable.objects.filter(employee=employee, leave_bucket=leave_type).order_by('-month').first()
        except ObjectDoesNotExist:
            accruetable = False

        if employee.date_of_joining.month == current_month and employee.date_of_joining.day <= 15 and not accruetable:
            accrued_leaves = leave_type.accrue_per_month + leave_type.add_in_first_hr_month
            AccrueTable.objects.create(
                month=current_datetime,
                hr_year=hryear.hr_year,
                leave_bucket=leave_type,
                employee=employee,
                accrued_leaves=accrued_leaves,
            )
        elif employee.date_of_joining.month == current_month and employee.date_of_joining.day > 15 and not accruetable:
            accrued_leaves = leave_type.accrue_per_month
            AccrueTable.objects.create(
                month=current_datetime,
                hr_year=hryear.hr_year,
                leave_bucket=leave_type,
                employee=employee,
                accrued_leaves=accrued_leaves,
            )

def fill_missing_accruals(employee, current_month, current_year, hryear):
    hr_start_month = hryear.hr_celander_starting_date.month
    # Adjust the year based on whether the HR start month is later in the year than the current month
    start_year = current_year if hr_start_month <= current_month else current_year - 1
    
    # Calculate how many months need accruals, and adjust for year wrap-around
    months_to_process = (current_month + 12 - hr_start_month) % 12 + 1
    for month_offset in range(months_to_process):
        month = (hr_start_month + month_offset - 1) % 12 + 1
        year = start_year if (hr_start_month + month_offset - 1) // 12 == 0 else start_year + 1
        
        for leave_type in LeaveType.objects.filter(accrue=True):
            # Check if there is already an accrue record for this month and year
            existing_record = AccrueTable.objects.filter(leave_bucket=leave_type, employee=employee, hr_year=hryear.hr_year).order_by('-month').first()
            if not AccrueTable.objects.filter(employee=employee, leave_bucket=leave_type, month__month=month, month__year=year).exists():
                if existing_record and hasattr(existing_record, 'accrued_leaves'):
                    accrued_leaves = leave_type.accrue_per_month + existing_record.accrued_leaves
                else:
                    accrued_leaves = leave_type.accrue_per_month
                accrue_date = datetime(year, month, 1)  # Use the first day of each month
                AccrueTable.objects.create(
                    month=accrue_date,
                    hr_year=hryear.hr_year,
                    leave_bucket=leave_type,
                    employee=employee,
                    accrued_leaves=accrued_leaves,
                )
                print(f"Accrual record created for {employee} for month {month} of {year}.")

def handle_resignations():
    current_datetime = datetime.now().date()
    resignations= ResignationApprovals.objects.filter(Q(resignation_request__status="Approved"),Q(resignation_effective_date=current_datetime),Q(order=2),Q(resignation_request__employee__is_active=True))
    if resignations is not None:
            for resignation in resignations: 
                resignation.resignation_request.employee.is_active=False
                print(resignation.resignation_request.employee.position.open_position)
                resignation.resignation_request.employee.save()
                employee_position=PositionAssignment.objects.filter(Q(employee=resignation.resignation_request.employee)&Q(active=True))
                for emp in employee_position:
                    emp.assignment_end=current_datetime
                    emp.active=False
                    emp.save()
                    emp.position.open_position=True
                    emp.position.save()

def handle_termination():
    current_datetime = datetime.now().date() 
    terminations= TerminationApprovals.objects.filter(Q(termination_request__status="Closed"),Q(termination_effective_date=current_datetime),Q(order=2),Q(termination_request__employee__is_active=True))
    if terminations is not None:
            for termination in terminations: 
                termination.termination_request.employee.is_active=False
                termination.termination_request.employee.save()
                employee_position=PositionAssignment.objects.filter(Q(employee=termination.termination_request.employee)&Q(active=True))
                for emp in employee_position:
                    emp.assignment_end=current_datetime
                    emp.active=False
                    emp.save()
                    emp.position.open_position=True
                    emp.position.save()

def auto_year_closing():
    current_datetime = datetime.now()
    current_month = current_datetime.month
    current_year = current_datetime.year
    hryear=HRCelanderYear.objects.filter().order_by('-hr_year').first()
    if current_year==hryear.hr_celander_ending_date.year and current_month == hryear.hr_celander_ending_date.month and current_datetime.day == hryear.hr_celander_ending_date.day and current_datetime.hour == 23 and current_datetime.minute == 59:
        print("executed")
        hryear.active=False
        hryear.save()
        new_starting_date = hryear.hr_celander_starting_date.replace(year=hryear.hr_celander_starting_date.year + 1)
        new_ending_date = hryear.hr_celander_ending_date.replace(year=hryear.hr_celander_ending_date.year + 1)
        HRCelanderYear.objects.create(hr_celander_starting_date=new_starting_date, hr_celander_ending_date=new_ending_date, hr_year=hryear.hr_year + 1, active=True).save()
        print("created")

def monthly_leave_accrual():
    current_datetime = datetime.now()
    current_month = current_datetime.month
    current_year = current_datetime.year
    hryear=HRCelanderYear.objects.filter().order_by('-hr_year').first()
    for employee in Employee.objects.all():
        for leave_type in LeaveType.objects.filter(accrue=True):
            existing_record = AccrueTable.objects.filter(leave_bucket=leave_type, employee=employee, hr_year=current_year).order_by('-month').first()
            handle_existing_record(existing_record, current_month, hryear, current_datetime, leave_type, employee)

def handle_existing_record(existing_record, current_month, hryear, current_datetime, leave_type, employee):
    if not current_month == hryear.hr_celander_starting_date.month :
        if existing_record and existing_record.month.month!=current_month:
            accrued_leaves = leave_type.accrue_per_month + existing_record.accrued_leaves
            print("Within the year and existing record: Created record")
            AccrueTable.objects.create(
                month=current_datetime,
                hr_year=hryear.hr_year,
                leave_bucket=leave_type,
                employee=employee,
                accrued_leaves=accrued_leaves,
            )
        else:
            accrued_leaves=leave_type.accrue_per_month+leave_type.add_in_first_hr_month
    elif  current_month == hryear.hr_celander_starting_date.month and  current_datetime.day == 1:
        accrued_leaves = leave_type.accrue_per_month+leave_type.add_in_first_hr_month
        AccrueTable.objects.create(
                month=current_datetime,
                hr_year=hryear.hr_year,
                leave_bucket=leave_type,
                employee=employee,
                accrued_leaves=accrued_leaves,
            )
    if current_month == 1 and current_datetime.day == 1:
        print("First month of the year: Created record")
def AdministrativeTransferEmployee():
    Transfer_Process_records=Transfer_Process.objects.filter(status='Approved',new_joining_date=datetime.now().date()) 
    if Transfer_Process_records:
        for record in Transfer_Process_records:
            if record.employee.center== record.transfer_position.location:
                    
                update_Position=PositionAssignment.objects.filter(employee=record.employee,primary_position=True,active=True).first()
                current_job_level=  JobLevelAssignment.objects.filter(job_level__job=update_Position.position.job,employee=record.employee,active=True).first()
                if not record.employee.position ==record.transfer_position:
                    update_Position.primary_position=False
                    update_Position.active=False
                    update_Position.assignment_end=datetime.now().date()
                    update_Position.save()
                    current_job_level.active=False
                    current_job_level.save()
                    PositionAssignment(employee=record.employee,assignment_start=datetime.now().date(),position=record.transfer_position,primary_position=True,active=True).save()
                    related_job_level=JobLevel.objects.filter(job=record.transfer_position.job,job_abbrivation_seniority=1).first()
                    JobLevelAssignment(job_level=related_job_level,employee=record.employee,assignment_start=datetime.now().date(),active=True).save()
                    TransferApprovals.objects.filter(transfer_process=record).update(visible=False)
                    
                    print("Executed Job to transfer Employee on AdministrativeTransferEmployee")
            else:
                record.employee.center=record.transfer_position.location
                record.employee.save()  
                update_Position=PositionAssignment.objects.filter(employee=record.employee,primary_position=True,active=True).first()
                current_job_level=  JobLevelAssignment.objects.filter(job_level__job=record.employee.position.job,employee=record.employee,active=True).first()
                if not record.employee.position ==record.transfer_position:
                    update_Position.primary_position=False
                    update_Position.active=False
                    update_Position.assignment_end=datetime.now().date()
                    update_Position.save()
                    current_job_level.active=False
                    current_job_level.save()
                    PositionAssignment(employee=record.employee,assignment_start=datetime.now().date(),position=record.transfer_position,primary_position=True,active=True).save()
                    related_job_level=JobLevel.objects.filter(job=record.transfer_position.job,job_abbrivation_seniority=1).first()
                    JobLevelAssignment(job_level=related_job_level,employee=record.employee,assignment_start=datetime.now().date(),active=True).save()
                    TransferApprovals.objects.filter(transfer_process=record).update(visible=False)
                    
                    print("Executed Job to transfer Employee on AdministrativeTransferEmployee")

def E_TransferEmployee():
    
    E_Transfer_Process_records=E_Transfer_Process.objects.filter(status='Approved',new_joining_date=datetime.now().date()) 
    for record in E_Transfer_Process_records:
        update_Position=PositionAssignment.objects.filter(employee=record.employee,primary_position=True,active=True).first()
        if not update_Position.position ==record.transfer_position.open_position and update_Position is not None:
            update_Position.primary_position=False
            update_Position.active=False
            update_Position.assignment_end=datetime.now().date()
            update_Position.save()
            
            PositionAssignment(employee=record.employee,assignment_start=datetime.now().date(),position=record.transfer_position.open_position,primary_position=True,active=True).save()
           
            ConcernOfficerApproval.objects.filter(e_transfer_process=record).update(visible=False)
            HRDirectorETransferApproval.objects.filter(e_transfer_process=record).update(visible=False)
            
            print("Executed Job to transfer Employee on E_TransferEmployee")