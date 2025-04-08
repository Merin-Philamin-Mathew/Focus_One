import logging
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
from rest_framework_simplejwt.views import TokenRefreshView

logger = logging.getLogger(__name__)



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



class LoginViewSet(viewsets.ViewSet):
    """API endpoint for user Login."""

    permission_classes = [AllowAny]
    refresh_expiry = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())

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
            max_age=self.refresh_expiry
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
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                    logger.info(f"Refresh token successfully blacklisted for user {request.user}")
                except TokenError as e:
                    logger.warning(f"Invalid refresh token during logout for user {request.user}: {e}")
                    pass
            else:
                logger.info(f"No refresh token found in cookies for user {request.user}")

            logger.info(f"User {request.user} logged out successfully.")
            logout(request)


            response = Response({'message': "Logged out successfully"}, status=status.HTTP_200_OK)
            response.delete_cookie('csrftoken')
            response.delete_cookie('refresh_token')
            response.delete_cookie('sessionid')

            return response


        except Exception as e:
            logger.error(f"Error during logout for user {request.user}: {str(e)}", exc_info=True)
            return Response({"error": str(e)},status=status.HTTP_400_BAD_REQUEST)
        

class CustomTokenRefreshView(TokenRefreshView):
    """Handles refreshing access tokens and setting a new refresh token in cookies."""
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """Validates the refresh token, issues a new access token, and updates the refresh token cookie."""
        
        refresh_token = request.headers.get('X-Refresh-Token') or request.COOKIES.get('refresh_token')
        logger.debug(f"Received refresh token: {refresh_token}")

        if not refresh_token:
            logger.warning("Refresh token is missing in the request")
            return Response({'error': 'Refresh Token is missing'}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            refresh = RefreshToken(refresh_token)

            if refresh.payload.get('token_type') != 'refresh':
                logger.warning("Invalid token type detected in refresh token")
                return Response({'error': 'Invalid token type'}, status=status.HTTP_401_UNAUTHORIZED)
        
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)

            new_refresh_token = response.data.get('refresh')
            if new_refresh_token:
                response.set_cookie(
                    key='refresh_token',
                    value=new_refresh_token,
                    httponly=True,
                    secure=True,  
                    samesite='Lax',
                    max_age=7 * 24 * 60 * 60,
                )
                logger.info("New refresh token cookie set successfully.")

            return response
        
        except TokenError as e:
            logger.error(f"Token error occurred: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.exception("An unexpected error occurred during token refresh")
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)