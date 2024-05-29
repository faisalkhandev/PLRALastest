from django.db import models
from django.forms import ValidationError
class PayrollSetup(models.Model):
    create_journal_entry_per = models.CharField(max_length=100, choices=[('Employee', 'Employee'), ('Main Account', 'Main Account')], unique=True)
    per_day_salary_factor = models.DecimalField(max_digits=10, decimal_places=9)

    def save(self, *args, **kwargs):
        if not self.pk and PayrollSetup.objects.exists():
            raise ValidationError('There can be only one instance of PayrollSetup. Please update the existing one instead of creating a new one.')
        return super(PayrollSetup, self).save(*args, **kwargs)

    def __str__(self):
        return f"Payroll Setup: {self.create_journal_entry_per}"
class TransactionTypeSetup(models.Model):
    TRANSACTION_CHOICES = (
        ('Pay', 'Pay'),
        ('Payroll Manual transaction', 'Payroll Manual transaction'),
        ('Leaves Encashment process', 'Leaves Encashment process'),
        ('Leaves Encashment payment', 'Leaves Encashment payment'),
        ('Gratuity Process', 'Gratuity Process'),
        ('Gratuity Payment', 'Gratuity Payment'),
        ('Loan  ( benefit) payment', 'Loan  ( benefit) payment'),
        ('Loan ( salary) payment', 'Loan ( salary) payment'),
        ('Loan ( cash) payment', 'Loan ( cash) payment'),
        ('Loan Settlement ( benefit)', 'Loan Settlement ( benefit)'),
        ('Loan Settlement ( salary)', 'Loan Settlement ( salary)'),
        ('Loan Settlement ( Cash)', 'Loan Settlement ( Cash)'),
        ('Employee Reimbursement payment', 'Employee Reimbursement payment'),
        ('EOS Process', 'EOS Process'),
        ('EOS Employee payment', 'EOS Employee payment'),
        ('Field expense management', 'Field expense management'),
    )
    transaction_type=models.CharField(max_length=100, choices=TRANSACTION_CHOICES,unique=True)
    transaction_type_abbreviation=models.CharField(max_length=100)

    def __str__(self):
        return f"Transaction Type: {self.transaction_type}"

