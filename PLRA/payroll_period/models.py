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
    ('Weekly', 'Weekly'),
    ('Monthly', 'Monthly'),
    ('Annually', 'Annually'),
    ('Bimonthly', 'Bimonthly'),
    )
    payroll_period_name = models.CharField(max_length=20)
    starting_month = models.CharField(choices=MONTHS, max_length=20)
    frequency = models.CharField(choices=FREQUENCY_CHOICES, max_length=20)

    def save(self):
        if self.frequency == 'Monthly':
            # Convert the starting_month to a numerical value (1 to 12)
            starting_month_index = [month[0] for month in self.MONTHS].index(self.starting_month) + 1

            # Parse the year as an integer
            payroll_year = int(self.payroll_period_name)

            # Initialize a list to store the generated dates
            monthly_dates = []

            # Generate 12 months
            for i in range(12):
                # Create a datetime object for the current month and year
                current_date = datetime(payroll_year, starting_month_index, 1)
                # Add the current date to the list in the desired format
                monthly_dates.append(current_date.strftime('%Y-%m-%d'))

                # Move to the next month
                if starting_month_index == 12:
                    starting_month_index = 1
                    payroll_year += 1
                else:
                    starting_month_index += 1

            for date in monthly_dates:
                date_obj = datetime.strptime(date, '%Y-%m-%d')
                formatted_date = date_obj.strftime('%Y-%m-%d')
                PeriodMonth.objects.create(
                    period=self,
                    period_date=formatted_date

                )
            super(PayrollPeriod, self).save()