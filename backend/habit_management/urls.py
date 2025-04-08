from django.urls import path
from .views import HabitListCreateView, HabitRetrieveUpdateDestroyView, TaskListCreateView, TaskRetrieveUpdateDestroyView, OnGoingTaskView, SearchHabitView

urlpatterns = [
    path('', HabitListCreateView.as_view()),
    path('<int:pk>/', HabitRetrieveUpdateDestroyView.as_view()),
    path('task/', TaskListCreateView.as_view()),
    path('task/<int:pk>/', TaskRetrieveUpdateDestroyView.as_view()),
    path('ongoing-task/', OnGoingTaskView.as_view()),
    path('search-habit/', SearchHabitView.as_view()),
]