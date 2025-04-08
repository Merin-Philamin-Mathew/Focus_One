from .serializers import HabitSerializer
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Habits, Task, FocusSession
# Create your views here.

class HabitListCreateView(APIView):
    '''
    HabitListCreateView is to get all habits and create a new habit
    '''

    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        habits = Habits.objects.all()
        serializer = HabitSerializer(habits, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = HabitSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(created_by=request.user)

class HabitRetrieveUpdateDestroyView(APIView):
    '''
    HabitRetrieveUpdateDestroyView is to get a single habit, also for update and delete them.
    '''
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        try:
            habit = Habits.objects.get(pk=pk)
        except Habits.DoesNotExist:
            return Response({"error":"Habit does not exists"}, status=status.HTTP_404_NOT_FOUND)
        serializer = HabitSerializer(habit)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, pk):
        try:
            habit = Habits.objects.get(pk=pk)
        except Habits.DoesNotExist:
            return Response({"error":"Habit does not exists"}, status=status.HTTP_404_NOT_FOUND)
        serializer = HabitSerializer(habit, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, pk):
        try:
            habit = Habits.objects.get(pk=pk)
        except Habits.DoesNotExist:
            return Response({"error":"Habit does not exists"}, status=status.HTTP_404_NOT_FOUND)
        habit.delete()
        return Response({"success":"habit deleted successfully"}, status=status.HTTP_200_OK)
