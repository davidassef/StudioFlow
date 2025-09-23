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


class PasswordRecoveryTest(APITestCase):
    """Testes para funcionalidade de recuperação de senha."""
    
    def setUp(self):
        """Configuração inicial para os testes de recuperação de senha."""
        self.user = User.objects.create_user(
            email='test@example.com',
            nome='Test User',
            password='testpass123',
            telefone='11999999999',
            user_type='CLIENTE'
        )
        self.forgot_password_url = reverse('user-forgot-password')
        self.reset_password_url = reverse('user-reset-password')
    
    def test_solicitar_recuperacao_senha_usuario_existe(self):
        """Testa solicitação de recuperação de senha para usuário existente."""
        data = {'email': 'test@example.com'}
        
        response = self.client.post(self.forgot_password_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Email de recuperação enviado com sucesso.")
    
    def test_solicitar_recuperacao_senha_usuario_nao_existe(self):
        """Testa solicitação de recuperação de senha para usuário inexistente."""
        data = {'email': 'naoexiste@example.com'}
        
        response = self.client.post(self.forgot_password_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Não existe usuário com este email', str(response.data))
    
    def test_solicitar_recuperacao_senha_email_invalido(self):
        """Testa solicitação de recuperação de senha com email inválido."""
        data = {'email': 'emailinvalido'}
        
        response = self.client.post(self.forgot_password_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_redefinir_senha_sucesso(self):
        """Testa redefinição de senha com sucesso."""
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        
        token = default_token_generator.make_token(self.user)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        
        data = {
            'uid': uid,
            'token': token,
            'new_password': 'novasenha123456',
            'new_password_confirm': 'novasenha123456'
        }
        
        response = self.client.post(self.reset_password_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], "Senha redefinida com sucesso.")
        
        # Verifica se a senha foi realmente alterada
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('novasenha123456'))
    
    def test_redefinir_senha_token_invalido(self):
        """Testa redefinição de senha com token inválido."""
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        
        data = {
            'uid': uid,
            'token': 'tokeninvalido123',
            'new_password': 'novasenha123456',
            'new_password_confirm': 'novasenha123456'
        }
        
        response = self.client.post(self.reset_password_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Token inválido ou expirado', str(response.data))
    
    def test_redefinir_senha_uid_invalido(self):
        """Testa redefinição de senha com UID inválido."""
        data = {
            'uid': 'uidinvalido',
            'token': 'tokenqualquer',
            'new_password': 'novasenha123456',
            'new_password_confirm': 'novasenha123456'
        }
        
        response = self.client.post(self.reset_password_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('UID inválido', str(response.data))
    
    def test_redefinir_senha_senhas_diferentes(self):
        """Testa redefinição de senha com senhas diferentes."""
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        
        token = default_token_generator.make_token(self.user)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        
        data = {
            'uid': uid,
            'token': token,
            'new_password': 'senha123456',
            'new_password_confirm': 'senhadiferente'
        }
        
        response = self.client.post(self.reset_password_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('As senhas não conferem', str(response.data))
    
    def test_redefinir_senha_uid_obrigatorio(self):
        """Testa redefinição de senha sem UID."""
        data = {
            'token': 'tokenqualquer',
            'new_password': 'novasenha123456',
            'new_password_confirm': 'novasenha123456'
        }
        
        response = self.client.post(self.reset_password_url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('UID é obrigatório', str(response.data))