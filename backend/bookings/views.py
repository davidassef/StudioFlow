from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Q

from .models import Agendamento
from .serializers import AgendamentoSerializer, AgendamentoStatusUpdateSerializer


class AgendamentoViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar agendamentos de salas."""
    
    queryset = Agendamento.objects.all()
    serializer_class = AgendamentoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'sala', 'cliente']
    search_fields = ['sala__nome', 'cliente__nome', 'cliente__email']
    ordering_fields = ['horario_inicio', 'horario_fim', 'valor_total', 'status']
    
    def get_queryset(self):
        """Filtra os agendamentos com base no tipo de usuário."""
        user = self.request.user
        queryset = super().get_queryset()
        
        # Se for staff ou superuser, retorna todos os agendamentos
        if user.is_staff or user.is_superuser:
            return queryset
        
        # Se for cliente, retorna apenas os próprios agendamentos
        return queryset.filter(cliente=user)
    
    def perform_create(self, serializer):
        """Salva o agendamento com o cliente atual."""
        serializer.save(cliente=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Endpoint para atualizar o status de um agendamento."""
        agendamento = self.get_object()
        serializer = AgendamentoStatusUpdateSerializer(agendamento, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def disponibilidade(self, request):
        """Verifica a disponibilidade de uma sala em um período específico."""
        sala_id = request.query_params.get('sala_id')
        data_inicio = request.query_params.get('data_inicio')
        data_fim = request.query_params.get('data_fim')
        
        if not all([sala_id, data_inicio, data_fim]):
            return Response(
                {"error": "Os parâmetros sala_id, data_inicio e data_fim são obrigatórios."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Converte as strings para datetime
            horario_inicio = timezone.datetime.fromisoformat(data_inicio)
            horario_fim = timezone.datetime.fromisoformat(data_fim)
            
            # Verifica se há agendamentos conflitantes
            agendamentos_conflitantes = Agendamento.objects.filter(
                sala_id=sala_id,
                status__in=['PENDENTE', 'CONFIRMADO'],
                horario_inicio__lt=horario_fim,
                horario_fim__gt=horario_inicio
            )
            
            disponivel = not agendamentos_conflitantes.exists()
            
            return Response({
                "disponivel": disponivel,
                "agendamentos_conflitantes": AgendamentoSerializer(
                    agendamentos_conflitantes, many=True
                ).data if not disponivel else []
            })
            
        except (ValueError, TypeError):
            return Response(
                {"error": "Formato de data inválido. Use o formato ISO (YYYY-MM-DDTHH:MM:SS)."},
                status=status.HTTP_400_BAD_REQUEST
            )
