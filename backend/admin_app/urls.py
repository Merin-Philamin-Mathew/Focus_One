from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import AdminHabitViewSet

router = DefaultRouter()
router.register(r'habits', AdminHabitViewSet, basename='admin-habits')


urlpatterns = [
    path ('', include(router.urls)),
]