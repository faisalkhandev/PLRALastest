from django.apps import AppConfig


class EmployeeBasicInformationConfig(AppConfig):
    # The default auto field type to use for automatically created primary keys.
    default_auto_field = 'django.db.models.AutoField'
    name = 'employee_basic_information'
    verbose_name ="Employee"
    verbose_name_plural = "Employees"
    # def ready(self):
    #     from jobs import updated
    #     updated.start()
    
    
