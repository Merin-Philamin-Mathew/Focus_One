from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    email = models.EmailField(unique=True)
    ongoing_task = models.OneToOneField('habit_management.Task',on_delete=models.SET_NULL,null=True,blank=True)

    class Meta:
        db_table = 'user'


