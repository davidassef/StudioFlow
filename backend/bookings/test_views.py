from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
from datetime import timedelta
import json

from .models import Agendamento
from studios.models import Sala
from users.models import User


class AgendamentoViewSetTest(APITestCase):
    """Testes para o AgendamentoViewSet."""
    
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
        
        # Cria outro cliente
        self.outro_cliente = User.objects.create_user(
            email='outro@test.com',
            nome='Outro Cliente',
            telefone='11777777777',
            user_type='CLIENTE'
        )
        
        # Cria usuário admin
        self.admin = User.objects.create_user(
            email='admin@test.com',
            nome='Admin Teste',
            telefone='11666666666',
            user_type='ADMIN',
            is_staff=True
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
        
        # Cria agendamento de teste
        self.agendamento = Agendamento.objects.create(
            sala=self.sala,
            cliente=self.cliente,
            horario_inicio=self.horario_inicio,
            horario_fim=self.horario_fim,
            status='PENDENTE'
        )
        
        # URLs
        self.list_url = reverse('agendamento-list')
        self.detail_url = reverse('agendamento-detail', kwargs={'pk': self.agendamento.pk})
        self.status_url = reverse('agendamento-update-status', kwargs={'pk': self.agendamento.pk})
        self.disponibilidade_url = reverse('agendamento-disponibilidade')
    
    def test_acesso_nao_autenticado(self):
        """Testa que usuários não autenticados não podem acessar os endpoints."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_listar_agendamentos_cliente(self):
        """Testa que cliente vê apenas seus próprios agendamentos."""
        # Cria agendamento de outro cliente
        Agendamento.objects.create(
            sala=self.sala,
            cliente=self.outro_cliente,
            horario_inicio=self.horario_inicio + timedelta(days=1),
            horario_fim=self.horario_fim + timedelta(days=1),
            status='PENDENTE'
        )
        
        self.client.force_authenticate(user=self.cliente)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['cliente'], self.cliente.id)
    
    def test_listar_agendamentos_admin(self):
        """Testa que admin vê todos os agendamentos."""
        # Cria agendamento de outro cliente
        Agendamento.objects.create(
            sala=self.sala,
            cliente=self.outro_cliente,
            horario_inicio=self.horario_inicio + timedelta(days=1),
            horario_fim=self.horario_fim + timedelta(days=1),
            status='PENDENTE'
        )
        
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_criar_agendamento(self):
        """Testa criação de agendamento."""
        self.client.force_authenticate(user=self.cliente)
        
        novo_horario_inicio = self.horario_inicio + timedelta(days=1)
        novo_horario_fim = novo_horario_inicio + timedelta(hours=2)
        
        data = {
            'sala': self.sala.id,
            'cliente': self.cliente.id,
            'horario_inicio': novo_horario_inicio.isoformat(),
            'horario_fim': novo_horario_fim.isoformat(),
            'status': 'PENDENTE'
        }
        
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['cliente'], self.cliente.id)
        self.assertEqual(response.data['sala'], self.sala.id)
    
    def test_criar_agendamento_conflito(self):
        """Testa criação de agendamento com conflito."""
        self.client.force_authenticate(user=self.cliente)
        
        data = {
            'sala': self.sala.id,
            'cliente': self.cliente.id,
            'horario_inicio': self.horario_inicio.isoformat(),
            'horario_fim': self.horario_fim.isoformat(),
            'status': 'PENDENTE'
        }
        
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Já existe um agendamento', str(response.data))
    
    def test_atualizar_agendamento(self):
        """Testa atualização de agendamento."""
        self.client.force_authenticate(user=self.cliente)
        
        novo_horario_inicio = self.horario_inicio + timedelta(hours=1)
        novo_horario_fim = self.horario_fim + timedelta(hours=1)
        
        data = {
            'sala': self.sala.id,
            'cliente': self.cliente.id,
            'horario_inicio': novo_horario_inicio.isoformat(),
            'horario_fim': novo_horario_fim.isoformat()
        }
        
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.agendamento.refresh_from_db()
        self.assertEqual(
            self.agendamento.horario_inicio.replace(microsecond=0),
            novo_horario_inicio.replace(microsecond=0)
        )
    
    def test_deletar_agendamento(self):
        """Testa exclusão de agendamento."""
        self.client.force_authenticate(user=self.cliente)
        
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Agendamento.objects.filter(pk=self.agendamento.pk).exists())
    
    def test_update_status_endpoint(self):
        """Testa endpoint de atualização de status."""
        self.client.force_authenticate(user=self.admin)
        
        data = {'status': 'CONFIRMADO'}
        
        response = self.client.patch(self.status_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'CONFIRMADO')
        
        self.agendamento.refresh_from_db()
        self.assertEqual(self.agendamento.status, 'CONFIRMADO')
    
    def test_update_status_invalido(self):
        """Testa atualização de status inválida."""
        self.client.force_authenticate(user=self.admin)
        
        # Primeiro cancela o agendamento
        self.agendamento.status = 'CANCELADO'
        self.agendamento.save()
        
        # Tenta alterar para confirmado
        data = {'status': 'CONFIRMADO'}
        
        response = self.client.patch(self.status_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cancelado', str(response.data))
    
    def test_disponibilidade_endpoint_sucesso(self):
        """Testa endpoint de verificação de disponibilidade com sucesso."""
        self.client.force_authenticate(user=self.cliente)
        
        # Testa horário disponível
        horario_disponivel_inicio = self.horario_inicio + timedelta(days=1)
        horario_disponivel_fim = horario_disponivel_inicio + timedelta(hours=2)
        
        params = {
            'sala_id': self.sala.id,
            'data_inicio': horario_disponivel_inicio.isoformat(),
            'data_fim': horario_disponivel_fim.isoformat()
        }
        
        response = self.client.get(self.disponibilidade_url, params)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['disponivel'])
        self.assertEqual(len(response.data['agendamentos_conflitantes']), 0)
    
    def test_disponibilidade_endpoint_conflito(self):
        """Testa endpoint de verificação de disponibilidade com conflito."""
        self.client.force_authenticate(user=self.cliente)
        
        # Testa horário com conflito
        params = {
            'sala_id': self.sala.id,
            'data_inicio': self.horario_inicio.isoformat(),
            'data_fim': self.horario_fim.isoformat()
        }
        
        response = self.client.get(self.disponibilidade_url, params)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['disponivel'])
        self.assertEqual(len(response.data['agendamentos_conflitantes']), 1)
    
    def test_disponibilidade_parametros_obrigatorios(self):
        """Testa endpoint de disponibilidade sem parâmetros obrigatórios."""
        self.client.force_authenticate(user=self.cliente)
        
        # Sem parâmetros
        response = self.client.get(self.disponibilidade_url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('obrigatórios', str(response.data))
        
        # Apenas com sala_id
        params = {'sala_id': self.sala.id}
        response = self.client.get(self.disponibilidade_url, params)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('obrigatórios', str(response.data))
    
    def test_disponibilidade_formato_data_invalido(self):
        """Testa endpoint de disponibilidade com formato de data inválido."""
        self.client.force_authenticate(user=self.cliente)
        
        params = {
            'sala_id': self.sala.id,
            'data_inicio': 'data-invalida',
            'data_fim': 'outra-data-invalida'
        }
        
        response = self.client.get(self.disponibilidade_url, params)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Formato de data inválido', str(response.data))
    
    def test_filtros_agendamentos(self):
        """Testa filtros nos agendamentos."""
        self.client.force_authenticate(user=self.admin)
        
        # Cria agendamento com status diferente
        Agendamento.objects.create(
            sala=self.sala,
            cliente=self.outro_cliente,
            horario_inicio=self.horario_inicio + timedelta(days=1),
            horario_fim=self.horario_fim + timedelta(days=1),
            status='CONFIRMADO'
        )
        
        # Filtra por status
        response = self.client.get(self.list_url, {'status': 'PENDENTE'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        # Filtra por sala
        response = self.client.get(self.list_url, {'sala': self.sala.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        
        # Filtra por cliente
        response = self.client.get(self.list_url, {'cliente': self.cliente.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_busca_agendamentos(self):
        """Testa busca nos agendamentos."""
        self.client.force_authenticate(user=self.admin)
        
        # Busca por nome da sala
        response = self.client.get(self.list_url, {'search': 'Sala Teste'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        # Busca por nome do cliente
        response = self.client.get(self.list_url, {'search': 'Cliente Teste'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        
        # Busca por email do cliente
        response = self.client.get(self.list_url, {'search': 'cliente@test.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_ordenacao_agendamentos(self):
        """Testa ordenação dos agendamentos."""
        self.client.force_authenticate(user=self.admin)
        
        # Cria outro agendamento
        Agendamento.objects.create(
            sala=self.sala,
            cliente=self.outro_cliente,
            horario_inicio=self.horario_inicio + timedelta(days=1),
            horario_fim=self.horario_fim + timedelta(days=1),
            status='CONFIRMADO'
        )
        
        # Ordena por horário de início
        response = self.client.get(self.list_url, {'ordering': 'horario_inicio'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Ordena por status
        response = self.client.get(self.list_url, {'ordering': 'status'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Ordena por valor total (decrescente)
        response = self.client.get(self.list_url, {'ordering': '-valor_total'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_acesso_agendamento_outro_cliente(self):
        """Testa que cliente não pode acessar agendamento de outro cliente."""
        self.client.force_authenticate(user=self.outro_cliente)
        
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_admin_pode_acessar_qualquer_agendamento(self):
        """Testa que admin pode acessar qualquer agendamento."""
        self.client.force_authenticate(user=self.admin)
        
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.agendamento.id)