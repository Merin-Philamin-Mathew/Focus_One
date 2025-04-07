from django.urls import URLPattern, path
from .views import HabitListAllAndCreateView

urlpatterns = [
    path('', HabitListAllAndCreateView.as_view())
]