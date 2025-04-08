from .serializers import HabitSerializer, TaskSerializer
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Habits, Task
from datetime import date
# Create your views here.

class HabitListCreateView(APIView):
    '''
    HabitListCreateView is to get all habits and create a new habit
    '''

    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        habits = Habits.objects.filter(created_by=request.user, is_active=True).exclude(hidden_for=request.user)
        serializer = HabitSerializer(habits, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        habit_name = request.data.get('habit_name')
        if not habit_name:
            return Response({"error":"habit_name field is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            existing_habit = Habits.objects.get(habit_name=habit_name, created_by=request.user)
            if request.user in existing_habit.hidden_for.all():
                existing_habit.hidden_for.remove(request.user)
                serializer = HabitSerializer(existing_habit)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error":"Habit already exists"}, status=status.HTTP_400_BAD_REQUEST)
        except Habits.DoesNotExist:
            pass

        # here we will create a new habit since the habit is not exists.
        serializer = HabitSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HabitRetrieveUpdateDestroyView(APIView):
    '''
    HabitRetrieveUpdateDestroyView is to get a single habit, also for update and delete them.
    '''
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        try:
            habit = Habits.objects.get(pk=pk, created_by=request.user, is_active=True)
        except Habits.DoesNotExist:
            return Response({"error":"Habit does not exists"}, status=status.HTTP_404_NOT_FOUND)
        serializer = HabitSerializer(habit)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        try:
            habit = Habits.objects.get(pk=pk, created_by=request.user)
        except Habits.DoesNotExist:
            return Response({"error":"Habit does not exists"}, status=status.HTTP_404_NOT_FOUND)
        serializer = HabitSerializer(habit, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            habit = Habits.objects.get(pk=pk, created_by=request.user)
        except Habits.DoesNotExist:
            return Response({"error":"Habit does not exists"}, status=status.HTTP_404_NOT_FOUND)
        habit.hidden_for.add(request.user)
        return Response({"message":"habit deleted successfully"}, status=status.HTTP_200_OK)

class TaskListCreateView(APIView):
    '''
    TaskListCreateView is to list all completed tasks of a specific user of the present day. 
    This view will also create a new task for a specific habit for a specific user.
    '''
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        today = date.today()
        tasks = Task.objects.filter(is_completed=True, user=request.user, completed_at__date=today).select_related('habit')
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskRetrieveUpdateDestroyView(APIView):
    '''
    View to retrieve, update, and soft-delete a task for the authenticated user.
    '''
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        try:
            task = Task.objects.select_related('habit').get(pk=pk, user=request.user)
        except Task.DoesNotExist:
            return Response({"error":"Task does not exist"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        try:
            task = Task.objects.select_related('habit').get(pk=pk, user=request.user)
        except Task.DoesNotExist:
            return Response({'error':'Task does not exist'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            task = Task.objects.get(pk=pk, user=request.user)
        except Task.DoesNotExist:
            return Response({'error':'Task does not exist'}, status=status.HTTP_404_NOT_FOUND)
        task.delete()
        return Response({'message':'Task deleted successfully'}, status=status.HTTP_200_OK)

class OnGoingTaskView(APIView):
    '''
    OnGoingTaskView is to display the current Focused task which is not yet completed
    '''
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        try:
            ongoing_task = Task.objects.select_related('habit').get(user=request.user, is_completed=False)
        except Task.DoesNotExist:
            return Response({'message': 'No ongoing task found'}, status=status.HTTP_200_OK)
        serializer = TaskSerializer(ongoing_task, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SearchHabitView(APIView):
    '''
    SearchHabitView is to fetch habits based on user search
    '''
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        search_term = request.data.get("query","").strip()
        if not search_term:
            return Response({'error':'search_term is empty'}, status=status.HTTP_400_BAD_REQUEST)
        habits = Habits.objects.filter(habit_name__istartswith=search_term, is_active=True, is_public=True).exclude(hidden_for=request.user)
        serializer = HabitSerializer(habits, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)