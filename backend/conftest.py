import pytest
import os
import django
from django.conf import settings
from django.contrib.auth import get_user_model
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone

# Configurar Django antes de importar os modelos
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'studioflow.settings')
django.setup()

from studios.models import Sala as Studio
from bookings.models import Agendamento as Booking

User = get_user_model()


@pytest.fixture
def admin_user():
    """Fixture para criar um usuário administrador."""
    return User.objects.create_user(
        email='admin@exemplo.com',
        nome='Administrador',
        password='senha123',
        user_type='ADMIN'
    )


@pytest.fixture
def client_user():
    """Fixture para criar um usuário cliente."""
    return User.objects.create_user(
        email='cliente@exemplo.com',
        nome='Cliente Teste',
        password='senha123',
        user_type='CLIENTE'
    )


@pytest.fixture
def another_client_user():
    """Fixture para criar outro usuário cliente."""
    return User.objects.create_user(
        email='outro@exemplo.com',
        nome='Outro Cliente',
        password='senha123',
        user_type='CLIENTE'
    )


@pytest.fixture
def studio_owner():
    """Fixture para criar um proprietário de estúdio."""
    return User.objects.create_user(
        email='proprietario@exemplo.com',
        nome='Proprietário do Estúdio',
        password='senha123',
        user_type='ADMIN'
    )


@pytest.fixture
def studio(studio_owner):
    """Fixture para criar um estúdio."""
    return Studio.objects.create(
        nome='Studio Fixture',
        capacidade=10,
        preco_hora=Decimal('150.00'),
        descricao='Estúdio criado via fixture para testes'
    )


@pytest.fixture
def another_studio(admin_user):
    """Fixture para criar outro estúdio."""
    return Studio.objects.create(
        nome='Segundo Studio',
        capacidade=15,
        preco_hora=Decimal('200.00'),
        descricao='Segundo estúdio para testes'
    )


@pytest.fixture
def future_datetime():
    """Fixture para uma data/hora futura."""
    return timezone.now() + timedelta(days=1)


@pytest.fixture
def booking(studio, client_user, future_datetime):
    """Fixture para criar um agendamento."""
    start_time = future_datetime
    end_time = start_time + timedelta(hours=2)
    
    return Booking.objects.create(
        sala=studio,
        cliente=client_user,
        horario_inicio=start_time,
        horario_fim=end_time,
        valor_total=Decimal('300.00')
    )


@pytest.fixture
def confirmed_booking(studio, another_client_user, future_datetime):
    """Fixture para criar um agendamento confirmado."""
    start_time = future_datetime + timedelta(hours=4)
    end_time = start_time + timedelta(hours=3)
    
    return Booking.objects.create(
        sala=studio,
        cliente=another_client_user,
        horario_inicio=start_time,
        horario_fim=end_time,
        valor_total=Decimal('450.00'),
        status='CONFIRMADO'
    )


@pytest.fixture
def cancelled_booking(studio, client_user, future_datetime):
    """Fixture para criar um agendamento cancelado."""
    start_time = future_datetime + timedelta(days=1)
    end_time = start_time + timedelta(hours=1)
    
    return Booking.objects.create(
        sala=studio,
        cliente=client_user,
        horario_inicio=start_time,
        horario_fim=end_time,
        valor_total=Decimal('150.00'),
        status='CANCELADO'
    )


@pytest.fixture
def multiple_studios(admin_user, studio_owner):
    """Fixture para criar múltiplos estúdios."""
    studios = []
    
    # Estúdio SP
    studios.append(Studio.objects.create(
        nome='Studio SP',
        capacidade=8,
        preco_hora=Decimal('120.00'),
        descricao='Estúdio em São Paulo'
    ))
    
    # Estúdio RJ
    studios.append(Studio.objects.create(
        nome='Studio RJ',
        capacidade=12,
        preco_hora=Decimal('180.00'),
        descricao='Estúdio no Rio de Janeiro'
    ))
    
    # Estúdio BH
    studios.append(Studio.objects.create(
        nome='Studio BH',
        capacidade=6,
        preco_hora=Decimal('100.00'),
        descricao='Estúdio em Belo Horizonte'
    ))
    
    return studios


@pytest.fixture
def multiple_bookings(multiple_studios, client_user, another_client_user, future_datetime):
    """Fixture para criar múltiplos agendamentos."""
    bookings = []
    
    # Agendamento no primeiro estúdio
    start_time1 = future_datetime
    end_time1 = start_time1 + timedelta(hours=2)
    bookings.append(Booking.objects.create(
        sala=multiple_studios[0],
        cliente=client_user,
        horario_inicio=start_time1,
        horario_fim=end_time1,
        valor_total=Decimal('240.00'),
        status='PENDENTE'
    ))
    
    # Agendamento no segundo estúdio
    start_time2 = future_datetime + timedelta(hours=3)
    end_time2 = start_time2 + timedelta(hours=1)
    bookings.append(Booking.objects.create(
        sala=multiple_studios[1],
        cliente=another_client_user,
        horario_inicio=start_time2,
        horario_fim=end_time2,
        valor_total=Decimal('180.00'),
        status='CONFIRMADO'
    ))
    
    # Agendamento no terceiro estúdio
    start_time3 = future_datetime + timedelta(days=1)
    end_time3 = start_time3 + timedelta(hours=4)
    bookings.append(Booking.objects.create(
        sala=multiple_studios[2],
        cliente=client_user,
        horario_inicio=start_time3,
        horario_fim=end_time3,
        valor_total=Decimal('400.00'),
        status='CONCLUIDO'
    ))
    
    return bookings


@pytest.fixture
def api_client():
    """Fixture para cliente de API do Django REST Framework."""
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, client_user):
    """Fixture para cliente autenticado."""
    from rest_framework_simplejwt.tokens import RefreshToken
    
    refresh = RefreshToken.for_user(client_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def authenticated_admin(api_client, admin_user):
    """Fixture para admin autenticado."""
    from rest_framework_simplejwt.tokens import RefreshToken
    
    refresh = RefreshToken.for_user(admin_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def authenticated_studio_owner(api_client, studio_owner):
    """Fixture para proprietário de estúdio autenticado."""
    from rest_framework_simplejwt.tokens import RefreshToken
    
    refresh = RefreshToken.for_user(studio_owner)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client