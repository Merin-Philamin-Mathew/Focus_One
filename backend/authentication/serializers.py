from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email, RegexValidator
from .validators import validate_strong_password
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with validation."""

    password = serializers.CharField(
        write_only = True,
        required = True,
        validators = [validate_password, validate_strong_password],
        style = {'input_type':'password'}
    )
    email = serializers.EmailField(
        required=True,
        validators=[validate_email]
    )
    first_name = serializers.CharField(
        required=True,
        validators=[RegexValidator(r'^[a-zA-Z]+$', 'First name must contain only letters.')]
    )
    last_name = serializers.CharField(
        required=True,
        validators=[RegexValidator(r'^[a-zA-Z]+$', 'Last name must contain only letters.')]
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password')

    def validate_email(self, value):
        """Check if email is already in use."""

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self, validated_data):
        """Create and return a new user instance."""

        user=User(
            email=validated_data['email'],
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        user.set_password(validated_data['password'])
        user.save()
        return user
    


class LoginSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('email', 'password')
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')


        if email and password:
            user = authenticate(request=self.context.get('request'),username=email, password=password )

            if not user:
                raise serializers.ValidationError(_("Invalid email or password"), code='authorization')
            
            if not user.is_active:
                raise serializers.ValidationError(_('User account is disabled.'), code='authorization')
            
            attrs['user'] = user
            return attrs
    
        
        raise serializers.ValidationError(_("Both 'email' and 'password' are required."), code='authorization')