from django.db import models
from employee_basic_information.models import *
class PayrollPostingAccountSetup(models.Model):
    ACCOUNT_TYPE_CHOICES = (
        ('Gross Pay (DR)', 'Gross Pay (DR)'),
        ('Deduction (CR)', 'Deduction (CR)'),
        ('Benefits Expense (DR)', 'Benefits Expense (DR)'),
        ('Benefits Payable (CR)', 'Benefits Payable (CR)'),
        ('Salary Tax (CR)', 'Salary Tax (CR)'),
    )
    payroll_account_type = models.CharField(max_length=100, choices=ACCOUNT_TYPE_CHOICES)
    employee_class=models.ForeignKey(EmployeePayrollClass, related_name='PayrollPostingAccountSetup_class', on_delete=models.PROTECT)
    wing=models.ForeignKey(Wing, related_name='PayrollPostingAccountSetup_wing', on_delete=models.PROTECT)
    sub_wing=models.ForeignKey(Sub_Wing, related_name='PayrollPostingAccountSetup_sub_wing', on_delete=models.PROTECT)
    ppg_level=models.ForeignKey(Ppg_Level_Setup, related_name='PayrollPostingAccountSetup_ppg_level', on_delete=models.PROTECT)
    # pay_code=name = models.ForeignKey('TargetModel', related_name='PayrollPostingAccountSetup_pay_code', on_delete=models.PROTECT)
    # deduction_code=name = models.ForeignKey('TargetModel', related_name='PayrollPostingAccountSetup_deduction_code', on_delete=models.PROTECT)
    # benefit_code=name = models.ForeignKey('TargetModel', related_name='PayrollPostingAccountSetup_benefit_code', on_delete=models.PROTECT)
    main_account = models.CharField(max_length=100)

    def __str__(self):
        return f"Payroll Posting Account Setup: {self.payroll_account_type}"

