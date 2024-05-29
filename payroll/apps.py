from django.apps import AppConfig


class PayrollPeriodConfig(AppConfig):
    default_auto_field = 'django.db.models.AutoField'
    name = 'payroll'
    def ready(self):
        from .Signals import PayrollPeriod_signals
