from django.db import models
from django.conf import settings

# Create your models here.

class Habits(models.Model):
    '''
    Represents a Habit in Focus-One project
    Each Habit have habit_name field, created_by field(references to user model),
    a public field to specify whether the task is publically available or not, 
    active status, created time and updated time.
    '''
    habit_name = models.CharField(max_length=100, blank=False, null=False)
    creator_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='habits', blank=False)
    is_public = models.BooleanField(default=False, blank=False, null=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.habit_name
    

