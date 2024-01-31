from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password

class UserManager(BaseUserManager):
    use_in_migrations = True
    
    def create_user(self, cnic, password, **extra_fields):
        if not cnic:
            raise ValueError("Users must have a cnic")
        if not password:
            raise ValueError("Users must have a password")
        
        user = self.model(
            cnic = cnic,
            **extra_fields
        )
        # hash_pass = make_password(password)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, cnic, password, **extra_fields):
        # Set the necessary fields for a superuser
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        # Create the superuser instance using the create_user method
        return self.create_user(cnic, password, **extra_fields)
