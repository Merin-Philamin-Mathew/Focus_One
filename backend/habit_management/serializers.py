from rest_framework import serializers
from .models import Habits, Task


class HabitSerializer(serializers.ModelSerializer):
    '''
    HabitSerializer is to manage the creation and updation of Habits data
    '''
    class Meta:
        model = Habits
        fields = ['id','habit_name','created_by','is_public','is_active','created_at','updated_at']
        extra_kwargs = {
            'is_public':{'read_only':True},
            'created_by':{'read_only':True},
            'created_at': {'read_only':True},
            'updated_at': {'read_only':True}
        }


class TaskSerializer(serializers.ModelSerializer):
    '''
    Task serializer is to manage tasks which defines a habit. This serializer perform crud operations.
    '''
    habit = HabitSerializer(read_only=True)
    habit_id = serializers.PrimaryKeyRelatedField(queryset=Habits.objects.all(), source='habit', write_only=True)
    class Meta:
        model = Task
        fields = [
            'id', 'task_name', 'habit', 'habit_id', 'user','est_amount_of_work',
            'amount_of_work', 'unit', 'is_completed',
            'created_at', 'completed_at'
        ]
        extra_kwargs = {
            'created_at':{'read_only':True},
            'user':{'read_only':True},
        }