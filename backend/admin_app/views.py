from django.shortcuts import render
from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets, status
from .serializers import AdminHabitSerializer
from habit_management.models import Habits
from rest_framework.response import Response


class AdminHabitViewSet(viewsets.ModelViewSet):

    """ Admin Habit ViewSet for full CRUD control over habits. """ 

    queryset = Habits.objects.all()
    serializer_class = AdminHabitSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.is_public:
            return Response(
                {"detail": "You cannot edit private habits."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.is_public:
            return Response(
                {"detail": "You cannot delete private habits."},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.is_active = False
        instance.save()
        return Response(
            {"message": "Habit soft deleted successfully."},
            status=status.HTTP_200_OK
        )