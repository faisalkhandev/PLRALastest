from django.db import models
from datetime import datetime 
from datetime import timedelta

# Create your models here.
class PeriodMonth(models.Model):
    period=models.ForeignKey('PayrollPeriod', on_delete=models.PROTECT, related_name='payrollperiod')
    period_date= models.DateField()

    def __str__(self):
        return str(self.period_date)
    

class PayrollPeriod(models.Model):
    MONTHS = (
    ('January', 'January'),
    ('February', 'February'),
    ('March', 'March'),
    ('April', 'April'),
    ('May', 'May'),
    ('June', 'June'),
    ('July', 'July'),
    ('August', 'August'),
    ('September', 'September'),
    ('October', 'October'),
    ('November', 'November'),
    ('December', 'December'),
    )
    FREQUENCY_CHOICES = (
    ('Monthly', 'Monthly'),
    )
    payroll_period_name = models.CharField(max_length=20)
    starting_month = models.CharField(choices=MONTHS, max_length=20)
    frequency = models.CharField(choices=FREQUENCY_CHOICES, max_length=20)
