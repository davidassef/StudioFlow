from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserUpdateSerializer, PasswordChangeSerializer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar usuários."""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Define permissões específicas para cada ação."""
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()
    
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
