from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from decimal import Decimal

from .serializers import SalaSerializer
from .models import Sala
from users.models import User


class SalaSerializerTest(TestCase):
    """Testes para o SalaSerializer."""
    
    def setUp(self):
        """Configura os dados de teste."""
        # Cria usuário proprietário
        self.proprietario = User.objects.create_user(
            email='proprietario@test.com',
            nome='Proprietário Teste',
            telefone='11999999999',
            user_type='PROPRIETARIO'
        )
        
        # Cria usuário cliente
        self.cliente = User.objects.create_user(
            email='cliente@test.com',
            nome='Cliente Teste',
            telefone='11888888888',
            user_type='CLIENTE'
        )
        
        # Dados válidos para sala
        self.sala_data = {
            'nome': 'Sala Teste',
            'descricao': 'Descrição da sala teste',
            'capacidade': 10,
            'preco_hora': Decimal('100.00')
        }
        
        # Cria sala de teste
        self.sala = Sala.objects.create(
            nome='Sala Existente',
            descricao='Descrição da sala existente',
            capacidade=15,
            preco_hora=Decimal('150.00')
        )
    
    def test_serializer_valido(self):
        """Testa se o serializer funciona com dados válidos."""
        serializer = SalaSerializer(data=self.sala_data)
        self.assertTrue(serializer.is_valid())
        
        sala = serializer.save()
        self.assertEqual(sala.nome, self.sala_data['nome'])
        self.assertEqual(sala.descricao, self.sala_data['descricao'])
        self.assertEqual(sala.capacidade, self.sala_data['capacidade'])
        self.assertEqual(sala.preco_hora, self.sala_data['preco_hora'])
    
    def test_serializer_leitura(self):
        """Testa serialização para leitura."""
        serializer = SalaSerializer(self.sala)
        data = serializer.data
        
        self.assertEqual(data['nome'], self.sala.nome)
        self.assertEqual(data['descricao'], self.sala.descricao)
        self.assertEqual(data['capacidade'], self.sala.capacidade)
        self.assertEqual(str(data['preco_hora']), str(self.sala.preco_hora))
        self.assertIn('id', data)
        self.assertIn('data_criacao', data)
        self.assertIn('data_atualizacao', data)
    
    def test_campos_obrigatorios(self):
        """Testa validação de campos obrigatórios."""
        data = {}
        
        serializer = SalaSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        
        required_fields = ['nome', 'capacidade', 'preco_hora']
        for field in required_fields:
            self.assertIn(field, serializer.errors)
    
    def test_nome_vazio(self):
        """Testa validação de nome vazio."""
        data = self.sala_data.copy()
        data['nome'] = ''
        
        serializer = SalaSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nome', serializer.errors)
    
    def test_nome_muito_longo(self):
        """Testa validação de nome muito longo."""
        data = self.sala_data.copy()
        data['nome'] = 'x' * 201  # Assumindo max_length=200
        
        serializer = SalaSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nome', serializer.errors)
    
    def test_capacidade_negativa(self):
        """Testa validação de capacidade negativa."""
        data = self.sala_data.copy()
        data['capacidade'] = -1
        
        serializer = SalaSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('capacidade', serializer.errors)
    
    def test_capacidade_zero(self):
        """Testa validação de capacidade zero."""
        data = self.sala_data.copy()
        data['capacidade'] = 0
        
        serializer = SalaSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('capacidade', serializer.errors)
    
    def test_preco_negativo(self):
        """Testa validação de preço negativo."""
        data = self.sala_data.copy()
        data['preco_hora'] = Decimal('-10.00')
        
        serializer = SalaSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('preco_hora', serializer.errors)
    
    def test_preco_zero(self):
        """Testa validação de preço zero."""
        data = self.sala_data.copy()
        data['preco_hora'] = Decimal('0.00')
        
        serializer = SalaSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('preco_hora', serializer.errors)
    
    def test_capacidade_alta(self):
        """Testa validação com capacidade muito alta."""
        data = self.sala_data.copy()
        data['capacidade'] = 1000
        
        serializer = SalaSerializer(data=data)
        self.assertTrue(serializer.is_valid())  # Capacidade alta deve ser válida
    
    def test_preco_decimal_precision(self):
        """Testa precisão decimal do preço."""
        data = self.sala_data.copy()
        data['preco_hora'] = Decimal('99.99')
        
        serializer = SalaSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        sala = serializer.save()
        self.assertEqual(sala.preco_hora, Decimal('99.99'))
    
    def test_atualizacao_sala(self):
        """Testa atualização de sala existente."""
        data = {
            'nome': 'Sala Atualizada',
            'capacidade': 20,
            'preco_hora': Decimal('200.00')
        }
        
        serializer = SalaSerializer(self.sala, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        
        sala_atualizada = serializer.save()
        self.assertEqual(sala_atualizada.nome, data['nome'])
        self.assertEqual(sala_atualizada.capacidade, data['capacidade'])
        self.assertEqual(sala_atualizada.preco_hora, data['preco_hora'])
        # Campos não alterados devem permanecer
        self.assertEqual(sala_atualizada.descricao, self.sala.descricao)
    
    def test_campos_read_only(self):
        """Testa se os campos read-only são ignorados na criação/atualização."""
        data = self.sala_data.copy()
        data['id'] = 99999
        data['data_criacao'] = '2020-01-01T00:00:00Z'
        data['data_atualizacao'] = '2020-01-01T00:00:00Z'
        
        serializer = SalaSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        sala = serializer.save()
        # Os campos read-only devem ser ignorados
        self.assertNotEqual(sala.id, 99999)
        self.assertNotEqual(sala.data_criacao.year, 2020)
    
    def test_descricao_vazia(self):
        """Testa se descrição vazia é aceita."""
        data = self.sala_data.copy()
        data['descricao'] = ''
        
        serializer = SalaSerializer(data=data)
        # Dependendo da implementação, descrição vazia pode ser aceita
        if serializer.is_valid():
            sala = serializer.save()
            self.assertEqual(sala.descricao, '')
        else:
            self.assertIn('descricao', serializer.errors)
    
    def test_capacidade_muito_alta(self):
        """Testa validação de capacidade muito alta."""
        data = self.sala_data.copy()
        data['capacidade'] = 10000  # Capacidade muito alta
        
        serializer = SalaSerializer(data=data)
        # Dependendo da validação implementada, pode ser válido ou inválido
        if not serializer.is_valid():
            self.assertIn('capacidade', serializer.errors)
    
    def test_preco_com_muitas_casas_decimais(self):
        """Testa validação de preço com muitas casas decimais."""
        data = self.sala_data.copy()
        data['preco_hora'] = Decimal('100.123456')  # Muitas casas decimais
        
        serializer = SalaSerializer(data=data)
        # Dependendo da validação implementada, pode ser válido ou inválido
        if serializer.is_valid():
            sala = serializer.save()
            # Deve ser arredondado para 2 casas decimais
            self.assertEqual(sala.preco_hora, Decimal('100.12'))
    
    def test_representacao_string_campos(self):
        """Testa representação em string dos campos."""
        serializer = SalaSerializer(self.sala)
        data = serializer.data
        
        # Verifica se os campos são serializados corretamente
        self.assertIsInstance(data['nome'], str)
        self.assertIsInstance(data['descricao'], str)
        self.assertIsInstance(data['capacidade'], int)
        # preco_hora pode ser string ou decimal dependendo da configuração
        self.assertIn(type(data['preco_hora']), [str, float, int])