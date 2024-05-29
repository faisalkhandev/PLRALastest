from employee_master_data.models import PersonalInformation
from leave_setup.models import *
from django.db import models


class LeaveCalculationService:
    def __init__(self, employee, year):
        self.employee = employee
        self.year = year
    def check_leave_type_accrued(self, leave_type):
        if leave_type.accrue:
            return True
        else:
            return False
    def check_leave_type_entire_service(self, leave_type):
        if leave_type.entire_service_validity:
            return True
        else:
            return False
    def get_leave_type_bucket_size(self, leave_type):
        try:
            if self.check_leave_type_accrued(leave_type):
                accrue_record = AccrueTable.objects.filter(
                    employee=self.employee,
                    leave_bucket=leave_type,
                    hr_year=self.year
                ).order_by('-month').first()
                return accrue_record.accrued_leaves if accrue_record else 0
            if self.check_leave_type_entire_service(leave_type):
                return leave_type.entire_service_limit if leave_type.entire_service_limit else 0
            else:
                leave_dependent_list=LeaveDependency.objects.filter(leave_with_adjustable=leave_type).order_by("priority")
                sum=0
                for dependent in leave_dependent_list:
                    accrue_record = AccrueTable.objects.filter(
                    employee=self.employee,
                    leave_bucket=dependent.depends_upon,
                    hr_year=self.year
                ).order_by('-month').first()
                    if accrue_record:
                        sum=sum+accrue_record.accrued_leaves
                return sum
        except AccrueTable.DoesNotExist:
            return 0

    def calculate_leave_counts(self):
        personal_information=PersonalInformation.objects.filter(employee=self.employee).first()

        leave_types_list=None
        results = []
        
        if personal_information:
            gender=personal_information.gender
            if gender=='male':
                leave_types_list = LeaveType.objects.filter(gender_eligibility__in=['All', 'Male']).exclude(leave_type="Absent")
            elif gender=='female':
                leave_types_list = LeaveType.objects.filter(gender_eligibility__in=['All', 'Female']).exclude(leave_type="Absent")
            elif gender=='other':     
                leave_types_list = LeaveType.objects.filter(visible_at_leave_apply_time=True).exclude(leave_type="Absent")
            elif gender is None:     
                leave_types_list = LeaveType.objects.filter().exclude(leave_type="Absent")
        else:
            leave_types_list = LeaveType.objects.filter().exclude(leave_type="Absent")
        if leave_types_list is not None:
            for leave_type in leave_types_list:
                bucket_size = self.get_leave_type_bucket_size(leave_type)
                approved_historical_leaves = self.get_approved_historical_leaves_availed(leave_type)
                avaliable_balance = self.get_avaliable_balance(leave_type)
                leave_balance = self.get_leave_balance(leave_type)
                approved_avaliable_leaves=self.get_approved_availed_leaves(leave_type)
               
                
                leave_balance = self.get_leave_balance(leave_type)
                results.append({
                    'leave_type': leave_type.leave_type,
                    'Size': bucket_size,
                    'Historical': approved_historical_leaves,
                    'Available': avaliable_balance,
                    'Balance': leave_balance,
                    'Approved':approved_avaliable_leaves 
                })
        return results

    def get_approved_historical_leaves_availed(self, leave_type):
        # Implementation based on your business logic
        if self.check_leave_type_accrued(leave_type):
            approved_leaves=LeaveDependableBucket.objects.filter(
                employee=self.employee,
                leave_deduction_bucket=leave_type,
                LeaveDependableDetail__hr_year_id=self.year,
               leave_date__lte=timezone.now().date()
            ).count()
            return approved_leaves
            
        if self.check_leave_type_entire_service( leave_type):
            
            approved_leaves=LeaveNonDependableDetail.objects.filter(
                employee=self.employee,
                leave_type=leave_type, 
                hr_year_id=self.year,
                leave_to_date__lte=timezone.now().date()
            ).last()
            return approved_leaves.leave_type_used if approved_leaves else 0
        
        return 0
    def get_avaliable_balance(self, leave_type):
        # Fetch the bucket size for the given leave type
        bucket_size = self.get_leave_type_bucket_size(leave_type)
        if bucket_size is None:
            bucket_size = 0  # Default to 0 if None is returned

        # Fetch the number of approved leaves availed for the given leave type
        approved_leaves = self.get_approved_historical_leaves_availed(leave_type)
        if approved_leaves is None:
            approved_leaves = 0  # Default to 0 if None is returned

        # Calculate the available balance
        available_balance = bucket_size - approved_leaves
        return available_balance

    def get_leave_balance(self, leave_type):
        leave_balance = self.get_avaliable_balance(leave_type) - self.get_approved_future_leaves_not_availed(leave_type)
        return leave_balance
    def get_approved_future_leaves_not_availed(self, leave_type):
        if self.check_leave_type_accrued(leave_type):
                current_Date=datetime.now().date()
                count=LeaveDependableDetail.objects.filter(leave_type=leave_type,leave_request__employee=self.employee,leave_date__gte=current_Date).count()
                return count
        return 0
    def get_approved_availed_leaves(self, leave_type):
        approved_availed_leaves=self.get_approved_historical_leaves_availed(leave_type)+self.get_approved_future_leaves_not_availed(leave_type)
        return approved_availed_leaves
