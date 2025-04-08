from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model, logout
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserRegistrationSerializer, LoginSerializer
from .utils import generate_tokens
from django.middleware import csrf
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError



# Create your views here.


User = get_user_model()

class RegisterViewSet(viewsets.ViewSet):
    """API endpoint for user registration."""

    permission_classes = [AllowAny]

    def create(self, request):
        """Create a new user account from registration data."""

        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "user":{
                    "id":user.id,
                    "email":user.email,
                    "first_name":user.first_name,
                    "last_name":user.last_name,
                },
                "message": "User Created Successfully"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)



refresh_expiry = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
class LoginViewSet(viewsets.ViewSet):
    """API endpoint for user Login."""

    permission_classes = [AllowAny]

    def create(self, request):

        serializer = LoginSerializer(data=request.data, context={'request':request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        tokens = generate_tokens(user)
        csrf_token = csrf.get_token(request)

        response_data = {
            "success": True,
            "message": "Login Successfull",
            "data": {
                "access": tokens['access'],
                "user_id": user.id,
                "email": user.email,
                "first_name":user.first_name,
                "last_name":user.last_name,
                "isAdmin" : user.is_superuser,

            }
        }


        response = Response(response_data, status=status.HTTP_200_OK)

        response.set_cookie(
            key='csrftoken',
            value=csrf_token,
            httponly=False,
            samesite='Lax',
        )

        response.set_cookie(
            key='refresh_token',
            value=tokens['refresh'],
            httponly=True,
            samesite='Lax',
            secure=True,
            max_age=refresh_expiry
            )
        
        return response
    
class AuthViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Logs out the user by invalidating the refresh token and clearing authentication cookies."""
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                try:
                    token = RefreshToken('refresh_token')
                    token.blacklist()
                except TokenError:
                    pass
            logout(request)
            response = Response({'message': "Logged out successfully"}, status=status.HTTP_200_OK)
            response.delete_cookie('csrftoken')
            response.delete_cookie('refresh_token')
            response.delete_cookie('sessionid')

            return response


        except Exception as e:
            return Response({"error": str(e)},status=status.HTTP_400_BAD_REQUEST)
        

        



        

        

