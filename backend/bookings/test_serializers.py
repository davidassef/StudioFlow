from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from decimal import Decimal
from datetime import timedelta

from .models import Agendamento
from .serializers import AgendamentoSerializer, AgendamentoStatusUpdateSerializer
from studios.models import Sala
from users.models import User


class AgendamentoSerializerTest(TestCase):
    """Testes para o AgendamentoSerializer."""
    
    def setUp(self):
        """Configura os dados de teste."""
        # Cria usuário proprietário
        self.proprietario = User.objects.create_user(
            email='proprietario@test.com',
            nome='Proprietário Teste',
            telefone='11999999999',
            user_type='PROPRIETARIO'
        )
        
        # Cria cliente
        self.cliente = User.objects.create_user(
            email='cliente@test.com',
            nome='Cliente Teste',
            telefone='11888888888',
            user_type='CLIENTE'
        )
        
        # Cria sala
        self.sala = Sala.objects.create(
            nome='Sala Teste',
            descricao='Descrição da sala teste',
            capacidade=10,
            preco_hora=Decimal('100.00')
        )
        
        # Define horários para testes
        self.horario_inicio = timezone.now() + timedelta(hours=1)
        self.horario_fim = self.horario_inicio + timedelta(hours=2)
    
    def test_serializer_valido(self):
        """Testa se o serializer funciona com dados válidos."""
        data = {
            'sala': self.sala.id,
            'cliente': self.cliente.id,
            'horario_inicio': self.horario_inicio.isoformat(),
            'horario_fim': self.horario_fim.isoformat(),
            'status': 'PENDENTE'
        }
        
        serializer = AgendamentoSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        agendamento = serializer.save()
        self.assertEqual(agendamento.sala, self.sala)
        self.assertEqual(agendamento.cliente, self.cliente)
        self.assertEqual(agendamento.status, 'PENDENTE')
    
    def test_horario_inicio_posterior_ao_fim(self):
        """Testa validação quando horário de início é posterior ao fim."""
        data = {
            'sala': self.sala.id,
            'cliente': self.cliente.id,
            'horario_inicio': self.horario_fim.isoformat(),
            'horario_fim': self.horario_inicio.isoformat(),
            'status': 'PENDENTE'
        }
        
        serializer = AgendamentoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('O horário de início deve ser anterior ao horário de fim.', 
                      str(serializer.errors))
    
    def test_horario_passado(self):
        """Testa validação quando horário é no passado."""
        horario_passado = timezone.now() - timedelta(hours=1)
        
        data = {
            'sala': self.sala.id,
            'cliente': self.cliente.id,
            'horario_inicio': horario_passado.isoformat(),
            'horario_fim': (horario_passado + timedelta(hours=1)).isoformat(),
            'status': 'PENDENTE'
        }
        
        serializer = AgendamentoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('Não é possível agendar para uma data/hora passada.', 
                      str(serializer.errors))
    
    def test_conflito_agendamento(self):
        """Testa validação quando há conflito com outro agendamento."""
        # Cria um agendamento existente
        Agendamento.objects.create(
            sala=self.sala,
            cliente=self.cliente,
            horario_inicio=self.horario_inicio,
            horario_fim=self.horario_fim,
            status='CONFIRMADO'
        )
        
        # Tenta criar outro agendamento no mesmo horário
        data = {
            'sala': self.sala.id,
            'cliente': self.cliente.id,
            'horario_inicio': self.horario_inicio.isoformat(),
            'horario_fim': self.horario_fim.isoformat(),
            'status': 'PENDENTE'
        }
        
        serializer = AgendamentoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('Já existe um agendamento para este horário nesta sala.', 
                      str(serializer.errors))
    
    def test_conflito_parcial(self):
        """Testa validação quando há conflito parcial com outro agendamento."""
        # Cria um agendamento existente
        Agendamento.objects.create(
            sala=self.sala,
            cliente=self.cliente,
            horario_inicio=self.horario_inicio,
            horario_fim=self.horario_fim,
            status='CONFIRMADO'
        )
        
        # Tenta criar agendamento que sobrepõe parcialmente
        novo_inicio = self.horario_inicio + timedelta(minutes=30)
        novo_fim = self.horario_fim + timedelta(minutes=30)
        
        data = {
            'sala': self.sala.id,
            'cliente': self.cliente.id,
            'horario_inicio': novo_inicio.isoformat(),
            'horario_fim': novo_fim.isoformat(),
            'status': 'PENDENTE'
        }
        
        serializer = AgendamentoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('Já existe um agendamento para este horário nesta sala.', 
                      str(serializer.errors))
    
    def test_agendamento_cancelado_nao_conflita(self):
        """Testa que agendamentos cancelados não geram conflito."""
        # Cria um agendamento cancelado
        Agendamento.objects.create(
            sala=self.sala,
            cliente=self.cliente,
            horario_inicio=self.horario_inicio,
            horario_fim=self.horario_fim,
            status='CANCELADO'
        )
        
        # Tenta criar outro agendamento no mesmo horário
        data = {
            'sala': self.sala.id,
            'cliente': self.cliente.id,
            'horario_inicio': self.horario_inicio.isoformat(),
            'horario_fim': self.horario_fim.isoformat(),
            'status': 'PENDENTE'
        }
        
        serializer = AgendamentoSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_campos_read_only(self):
        """Testa se os campos read-only são ignorados na criação."""
        data = {
            'sala': self.sala.id,
            'cliente': self.cliente.id,
            'horario_inicio': self.horario_inicio.isoformat(),
            'horario_fim': self.horario_fim.isoformat(),
            'status': 'PENDENTE',
            'valor_total': Decimal('999.99'),  # Campo read-only
            'data_criacao': timezone.now().isoformat(),  # Campo read-only
            'data_atualizacao': timezone.now().isoformat()  # Campo read-only
        }
        
        serializer = AgendamentoSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        agendamento = serializer.save()
        # O valor_total deve ser calculado automaticamente, não o fornecido
        self.assertEqual(agendamento.valor_total, Decimal('200.00'))  # 2 horas * 100/hora


class AgendamentoStatusUpdateSerializerTest(TestCase):
    """Testes para o AgendamentoStatusUpdateSerializer."""
    
    def setUp(self):
        """Configura os dados de teste."""
        # Cria usuário proprietário
        self.proprietario = User.objects.create_user(
            email='proprietario@test.com',
            nome='Proprietário Teste',
            telefone='11999999999',
            user_type='PROPRIETARIO'
        )
        
        # Cria cliente
        self.cliente = User.objects.create_user(
            email='cliente@test.com',
            nome='Cliente Teste',
            telefone='11888888888',
            user_type='CLIENTE'
        )
        
        # Cria sala
        self.sala = Sala.objects.create(
            nome='Sala Teste',
            descricao='Descrição da sala teste',
            capacidade=10,
            preco_hora=Decimal('100.00')
        )
        
        # Cria agendamento
        self.agendamento = Agendamento.objects.create(
            sala=self.sala,
            cliente=self.cliente,
            horario_inicio=timezone.now() + timedelta(hours=1),
            horario_fim=timezone.now() + timedelta(hours=3),
            status='PENDENTE'
        )
    
    def test_atualizacao_status_valida(self):
        """Testa atualização válida de status."""
        data = {'status': 'CONFIRMADO'}
        
        serializer = AgendamentoStatusUpdateSerializer(
            self.agendamento, data=data, partial=True
        )
        self.assertTrue(serializer.is_valid())
        
        agendamento_atualizado = serializer.save()
        self.assertEqual(agendamento_atualizado.status, 'CONFIRMADO')
    
    def test_nao_pode_alterar_cancelado(self):
        """Testa que não é possível alterar status de agendamento cancelado."""
        self.agendamento.status = 'CANCELADO'
        self.agendamento.save()
        
        data = {'status': 'CONFIRMADO'}
        
        serializer = AgendamentoStatusUpdateSerializer(
            self.agendamento, data=data, partial=True
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn('Não é possível alterar o status de um agendamento cancelado.', 
                      str(serializer.errors))
    
    def test_nao_pode_alterar_concluido(self):
        """Testa que não é possível alterar status de agendamento concluído."""
        self.agendamento.status = 'CONCLUIDO'
        self.agendamento.save()
        
        data = {'status': 'CONFIRMADO'}
        
        serializer = AgendamentoStatusUpdateSerializer(
            self.agendamento, data=data, partial=True
        )
        self.assertFalse(serializer.is_valid())
        self.assertIn('Não é possível alterar o status de um agendamento concluído.', 
                      str(serializer.errors))
    
    def test_pode_manter_status_cancelado(self):
        """Testa que é possível manter o status cancelado."""
        self.agendamento.status = 'CANCELADO'
        self.agendamento.save()
        
        data = {'status': 'CANCELADO'}
        
        serializer = AgendamentoStatusUpdateSerializer(
            self.agendamento, data=data, partial=True
        )
        self.assertTrue(serializer.is_valid())
    
    def test_pode_manter_status_concluido(self):
        """Testa que é possível manter o status concluído."""
        self.agendamento.status = 'CONCLUIDO'
        self.agendamento.save()
        
        data = {'status': 'CONCLUIDO'}
        
        serializer = AgendamentoStatusUpdateSerializer(
            self.agendamento, data=data, partial=True
        )
        self.assertTrue(serializer.is_valid())