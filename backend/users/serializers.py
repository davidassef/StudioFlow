from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer para o modelo de usuário."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'nome', 'telefone', 'user_type', 'password', 'password_confirm']
        extra_kwargs = {
            'email': {'required': True},
            'nome': {'required': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "As senhas não conferem."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualização de usuário sem alterar a senha."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'nome', 'telefone', 'user_type']
        read_only_fields = ['email']
        extra_kwargs = {
            'nome': {'required': True},
        }


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer para alteração de senha."""
    
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "As senhas não conferem."})
        return attrs