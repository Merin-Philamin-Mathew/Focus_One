from django.urls import path, include
from rest_framework.routers import DefaultRouter 
from .views import RegisterViewSet,LoginViewSet, AuthViewSet

router = DefaultRouter()
router.register(r'register',RegisterViewSet, basename='register')
router.register(r'login', LoginViewSet, basename='login')
router.register(r'', AuthViewSet, basename='logout')

urlpatterns = [
    path('', include(router.urls)),
]