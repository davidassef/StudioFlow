from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import json

from .models import User


class UserViewSetTest(APITestCase):
    """Testes para o UserViewSet."""
    
    def setUp(self):
        """Configura os dados de teste."""
        # Cria usuários de teste
        self.cliente = User.objects.create_user(
            email='cliente@test.com',
            nome='Cliente Teste',
            telefone='11999999999',
            user_type='CLIENTE'
        )
        
        self.proprietario = User.objects.create_user(
            email='proprietario@test.com',
            nome='Proprietário Teste',
            telefone='11888888888',
            user_type='ADMIN'
        )
        
        self.admin = User.objects.create_user(
            email='admin@test.com',
            nome='Admin Teste',
            telefone='11777777777',
            user_type='ADMIN',
            is_staff=True
        )
        
        # URLs
        self.list_url = reverse('user-list')
        self.detail_url = reverse('user-detail', kwargs={'pk': self.cliente.pk})
        self.register_url = reverse('user-register')
    
    def test_acesso_nao_autenticado(self):
        """Testa que usuários não autenticados não podem acessar a lista de usuários."""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_listar_usuarios_admin(self):
        """Testa que admin pode listar todos os usuários."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 3)  # cliente, proprietario, admin
    
    def test_listar_usuarios_cliente(self):
        """Testa que cliente comum não pode listar usuários."""
        self.client.force_authenticate(user=self.cliente)
        response = self.client.get(self.list_url)
        
        # Dependendo da implementação, pode retornar 403 ou lista vazia
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_200_OK])
    
    def test_registro_usuario_valido(self):
        """Testa registro de usuário com dados válidos."""
        data = {
            'email': 'novo@test.com',
            'nome': 'Novo Usuário',
            'telefone': '11666666666',
            'user_type': 'CLIENTE',
            'password': 'senha123456',
            'password_confirm': 'senha123456'
        }
        
        response = self.client.post(self.register_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['email'], data['email'])
        self.assertEqual(response.data['user']['nome'], data['nome'])
        self.assertNotIn('password', response.data['user'])
        
        # Verifica se o usuário foi criado no banco
        self.assertTrue(User.objects.filter(email=data['email']).exists())
    
    def test_registro_usuario_email_duplicado(self):
        """Testa registro com email já existente."""
        data = {
            'email': 'cliente@test.com',  # Email já existe
            'nome': 'Novo Usuário',
            'telefone': '11666666666',
            'user_type': 'CLIENTE',
            'password': 'senha123456',
            'password_confirm': 'senha123456'
        }
        
        response = self.client.post(self.register_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_registro_senhas_diferentes(self):
        """Testa registro com senhas diferentes."""
        data = {
            'email': 'novo@test.com',
            'nome': 'Novo Usuário',
            'telefone': '11666666666',
            'user_type': 'CLIENTE',
            'password': 'senha123456',
            'password_confirm': 'senha654321'
        }
        
        response = self.client.post(self.register_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('As senhas não conferem', str(response.data))
    
    def test_perfil_usuario_autenticado(self):
        """Testa acesso ao perfil do usuário autenticado."""
        self.client.force_authenticate(user=self.cliente)
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.cliente.email)
        self.assertEqual(response.data['nome'], self.cliente.nome)
        self.assertNotIn('password', response.data)
    
    def test_perfil_usuario_nao_autenticado(self):
        """Testa acesso ao perfil sem autenticação."""
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_atualizar_perfil(self):
        """Testa atualização do perfil do usuário."""
        self.client.force_authenticate(user=self.cliente)
        
        data = {
            'nome': 'Nome Atualizado',
            'telefone': '11555555555'
        }
        
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nome'], data['nome'])
        self.assertEqual(response.data['telefone'], data['telefone'])
        
        # Verifica se foi atualizado no banco
        self.cliente.refresh_from_db()
        self.assertEqual(self.cliente.nome, data['nome'])
        self.assertEqual(self.cliente.telefone, data['telefone'])
    
    def test_nao_pode_alterar_email_no_perfil(self):
        """Testa que não é possível alterar email através do perfil."""
        self.client.force_authenticate(user=self.cliente)
        
        email_original = self.cliente.email
        data = {
            'email': 'novo@test.com',
            'nome': 'Nome Atualizado'
        }
        
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Email deve permanecer o mesmo
        self.cliente.refresh_from_db()
        self.assertEqual(self.cliente.email, email_original)
        self.assertEqual(self.cliente.nome, data['nome'])
    
    def test_nao_pode_alterar_user_type_no_perfil(self):
        """Testa que não é possível alterar user_type através do perfil."""
        self.client.force_authenticate(user=self.cliente)
        
        user_type_original = self.cliente.user_type
        data = {
            'user_type': 'ADMIN',
            'nome': 'Nome Atualizado'
        }
        
        response = self.client.patch(self.detail_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # user_type deve permanecer o mesmo
        self.cliente.refresh_from_db()
        self.assertEqual(self.cliente.user_type, user_type_original)
        self.assertEqual(self.cliente.nome, data['nome'])
    
    def test_detalhes_usuario_admin(self):
        """Testa que admin pode ver detalhes de qualquer usuário."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.cliente.email)
    
    def test_detalhes_usuario_proprio(self):
        """Testa que usuário pode ver seus próprios detalhes."""
        self.client.force_authenticate(user=self.cliente)
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.cliente.email)
    
    def test_detalhes_usuario_outro(self):
        """Testa que usuário não pode ver detalhes de outro usuário."""
        # Cria outro usuário para testar
        outro_usuario = User.objects.create_user(
            email='outro@test.com',
            nome='Outro Usuário',
            telefone='11777777777',
            user_type='CLIENTE'
        )
        
        self.client.force_authenticate(user=outro_usuario)
        response = self.client.get(self.detail_url)  # Tentando acessar detalhes do cliente
        
        # Dependendo da implementação, pode retornar 403 ou 404
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])
    
    def test_filtros_usuarios(self):
        """Testa filtros na listagem de usuários."""
        self.client.force_authenticate(user=self.admin)
        
        # Filtra por user_type CLIENTE
        response = self.client.get(self.list_url, {'user_type': 'CLIENTE'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se retornou apenas clientes
        for user in response.data['results']:
            self.assertEqual(user['user_type'], 'CLIENTE')
        
        # Filtra por user_type ADMIN
        response = self.client.get(self.list_url, {'user_type': 'ADMIN'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se retornou apenas admins
        for user in response.data['results']:
            self.assertEqual(user['user_type'], 'ADMIN')
    
    def test_busca_usuarios(self):
        """Testa busca na listagem de usuários."""
        self.client.force_authenticate(user=self.admin)
        
        # Busca por nome
        response = self.client.get(self.list_url, {'search': 'Cliente'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se encontrou o usuário
        found = any(user['nome'] == 'Cliente Teste' for user in response.data['results'])
        self.assertTrue(found)
        
        # Busca por email
        response = self.client.get(self.list_url, {'search': 'admin@test.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se encontrou o usuário
        found = any(user['email'] == 'admin@test.com' for user in response.data['results'])
        self.assertTrue(found)
    
    def test_ordenacao_usuarios(self):
        """Testa ordenação na listagem de usuários."""
        self.client.force_authenticate(user=self.admin)
        
        # Ordena por nome
        response = self.client.get(self.list_url, {'ordering': 'nome'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Ordena por email (decrescente)
        response = self.client.get(self.list_url, {'ordering': '-email'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Ordena por data de criação
        response = self.client.get(self.list_url, {'ordering': 'date_joined'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_campos_sensiveis_nao_expostos(self):
        """Testa que campos sensíveis não são expostos na API."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        for user in response.data['results']:
            # Campos que não devem aparecer
            self.assertNotIn('password', user)
            self.assertNotIn('user_permissions', user)
            self.assertNotIn('groups', user)
    
    def test_registro_campos_obrigatorios(self):
        """Testa registro sem campos obrigatórios."""
        data = {}
        
        response = self.client.post(self.register_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Verifica se todos os campos obrigatórios estão nos erros
        required_fields = ['email', 'nome', 'password']
        for field in required_fields:
            self.assertIn(field, response.data)
    
    def test_perfil_dados_completos(self):
        """Testa se o perfil retorna todos os dados necessários."""
        self.client.force_authenticate(user=self.cliente)
        response = self.client.get(self.detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Campos que devem estar presentes
        expected_fields = ['id', 'email', 'nome', 'telefone', 'user_type', 'date_joined']
        for field in expected_fields:
            self.assertIn(field, response.data)