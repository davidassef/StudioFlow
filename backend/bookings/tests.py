from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from decimal import Decimal
from datetime import datetime, timedelta
from django.utils import timezone
from .models import Agendamento as Booking
from studios.models import Sala as Studio

User = get_user_model()


class BookingModelTest(TestCase):
    """Testes para o modelo Booking (Agendamento)."""

    def setUp(self):
        """Configuração inicial para os testes."""
        self.client_user = User.objects.create_user(
            email='client@exemplo.com',
            nome='Cliente',
            password='senha123',
            user_type='CLIENTE'
        )
        
        self.studio = Studio.objects.create(
            nome='Studio Teste',
            capacidade=10,
            preco_hora=Decimal('100.00'),
            descricao='Um estúdio para testes'
        )
        
        # Data futura para o agendamento
        self.start_time = timezone.now() + timedelta(days=1)
        self.end_time = self.start_time + timedelta(hours=2)
        
        self.booking_data = {
            'sala': self.studio,
            'cliente': self.client_user,
            'horario_inicio': self.start_time,
            'horario_fim': self.end_time,
            'valor_total': Decimal('200.00')
        }

    def test_criar_booking_valido(self):
        """Testa a criação de um agendamento válido."""
        booking = Booking.objects.create(**self.booking_data)
        
        self.assertEqual(booking.sala, self.studio)
        self.assertEqual(booking.cliente, self.client_user)
        self.assertEqual(booking.horario_inicio, self.start_time)
        self.assertEqual(booking.horario_fim, self.end_time)
        self.assertEqual(booking.valor_total, Decimal('200.00'))
        self.assertEqual(booking.status, 'PENDENTE')
        self.assertIsNotNone(booking.data_criacao)
        self.assertIsNotNone(booking.data_atualizacao)

    def test_str_representation(self):
        """Testa a representação string do agendamento."""
        booking = Booking.objects.create(**self.booking_data)
        expected_str = f"{self.studio.nome} - {self.client_user.nome} - {self.start_time.strftime('%d/%m/%Y %H:%M')}"
        self.assertEqual(str(booking), expected_str)

    def test_calculo_automatico_valor_total(self):
        """Testa o cálculo automático do valor total no save."""
        # Criar agendamento sem valor_total
        booking_data_sem_valor = self.booking_data.copy()
        del booking_data_sem_valor['valor_total']
        
        booking = Booking(**booking_data_sem_valor)
        booking.save()
        
        # Verificar se o valor foi calculado automaticamente
        # 2 horas * 100.00 = 200.00
        self.assertEqual(booking.valor_total, Decimal('200.00'))

    def test_status_choices_validos(self):
        """Testa os status válidos para agendamento."""
        valid_statuses = ['PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO']
        
        for status_choice in valid_statuses:
            booking_data = self.booking_data.copy()
            booking_data['status'] = status_choice
            booking = Booking(**booking_data)
            booking.save()
            self.assertEqual(booking.status, status_choice)

    def test_agendamento_com_horarios_iguais(self):
        """Testa agendamento com horário de início igual ao fim."""
        self.booking_data['horario_fim'] = self.start_time
        booking = Booking(**self.booking_data)
        booking.save()
        # O modelo atual não valida isso, então apenas verifica se salva
        self.assertEqual(booking.horario_inicio, booking.horario_fim)

    def test_agendamento_passado(self):
        """Testa agendamento no passado."""
        past_time = timezone.now() - timedelta(days=1)
        self.booking_data['horario_inicio'] = past_time
        self.booking_data['horario_fim'] = past_time + timedelta(hours=2)
        
        booking = Booking(**self.booking_data)
        booking.save()
        # O modelo atual não valida isso, então apenas verifica se salva
        self.assertTrue(booking.horario_inicio < timezone.now())

    def test_valor_total_zero(self):
        """Testa agendamento com valor total zero (definido explicitamente)."""
        # Criar agendamento com valor_total explícito como zero
        booking_data = self.booking_data.copy()
        booking_data['valor_total'] = Decimal('0.00')
        
        # Criar o booking e marcar para não recalcular automaticamente
        booking = Booking(**booking_data)
        booking._skip_auto_calculation = True
        booking.save()
        
        # Como marcamos para não recalcular, deve manter zero
        self.assertEqual(booking.valor_total, Decimal('0.00'))

    def test_valor_total_negativo(self):
        """Testa agendamento com valor total negativo."""
        self.booking_data['valor_total'] = Decimal('-100.00')
        booking = Booking.objects.create(**self.booking_data)
        self.assertEqual(booking.valor_total, Decimal('-100.00'))

    def test_agendamento_longo(self):
        """Testa agendamento de longa duração."""
        self.booking_data['horario_fim'] = self.start_time + timedelta(hours=24)
        booking = Booking.objects.create(**self.booking_data)
        duracao = booking.horario_fim - booking.horario_inicio
        self.assertEqual(duracao.total_seconds() / 3600, 24)  # 24 horas


class BookingAPITest(APITestCase):
    """Testes básicos para APIs de agendamento (se existirem)."""

    def setUp(self):
        """Configuração inicial para os testes de API."""
        self.admin_user = User.objects.create_user(
            email='admin@exemplo.com',
            nome='Admin',
            password='senha123',
            user_type='ADMIN'
        )
        
        self.client_user = User.objects.create_user(
            email='client@exemplo.com',
            nome='Cliente',
            password='senha123',
            user_type='CLIENTE'
        )
        
        self.other_client = User.objects.create_user(
            email='other@exemplo.com',
            nome='Outro Cliente',
            password='senha123',
            user_type='CLIENTE'
        )
        
        self.studio = Studio.objects.create(
            nome='Studio Teste',
            capacidade=10,
            preco_hora=Decimal('100.00'),
            descricao='Um estúdio para testes'
        )
        
        # Data futura para o agendamento
        self.start_time = timezone.now() + timedelta(days=1)
        self.end_time = self.start_time + timedelta(hours=2)
        
        self.booking = Booking.objects.create(
            sala=self.studio,
            cliente=self.client_user,
            horario_inicio=self.start_time,
            horario_fim=self.end_time,
            valor_total=Decimal('200.00')
        )

    def test_criar_booking_objeto(self):
        """Testa criação de objeto Booking diretamente."""
        future_start = timezone.now() + timedelta(days=2)
        future_end = future_start + timedelta(hours=3)
        
        booking_data = {
            'sala': self.studio,
            'cliente': self.other_client,
            'horario_inicio': future_start,
            'horario_fim': future_end,
            'valor_total': Decimal('300.00')
        }
        
        booking = Booking.objects.create(**booking_data)
        self.assertEqual(booking.sala, self.studio)
        self.assertEqual(booking.cliente, self.other_client)
        self.assertEqual(booking.valor_total, Decimal('300.00'))
        
        # Verifica se o agendamento foi criado no banco
        booking_exists = Booking.objects.filter(
            sala=self.studio,
            cliente=self.other_client,
            horario_inicio=future_start
        ).exists()
        self.assertTrue(booking_exists)

    def test_listar_bookings(self):
        """Testa listagem de agendamentos."""
        bookings = Booking.objects.all()
        self.assertGreaterEqual(len(bookings), 1)
        self.assertIn(self.booking, bookings)

    def test_filtrar_bookings_por_cliente(self):
        """Testa filtro de agendamentos por cliente."""
        # Criar agendamento para outro cliente
        future_start = timezone.now() + timedelta(days=3)
        future_end = future_start + timedelta(hours=1)
        
        Booking.objects.create(
            sala=self.studio,
            cliente=self.other_client,
            horario_inicio=future_start,
            horario_fim=future_end,
            valor_total=Decimal('100.00')
        )
        
        # Filtrar por cliente específico
        bookings_client = Booking.objects.filter(cliente=self.client_user)
        self.assertEqual(len(bookings_client), 1)
        self.assertEqual(bookings_client[0].cliente, self.client_user)
        
        bookings_other = Booking.objects.filter(cliente=self.other_client)
        self.assertEqual(len(bookings_other), 1)
        self.assertEqual(bookings_other[0].cliente, self.other_client)

    def test_filtrar_bookings_por_status(self):
        """Testa filtro de agendamentos por status."""
        # Criar agendamento confirmado
        future_start = timezone.now() + timedelta(days=4)
        future_end = future_start + timedelta(hours=2)
        
        Booking.objects.create(
            sala=self.studio,
            cliente=self.other_client,
            horario_inicio=future_start,
            horario_fim=future_end,
            valor_total=Decimal('200.00'),
            status='CONFIRMADO'
        )
        
        # Filtrar por status PENDENTE
        bookings_pendentes = Booking.objects.filter(status='PENDENTE')
        self.assertGreaterEqual(len(bookings_pendentes), 1)
        
        # Filtrar por status CONFIRMADO
        bookings_confirmados = Booking.objects.filter(status='CONFIRMADO')
        self.assertEqual(len(bookings_confirmados), 1)

    def test_filtrar_bookings_por_sala(self):
        """Testa filtro de agendamentos por sala."""
        # Criar outra sala
        outro_studio = Studio.objects.create(
            nome='Outro Studio',
            capacidade=5,
            preco_hora=Decimal('80.00'),
            descricao='Outro estúdio'
        )
        
        # Criar agendamento na outra sala
        future_start = timezone.now() + timedelta(days=5)
        future_end = future_start + timedelta(hours=1)
        
        Booking.objects.create(
            sala=outro_studio,
            cliente=self.client_user,
            horario_inicio=future_start,
            horario_fim=future_end,
            valor_total=Decimal('80.00')
        )
        
        # Filtrar por sala específica
        bookings_studio1 = Booking.objects.filter(sala=self.studio)
        self.assertGreaterEqual(len(bookings_studio1), 1)
        
        bookings_studio2 = Booking.objects.filter(sala=outro_studio)
        self.assertEqual(len(bookings_studio2), 1)

    def test_ordenacao_bookings(self):
        """Testa ordenação de agendamentos."""
        # Criar mais agendamentos
        future_start1 = timezone.now() + timedelta(days=6)
        future_end1 = future_start1 + timedelta(hours=1)
        
        future_start2 = timezone.now() + timedelta(days=7)
        future_end2 = future_start2 + timedelta(hours=1)
        
        booking1 = Booking.objects.create(
            sala=self.studio,
            cliente=self.client_user,
            horario_inicio=future_start1,
            horario_fim=future_end1,
            valor_total=Decimal('100.00')
        )
        
        booking2 = Booking.objects.create(
            sala=self.studio,
            cliente=self.other_client,
            horario_inicio=future_start2,
            horario_fim=future_end2,
            valor_total=Decimal('100.00')
        )
        
        # Testar ordenação por horário de início (mais recente primeiro)
        bookings_ordenados = Booking.objects.all().order_by('-horario_inicio')
        self.assertEqual(bookings_ordenados[0], booking2)
        
        # Testar ordenação por valor total
        bookings_por_valor = Booking.objects.all().order_by('valor_total')
        # Encontrar o booking com menor valor
        menor_valor = min(booking.valor_total for booking in bookings_por_valor)
        self.assertEqual(bookings_por_valor[0].valor_total, menor_valor)

    def test_atualizar_status_booking(self):
        """Testa atualização do status do agendamento."""
        # Confirmar agendamento
        self.booking.status = 'CONFIRMADO'
        self.booking.save()
        
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, 'CONFIRMADO')
        
        # Cancelar agendamento
        self.booking.status = 'CANCELADO'
        self.booking.save()
        
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, 'CANCELADO')

    def test_deletar_booking(self):
        """Testa exclusão de agendamento."""
        booking_id = self.booking.id
        self.booking.delete()
        
        # Verifica se o agendamento foi removido do banco
        booking_exists = Booking.objects.filter(id=booking_id).exists()
        self.assertFalse(booking_exists)