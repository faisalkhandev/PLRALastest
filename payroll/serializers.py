from rest_framework import serializers
from django.contrib.auth import get_user_model
from.Models import *
from employee_basic_information.serializers import *

class PayrollSetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollSetup
        fields = '__all__'
class TransactionTypeSetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransactionTypeSetup
        fields = '__all__'