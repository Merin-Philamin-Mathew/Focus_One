from django.db import models
from django.conf import settings
from django.utils import timezone

# Create your models here.

class Habits(models.Model):
    '''
    Represents a Habit in Focus-One project
    Each Habit have habit_name field, created_by field(references to user model),
    a public field to specify whether the task is publically available or not, 
    active status, created time and updated time.
    '''
    habit_name = models.CharField(max_length=100, blank=False, null=False, db_index=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user', blank=False)
    is_public = models.BooleanField(default=False, blank=False, null=False)
    hidden_for = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='hidden_habits', blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.habit_name
    

class Task(models.Model):
    '''
    Represents each task that comes under the Habit model. 
    It contains task_name, habit_id(references Habit model),
    user_id (references User model),
    amount_of_work field represents how much time did the user put 
    effort to do the task. It might be the measuremnt of time or quantity of what he did,
    unit field to represent the SI unit of the amount of works done,
    is_completed field to represent whether the task is completed or not,
    created_at field to represent the task created date and time,
    updated_at field to represent the task updated date and time.
    '''
    task_name = models.CharField(max_length=100, blank=False, null=False)
    habit = models.ForeignKey(Habits, on_delete=models.CASCADE, related_name='habits', blank=False, null=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='task_user', blank=False, null=False)
    amount_of_work = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    unit = models.CharField(max_length=20, blank=False, null=False)
    is_completed = models.BooleanField(default=False, blank=False, null=False)
    is_focused = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.is_completed and not self.completed_at:
            self.completed_at = timezone.now()
        elif not self.is_completed:
            self.completed_at = None  
        super().save(*args, **kwargs)

    def __str__(self):
        return self.task_name