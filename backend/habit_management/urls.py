from django.urls import URLPattern, path
from .views import HabitListAllCreateView

urlpatterns = [
    path('', HabitListAllCreateView.as_view())
]