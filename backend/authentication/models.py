from django.db import models
from django.contrib.auth.models import AbstractUser
from habit_management.models import Task

# Create your models here.


class User(AbstractUser):
    email = models.EmailField(unique=True)
    ongoing_task = models.OneToOneField(Task,on_delete=models.SET_NULL,null=True,blank=True,    related_name='ongoing_for_user'  # 👈 avoids conflict
)

    class Meta:
        db_table = 'user'


