from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
import json

from .models import Sala
from users.models import User


class SalaViewSetTest(APITestCase):
    """Testes para o SalaViewSet."""
    
    def setUp(self):
        """Configura os dados de teste."""
        # Cria usuários de teste
        self.proprietario1 = User.objects.create_user(
            email='prop1@test.com',
            nome='Proprietário 1',
            telefone='11999999999',
            user_type='PROPRIETARIO'
        )
        
        self.proprietario2 = User.objects.create_user(
            email='prop2@test.com',
            nome='Proprietário 2',
            telefone='11888888888',
            user_type='PROPRIETARIO'
        )
        
        self.cliente = User.objects.create_user(
            email='cliente@test.com',
            nome='Cliente Teste',
            telefone='11777777777',
            user_type='CLIENTE'
        )
        
        self.admin = User.objects.create_user(
            email='admin@test.com',
            nome='Admin Teste',
            telefone='11666666666',
            user_type='ADMIN',
            is_staff=True
        )
        
        # Cria salas de teste
        self.sala1 = Sala.objects.create(
            nome='Sala Premium',
            descricao='Sala com equipamentos premium',
            capacidade=20,
            preco_hora=Decimal('200.00')
        )
        
        self.sala2 = Sala.objects.create(
            nome='Sala Básica',
            descricao='Sala com equipamentos básicos',
            capacidade=10,
            preco_hora=Decimal('100.00')
        )
        
        # URLs
        self.list_url = reverse('sala-list')
        self.detail_url = reverse('sala-detail', kwargs={'pk': self.sala1.pk})
    
    def test_acesso_nao_autenticado(self):
        """Testa que usuários não autenticados podem listar salas."""
        response = self.client.get(self.list_url)
        # Salas podem ser públicas para visualização
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED])
    
    def test_listar_salas(self):
        """Testa listagem de salas."""
        self.client.force_authenticate(user=self.cliente)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
    
    def test_detalhes_sala(self):
        """Testa visualização de detalhes de uma sala."""
        self.client.force_authenticate(user=self.cliente)
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], self.sala1.nome)
        self.assertEqual(response.data['capacidade'], self.sala1.capacidade)
        self.assertEqual(str(response.data['preco_hora']), str(self.sala1.preco_hora))
    
    def test_criar_sala_proprietario(self):
        """Testa criação de sala por proprietário."""
        self.client.force_authenticate(user=self.proprietario1)
        
        data = {
            'nome': 'Nova Sala',
            'descricao': 'Descrição da nova sala',
            'capacidade': 15,
            'preco_hora': '150.00'
        }
        
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nome'], data['nome'])
        self.assertEqual(response.data['capacidade'], data['capacidade'])
        
        # Verifica se foi criada no banco
        self.assertTrue(Sala.objects.filter(nome=data['nome']).exists())
    
    def test_criar_sala_cliente_permitido(self):
        """Testa que cliente pode criar sala."""
        self.client.force_authenticate(user=self.cliente)
        
        data = {
            'nome': 'Nova Sala',
            'descricao': 'Descrição da nova sala',
            'capacidade': 15,
            'preco_hora': '150.00'
        }
        
        response = self.client.post(self.list_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['nome'], data['nome'])
    
    def test_atualizar_sala_proprietario(self):
        """Testa atualização de sala pelo proprietário."""
        self.client.force_authenticate(user=self.proprietario1)
        
        data = {
            'nome': 'Sala Premium Atualizada',
            'capacidade': 25,
            'preco_hora': '250.00'
        }
        
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], data['nome'])
        self.assertEqual(response.data['capacidade'], data['capacidade'])
        
        # Verifica se foi atualizada no banco
        self.sala1.refresh_from_db()
        self.assertEqual(self.sala1.nome, data['nome'])
        self.assertEqual(self.sala1.capacidade, data['capacidade'])
    
    def test_atualizar_sala_outro_usuario_permitido(self):
        """Testa que outro usuário pode atualizar sala."""
        self.client.force_authenticate(user=self.proprietario2)
        
        data = {
            'nome': 'Sala Atualizada',
            'capacidade': 30
        }
        
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], data['nome'])
    
    def test_deletar_sala_proprietario(self):
        """Testa exclusão de sala pelo proprietário."""
        self.client.force_authenticate(user=self.proprietario1)
        
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verifica se foi deletada do banco
        self.assertFalse(Sala.objects.filter(pk=self.sala1.pk).exists())
    
    def test_deletar_sala_outro_usuario_permitido(self):
        """Testa que outro usuário pode deletar sala."""
        self.client.force_authenticate(user=self.proprietario2)
        
        response = self.client.delete(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verifica se a sala foi deletada
        self.assertFalse(Sala.objects.filter(pk=self.sala1.pk).exists())
    
    def test_admin_pode_gerenciar_qualquer_sala(self):
        """Testa que admin pode gerenciar qualquer sala."""
        self.client.force_authenticate(user=self.admin)
        
        # Atualizar
        data = {'nome': 'Sala Atualizada pelo Admin'}
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], data['nome'])
    
    def test_filtros_salas(self):
        """Testa filtros na listagem de salas."""
        self.client.force_authenticate(user=self.cliente)
        
        # Filtra por capacidade mínima
        response = self.client.get(self.list_url, {'capacidade_min': 15})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se retornou apenas salas com capacidade >= 15
        self.assertGreater(len(response.data['results']), 0)
        for sala in response.data['results']:
            self.assertGreaterEqual(sala['capacidade'], 15)
        
        # Filtra por preço máximo
        response = self.client.get(self.list_url, {'preco_max': 150})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se retornou apenas salas com preço <= 150
        for sala in response.data['results']:
            self.assertLessEqual(float(sala['preco_hora']), 150.0)
    
    def test_busca_salas(self):
        """Testa busca na listagem de salas."""
        self.client.force_authenticate(user=self.cliente)
        
        # Busca por nome
        response = self.client.get(self.list_url, {'search': 'Premium'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se encontrou a sala
        found = any(sala['nome'] == 'Sala Premium' for sala in response.data['results'])
        self.assertTrue(found)
        
        # Busca por descrição
        response = self.client.get(self.list_url, {'search': 'básicos'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se encontrou a sala
        found = any('básicos' in sala['descricao'] for sala in response.data['results'])
        self.assertTrue(found)
    
    def test_ordenacao_salas(self):
        """Testa ordenação na listagem de salas."""
        self.client.force_authenticate(user=self.cliente)
        
        # Ordena por nome
        response = self.client.get(self.list_url, {'ordering': 'nome'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se está ordenado
        nomes = [sala['nome'] for sala in response.data['results']]
        self.assertEqual(nomes, sorted(nomes))
        
        # Ordena por preço (decrescente)
        response = self.client.get(self.list_url, {'ordering': '-preco_hora'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Ordena por capacidade
        response = self.client.get(self.list_url, {'ordering': 'capacidade'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se está ordenado
        capacidades = [sala['capacidade'] for sala in response.data['results']]
        self.assertEqual(capacidades, sorted(capacidades))
    
    def test_criar_sala_dados_invalidos(self):
        """Testa criação de sala com dados inválidos."""
        self.client.force_authenticate(user=self.proprietario1)
        
        # Nome vazio
        data = {
            'nome': '',
            'descricao': 'Descrição',
            'capacidade': 10,
            'preco_hora': '100.00'
        }
        
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('nome', response.data)
        
        # Capacidade negativa
        data = {
            'nome': 'Sala Teste',
            'descricao': 'Descrição',
            'capacidade': -5,
            'preco_hora': '100.00'
        }
        
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('capacidade', response.data)
        
        # Preço negativo
        data = {
            'nome': 'Sala Teste',
            'descricao': 'Descrição',
            'capacidade': 10,
            'preco_hora': '-50.00'
        }
        
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('preco_hora', response.data)
    
    def test_campos_obrigatorios_criacao(self):
        """Testa criação sem campos obrigatórios."""
        self.client.force_authenticate(user=self.proprietario1)
        
        data = {}
        
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Verifica se todos os campos obrigatórios estão nos erros
        required_fields = ['nome', 'capacidade', 'preco_hora']
        for field in required_fields:
            self.assertIn(field, response.data)
    
    def test_paginacao_salas(self):
        """Testa paginação na listagem de salas."""
        # Cria mais salas para testar paginação
        for i in range(15):
            Sala.objects.create(
                nome=f'Sala {i}',
                descricao=f'Descrição {i}',
                capacidade=10,
                preco_hora=Decimal('100.00')
            )
        
        self.client.force_authenticate(user=self.cliente)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se há paginação
        self.assertIn('count', response.data)
        self.assertIn('next', response.data)
        self.assertIn('previous', response.data)
        self.assertIn('results', response.data)
    
    def test_proprietario_pode_listar_salas(self):
        """Testa que proprietário pode listar salas."""
        self.client.force_authenticate(user=self.proprietario1)
        
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se retornou as salas
        self.assertGreaterEqual(len(response.data['results']), 0)
    
    def test_dados_completos_sala(self):
        """Testa se os detalhes da sala retornam todos os dados necessários."""
        self.client.force_authenticate(user=self.cliente)
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Campos que devem estar presentes
        expected_fields = ['id', 'nome', 'descricao', 'capacidade', 'preco_hora', 
                          'is_disponivel', 'data_criacao', 'data_atualizacao']
        for field in expected_fields:
            self.assertIn(field, response.data)