from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserModelTest(TestCase):
    """Testes para o modelo User customizado."""

    def setUp(self):
        """Configuração inicial para os testes."""
        self.user_data = {
            'email': 'teste@exemplo.com',
            'nome': 'Usuário Teste',
            'password': 'senha123'
        }

    def test_criar_usuario_com_email(self):
        """Testa a criação de um usuário com email."""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data['email'])
        self.assertEqual(user.nome, self.user_data['nome'])
        self.assertTrue(user.check_password(self.user_data['password']))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)
        self.assertEqual(user.user_type, 'CLIENTE')

    def test_criar_superusuario(self):
        """Testa a criação de um superusuário."""
        admin_data = {
            'email': 'admin@exemplo.com',
            'nome': 'Admin Teste',
            'password': 'senha123',
            'user_type': 'ADMIN'
        }
        admin = User.objects.create_superuser(**admin_data)
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_active)
        self.assertEqual(admin.user_type, 'ADMIN')

    def test_usuario_sem_email_deve_falhar(self):
        """Testa que criar usuário sem email deve falhar."""
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email='',
                nome='Teste',
                password='senha123'
            )

    def test_email_normalizado(self):
        """Testa se o email é normalizado corretamente."""
        email = 'TESTE@exemplo.com'
        user = User.objects.create_user(
            email=email,
            nome='Teste',
            password='senha123'
        )
        # O Django normaliza apenas o domínio, não o usuário
        self.assertEqual(user.email, email)

    def test_str_representation(self):
        """Testa a representação string do usuário."""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(str(user), self.user_data['email'])

    def test_tipos_usuario_validos(self):
        """Testa os tipos de usuário válidos."""
        # Cliente
        client = User.objects.create_user(
            email='client@exemplo.com',
            nome='Cliente',
            password='senha123',
            user_type='CLIENTE'
        )
        self.assertEqual(client.user_type, 'CLIENTE')

        # Admin
        admin = User.objects.create_user(
            email='admin@exemplo.com',
            nome='Admin',
            password='senha123',
            user_type='ADMIN'
        )
        self.assertEqual(admin.user_type, 'ADMIN')


class UserAPITest(APITestCase):
    """Testes básicos para modelos de usuário (sem APIs)."""

    def setUp(self):
        """Configuração inicial para os testes."""
        self.user = User.objects.create_user(
            email='existente@exemplo.com',
            nome='Usuário Existente',
            password='senha123'
        )

    def test_criar_usuario_objeto(self):
        """Testa criação de objeto User diretamente."""
        user_data = {
            'email': 'novo@exemplo.com',
            'nome': 'Novo Usuário',
            'password': 'senha123',
            'user_type': 'CLIENTE'
        }
        
        user = User.objects.create_user(**user_data)
        self.assertEqual(user.email, user_data['email'])
        self.assertEqual(user.nome, user_data['nome'])
        self.assertEqual(user.user_type, user_data['user_type'])
        
        # Verifica se o usuário foi criado no banco
        user_exists = User.objects.filter(email=user_data['email']).exists()
        self.assertTrue(user_exists)

    def test_autenticacao_usuario(self):
        """Testa autenticação de usuário."""
        # Testa senha correta
        self.assertTrue(self.user.check_password('senha123'))
        
        # Testa senha incorreta
        self.assertFalse(self.user.check_password('senha_errada'))

    def test_filtrar_usuarios_por_tipo(self):
        """Testa filtro de usuários por tipo."""
        # Criar usuário admin
        admin_user = User.objects.create_user(
            email='admin@exemplo.com',
            nome='Admin',
            password='senha123',
            user_type='ADMIN'
        )
        
        # Filtrar por tipo CLIENTE
        clientes = User.objects.filter(user_type='CLIENTE')
        self.assertGreaterEqual(len(clientes), 1)
        self.assertIn(self.user, clientes)
        
        # Filtrar por tipo ADMIN
        admins = User.objects.filter(user_type='ADMIN')
        self.assertEqual(len(admins), 1)
        self.assertEqual(admins[0], admin_user)

    def test_atualizar_dados_usuario(self):
        """Testa atualização de dados do usuário."""
        novo_nome = 'Nome Atualizado'
        novo_telefone = '11999999999'
        
        self.user.nome = novo_nome
        self.user.telefone = novo_telefone
        self.user.save()
        
        # Verifica se os dados foram atualizados
        self.user.refresh_from_db()
        self.assertEqual(self.user.nome, novo_nome)
        self.assertEqual(self.user.telefone, novo_telefone)
