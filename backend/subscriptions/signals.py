from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from users.models import User
from .models import Subscription


@receiver(post_save, sender=User)
def create_trial_subscription(sender, instance, created, **kwargs):
    """Cria uma assinatura de trial automaticamente quando um usuário é criado."""
    if created and instance.user_type in ['CLIENTE', 'PRESTADOR']:
        # Só cria assinatura para clientes e prestadores, não para admins
        Subscription.objects.create(
            usuario=instance,
            plan_id='studioflow_basic',  # Plano padrão para trial
            status=Subscription.StatusSubscription.TRIAL,
            amount=19.99  # Valor do plano básico
        )