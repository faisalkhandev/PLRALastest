from django.db import models
from datetime import date, timedelta, datetime


class HRCelanderYear(models.Model):
    id = models.AutoField(primary_key=True)
    hr_celander_starting_date = models.DateField()
    hr_celander_ending_date = models.DateField()
    hr_year = models.IntegerField()
    active = models.BooleanField()

    def __str__(self):
        return f"HRCalender Year {self.hr_year}: {self.hr_celander_starting_date} to {self.hr_celander_ending_date}"

    def save(self, *args, **kwargs):
        if self.active:
            HRCelanderYear.objects.exclude(id=self.id).update(active=False)

        week_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        start_dt = self.hr_celander_starting_date
        end_dt = self.hr_celander_ending_date

        while start_dt <= end_dt:
            if start_dt.weekday() in [5, 6]:  # Saturday or Sunday
                Holiday_dates.objects.create(date=start_dt)
            start_dt += timedelta(days=1)

        super(HRCelanderYear, self).save(*args, **kwargs)


class Holiday_dates(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()


class Holiday(models.Model):
    CHRISTIANITY = 'Christianity'
    ISLAM = 'Islam'
    HINDUISM = 'Hinduism'
    BUDDHISM = 'Buddhism'
    JUDAISM = 'Judaism'
    ALL = 'All'

    ALLOWED_CHOICES = [
        (CHRISTIANITY, 'Christianity'),
        (ISLAM, 'Islam'),
        (HINDUISM, 'Hinduism'),
        (BUDDHISM, 'Buddhism'),
        (JUDAISM, 'Judaism'),
        (ALL, 'All'),
    ]

    id = models.AutoField(primary_key=True)
    holiday_from_date = models.DateField()
    holiday_to_date = models.DateField()
    holiday_type = models.CharField(max_length=50)
    allowed_to = models.CharField(max_length=20, choices=ALLOWED_CHOICES)

    def save(self, *args, **kwargs):
        week_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

        if not self.pk:  # If it's a new record
            for single_date in range((self.holiday_to_date - self.holiday_from_date).days + 1):
                current_date = self.holiday_from_date + timedelta(days=single_date)

                if current_date.weekday() not in [5, 6]:  # Not Saturday or Sunday
                    Holiday_dates.objects.create(date=current_date)

        super(Holiday, self).save(*args, **kwargs)
