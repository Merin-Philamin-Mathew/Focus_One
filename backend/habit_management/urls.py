from django.urls import URLPattern, path
from .views import HabitListCreateView

urlpatterns = [
    path('', HabitListCreateView.as_view())
]