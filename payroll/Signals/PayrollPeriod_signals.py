from django.db.models.signals import pre_save
from django.dispatch import receiver
from payroll.Models.PayrollPeriod import PayrollPeriod, PeriodMonth
from datetime import datetime

@receiver(pre_save, sender=PayrollPeriod)
def handle_payroll_period(sender, instance, **kwargs):
    if instance.frequency == 'Monthly':
        starting_month_index = [month[0] for month in PayrollPeriod.MONTHS].index(instance.starting_month) + 1
        payroll_year = int(instance.payroll_period_name)

        monthly_dates = []
        for i in range(12):
            current_date = datetime(payroll_year, starting_month_index, 1)
            monthly_dates.append(current_date.strftime('%Y-%m-%d'))
            
            if starting_month_index == 12:
                starting_month_index = 1
                payroll_year += 1
            else:
                starting_month_index += 1

        for date in monthly_dates:
            date_obj = datetime.strptime(date, '%Y-%m-%d')
            formatted_date = date_obj.strftime('%Y-%m-%d')
            PeriodMonth.objects.create(
                period=instance,
                period_date=formatted_date
            )
