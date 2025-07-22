from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Sala
from .serializers import SalaSerializer


class SalaViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar salas de estúdio."""
    
    queryset = Sala.objects.all()
    serializer_class = SalaSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_disponivel', 'capacidade']
    search_fields = ['nome', 'descricao']
    ordering_fields = ['nome', 'capacidade', 'preco_hora']
    
    def get_permissions(self):
        """Define permissões específicas para cada ação."""
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        """Salva a sala com os dados validados."""
        serializer.save()
    
    def perform_update(self, serializer):
        """Atualiza a sala com os dados validados."""
        serializer.save()
