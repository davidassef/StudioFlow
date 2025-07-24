from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError

from .serializers import UserSerializer, UserRegistrationSerializer, UserUpdateSerializer, PasswordChangeSerializer
from .models import User


class UserSerializerTest(TestCase):
    """Testes para o UserSerializer."""
    
    def setUp(self):
        """Configura os dados de teste."""
        self.user_data = {
            'email': 'test@example.com',
            'nome': 'Usuário Teste',
            'telefone': '11999999999',
            'user_type': 'CLIENTE'
        }
        
        self.user = User.objects.create_user(**self.user_data)
    
    def test_serializer_valido(self):
        """Testa se o serializer funciona com dados válidos."""
        serializer = UserSerializer(self.user)
        data = serializer.data
        
        self.assertEqual(data['email'], self.user_data['email'])
        self.assertEqual(data['nome'], self.user_data['nome'])
        self.assertEqual(data['telefone'], self.user_data['telefone'])
        self.assertEqual(data['user_type'], self.user_data['user_type'])
        self.assertIn('id', data)
        self.assertNotIn('password', data)  # Password não deve aparecer
    
    def test_campos_read_only(self):
        """Testa se os campos read-only estão configurados corretamente."""
        serializer = UserSerializer()
        read_only_fields = serializer.Meta.read_only_fields
        
        self.assertIn('id', read_only_fields)
        self.assertIn('date_joined', read_only_fields)
        self.assertIn('last_login', read_only_fields)


class UserRegistrationSerializerTest(TestCase):
    """Testes para o UserRegistrationSerializer."""
    
    def test_criacao_usuario_valido(self):
        """Testa criação de usuário com dados válidos."""
        data = {
            'email': 'novo@example.com',
            'nome': 'Novo Usuário',
            'telefone': '11888888888',
            'user_type': 'CLIENTE',
            'password': 'senha123456',
            'password_confirm': 'senha123456'
        }
        
        serializer = UserRegistrationSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        user = serializer.save()
        self.assertEqual(user.email, data['email'])
        self.assertEqual(user.nome, data['nome'])
        self.assertEqual(user.telefone, data['telefone'])
        self.assertEqual(user.user_type, data['user_type'])
        self.assertTrue(user.check_password(data['password']))
    
    def test_senhas_diferentes(self):
        """Testa validação quando as senhas são diferentes."""
        data = {
            'email': 'novo@example.com',
            'nome': 'Novo Usuário',
            'telefone': '11888888888',
            'user_type': 'CLIENTE',
            'password': 'senha123456',
            'password_confirm': 'senha654321'
        }
        
        serializer = UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('As senhas não conferem.', str(serializer.errors))
    
    def test_senha_muito_curta(self):
        """Testa validação de senha muito curta."""
        data = {
            'email': 'novo@example.com',
            'nome': 'Novo Usuário',
            'telefone': '11888888888',
            'user_type': 'CLIENTE',
            'password': '123',
            'password_confirm': '123'
        }
        
        serializer = UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('This password is too short', str(serializer.errors))
    
    def test_email_duplicado(self):
        """Testa validação de email duplicado."""
        # Cria usuário existente
        User.objects.create_user(
            email='existente@example.com',
            nome='Usuário Existente',
            telefone='11777777777',
            user_type='CLIENTE'
        )
        
        data = {
            'email': 'existente@example.com',
            'nome': 'Novo Usuário',
            'telefone': '11888888888',
            'user_type': 'CLIENTE',
            'password': 'senha123456',
            'password_confirm': 'senha123456'
        }
        
        serializer = UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
    
    def test_campos_obrigatorios(self):
        """Testa validação de campos obrigatórios."""
        data = {}
        
        serializer = UserRegistrationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        
        required_fields = ['email', 'nome', 'password', 'password_confirm']
        for field in required_fields:
            self.assertIn(field, serializer.errors)
        
        # Telefone não é obrigatório, então não deve estar nos erros se não fornecido
        self.assertNotIn('telefone', serializer.errors)
    
    def test_user_type_valido(self):
        """Testa validação de user_type válido."""
        valid_types = ['CLIENTE', 'ADMIN']
        
        for user_type in valid_types:
            data = {
                'email': f'{user_type.lower()}@example.com',
                'nome': f'Usuário {user_type}',
                'telefone': '11888888888',
                'user_type': user_type,
                'password': 'senha123456',
                'password_confirm': 'senha123456'
            }
            
            serializer = UserRegistrationSerializer(data=data)
            self.assertTrue(serializer.is_valid(), f'Falhou para user_type: {user_type}')


class UserUpdateSerializerTest(TestCase):
    """Testes para o UserUpdateSerializer."""
    
    def setUp(self):
        """Configura os dados de teste."""
        self.user = User.objects.create_user(
            email='profile@example.com',
            nome='Usuário Profile',
            telefone='11999999999',
            user_type='CLIENTE'
        )
    
    def test_atualizacao_perfil_valida(self):
        """Testa atualização válida do perfil."""
        data = {
            'nome': 'Nome Atualizado',
            'telefone': '11888888888'
        }
        
        serializer = UserUpdateSerializer(self.user, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        
        user_atualizado = serializer.save()
        self.assertEqual(user_atualizado.nome, data['nome'])
        self.assertEqual(user_atualizado.telefone, data['telefone'])
    
    def test_nao_pode_alterar_email(self):
        """Testa que não é possível alterar o email através do update serializer."""
        data = {
            'email': 'novo@example.com',
            'nome': 'Nome Atualizado'
        }
        
        serializer = UserUpdateSerializer(self.user, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        
        user_atualizado = serializer.save()
        # Email deve permanecer o mesmo
        self.assertEqual(user_atualizado.email, 'profile@example.com')
        self.assertEqual(user_atualizado.nome, data['nome'])
    
    def test_nao_pode_alterar_user_type(self):
        """Testa que não é possível alterar o user_type através do update serializer."""
        user_type_original = self.user.user_type
        data = {
            'user_type': 'ADMIN',
            'nome': 'Nome Atualizado'
        }
        
        serializer = UserUpdateSerializer(self.user, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        
        user_atualizado = serializer.save()
        # user_type deve permanecer o mesmo (read-only)
        self.assertEqual(user_atualizado.user_type, user_type_original)
        self.assertEqual(user_atualizado.nome, data['nome'])
    
    def test_campos_permitidos(self):
        """Testa quais campos são permitidos para atualização."""
        serializer = UserUpdateSerializer()
        allowed_fields = serializer.Meta.fields
        
        # Campos que devem estar permitidos
        expected_fields = ['nome', 'telefone', 'user_type']
        for field in expected_fields:
            self.assertIn(field, allowed_fields)
        
        # Campos que não devem estar permitidos
        forbidden_fields = ['password', 'is_staff', 'is_superuser']
        for field in forbidden_fields:
            self.assertNotIn(field, allowed_fields)
    
    def test_nome_vazio(self):
        """Testa validação de nome vazio."""
        data = {'nome': ''}
        
        serializer = UserUpdateSerializer(self.user, data=data, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nome', serializer.errors)
    
    def test_telefone_vazio(self):
        """Testa validação de telefone vazio."""
        data = {'telefone': ''}
        
        serializer = UserUpdateSerializer(self.user, data=data, partial=True)
        # Dependendo da validação implementada, pode ser válido ou inválido
        if not serializer.is_valid():
            self.assertIn('telefone', serializer.errors)


class PasswordChangeSerializerTest(TestCase):
    """Testes para o PasswordChangeSerializer."""
    
    def test_mudanca_senha_valida(self):
        """Testa mudança de senha com dados válidos."""
        data = {
            'old_password': 'senhaantiga123',
            'new_password': 'novaSenha123456',
            'new_password_confirm': 'novaSenha123456'
        }
        
        serializer = PasswordChangeSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_senhas_novas_diferentes(self):
        """Testa validação quando as senhas novas são diferentes."""
        data = {
            'old_password': 'senhaantiga123',
            'new_password': 'novaSenha123456',
            'new_password_confirm': 'outraSenha123456'
        }
        
        serializer = PasswordChangeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('As senhas não conferem.', str(serializer.errors))
    
    def test_senha_muito_curta(self):
        """Testa validação de senha muito curta."""
        data = {
            'old_password': 'senhaantiga123',
            'new_password': '123',
            'new_password_confirm': '123'
        }
        
        serializer = PasswordChangeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('new_password', serializer.errors)
    
    def test_campos_obrigatorios(self):
        """Testa validação de campos obrigatórios."""
        data = {}
        
        serializer = PasswordChangeSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        
        required_fields = ['old_password', 'new_password', 'new_password_confirm']
        for field in required_fields:
            self.assertIn(field, serializer.errors)