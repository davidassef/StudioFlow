from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .serializers import (
    UserSerializer, UserUpdateSerializer, PasswordChangeSerializer, 
    UserRegistrationSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
)

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar usuários."""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['user_type', 'is_active']
    search_fields = ['nome', 'email']
    ordering_fields = ['nome', 'email', 'date_joined']
    ordering = ['nome']
    
    def get_permissions(self):
        """Define permissões específicas para cada ação."""
        if self.action == 'create':
            return [permissions.AllowAny()]
        elif self.action in ['list', 'destroy']:
            return [permissions.IsAdminUser()]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            return [permissions.IsAuthenticated()]
        elif self.action in ['me', 'change_password']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        """Retorna o queryset apropriado baseado no usuário."""
        if self.action == 'list':
            # Apenas admins podem listar todos os usuários
            if self.request.user.is_staff:
                return User.objects.all()
            else:
                return User.objects.none()
        elif self.action == 'retrieve':
            # Usuários podem ver apenas seus próprios dados, admins podem ver todos
            if self.request.user.is_staff:
                return User.objects.all()
            else:
                return User.objects.filter(id=self.request.user.id)
        return User.objects.all()
    
    def get_serializer_class(self):
        """Retorna o serializer apropriado para cada ação."""
        if self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        if self.action == 'change_password':
            return PasswordChangeSerializer
        return self.serializer_class
    
    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        """Endpoint para alterar a senha do usuário."""
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Verifica se a senha atual está correta
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {"old_password": ["Senha atual incorreta."]},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Define a nova senha
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Senha alterada com sucesso."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Retorna os dados do usuário autenticado."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class RegisterView(APIView):
    """View para registro de novos usuários."""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """View para logout do usuário."""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout realizado com sucesso."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Token inválido."}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    """View customizada para login com informações adicionais do usuário."""
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Adiciona informações do usuário na resposta
            user = User.objects.get(email=request.data['email'])
            response.data['user'] = UserSerializer(user).data
        return response


class ForgotPasswordView(APIView):
    """View para solicitar recuperação de senha."""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
                
                # Gera token e uid
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Cria link de redefinição
                reset_url = f"{settings.FRONTEND_URL}/recuperar-senha/confirmar?uid={uid}&token={token}"
                
                # Envia email
                subject = "Recuperação de Senha - StudioFlow"
                message = f"""
                Olá {user.nome},
                
                Você solicitou a recuperação de senha para sua conta no StudioFlow.
                
                Para redefinir sua senha, clique no link abaixo:
                {reset_url}
                
                Este link expirará em 24 horas.
                
                Se você não solicitou esta recuperação, ignore este email.
                
                Atenciosamente,
                Equipe StudioFlow
                """
                
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
                
                return Response(
                    {"message": "Email de recuperação enviado com sucesso."}, 
                    status=status.HTTP_200_OK
                )
                
            except User.DoesNotExist:
                return Response(
                    {"error": "Usuário não encontrado."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    """View para redefinir senha com token."""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            uidb64 = request.data.get('uid')
            
            if not uidb64:
                return Response(
                    {"error": "UID é obrigatório."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                # Decodifica o UID
                uid = force_str(urlsafe_base64_decode(uidb64))
                user = User.objects.get(pk=uid)
                
                # Valida o token
                if default_token_generator.check_token(user, token):
                    # Define a nova senha
                    user.set_password(new_password)
                    user.save()
                    
                    return Response(
                        {"message": "Senha redefinida com sucesso."}, 
                        status=status.HTTP_200_OK
                    )
                else:
                    return Response(
                        {"error": "Token inválido ou expirado."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                    
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return Response(
                    {"error": "UID inválido."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
