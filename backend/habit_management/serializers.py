from rest_framework import serializers
from .models import Habits, Task, FocusSession

class HabitSerializer(serializers.ModelSerializer):
    '''
    HabitSerializer is to manage the creation and updation of Habits data
    '''
    model = Habits
    fields = ['habit_name','created_by','is_public','is_active','created_at','updated_at']
    extra_kwargs = {
        'created_by':{'read_only':True},
        'created_at': {'read_only':True},
        'updated_at': {'read_only':True}
    }