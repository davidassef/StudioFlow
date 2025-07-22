from rest_framework import serializers
from django.utils import timezone
from .models import Agendamento
from studios.serializers import SalaSerializer
from users.serializers import UserSerializer


class AgendamentoSerializer(serializers.ModelSerializer):
    """Serializer para o modelo de agendamentos."""
    
    sala_detail = SalaSerializer(source='sala', read_only=True)
    cliente_detail = UserSerializer(source='cliente', read_only=True)
    
    class Meta:
        model = Agendamento
        fields = ['id', 'sala', 'cliente', 'horario_inicio', 'horario_fim', 'valor_total', 'status', 
                  'data_criacao', 'data_atualizacao', 'sala_detail', 'cliente_detail']
        read_only_fields = ['valor_total', 'data_criacao', 'data_atualizacao']
    
    def validate(self, attrs):
        """Valida se o horário de início é anterior ao horário de fim e se não há conflito com outros agendamentos."""
        # Verifica se o horário de início é anterior ao horário de fim
        if attrs['horario_inicio'] >= attrs['horario_fim']:
            raise serializers.ValidationError("O horário de início deve ser anterior ao horário de fim.")
        
        # Verifica se o horário de início é futuro
        if attrs['horario_inicio'] < timezone.now():
            raise serializers.ValidationError("Não é possível agendar para uma data/hora passada.")
        
        # Verifica se há conflito com outros agendamentos
        sala = attrs['sala']
        horario_inicio = attrs['horario_inicio']
        horario_fim = attrs['horario_fim']
        
        # Exclui o próprio agendamento em caso de atualização
        instance = self.instance
        agendamentos_conflitantes = Agendamento.objects.filter(
            sala=sala,
            status__in=['PENDENTE', 'CONFIRMADO'],
            horario_inicio__lt=horario_fim,
            horario_fim__gt=horario_inicio
        )
        
        if instance:
            agendamentos_conflitantes = agendamentos_conflitantes.exclude(pk=instance.pk)
        
        if agendamentos_conflitantes.exists():
            raise serializers.ValidationError("Já existe um agendamento para este horário nesta sala.")
        
        return attrs


class AgendamentoStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualização do status de um agendamento."""
    
    class Meta:
        model = Agendamento
        fields = ['status']
        
    def validate_status(self, value):
        """Valida se o status é válido para a transição."""
        instance = self.instance
        
        # Regras de transição de status
        if instance.status == 'CANCELADO' and value != 'CANCELADO':
            raise serializers.ValidationError("Não é possível alterar o status de um agendamento cancelado.")
        
        if instance.status == 'CONCLUIDO' and value != 'CONCLUIDO':
            raise serializers.ValidationError("Não é possível alterar o status de um agendamento concluído.")
        
        return value