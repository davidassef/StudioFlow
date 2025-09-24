from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


def get_trial_end_default():
    """Retorna a data padrão para o fim do trial (15 dias a partir de agora)."""
    return timezone.now() + timedelta(days=15)


class Subscription(models.Model):
    """Modelo para representar as assinaturas do StudioFlow."""

    class StatusSubscription(models.TextChoices):
        TRIAL = 'TRIAL', _('Trial')
        ACTIVE = 'ACTIVE', _('Ativa')
        PAST_DUE = 'PAST_DUE', _('Vencida')
        CANCELED = 'CANCELED', _('Cancelada')
        UNPAID = 'UNPAID', _('Não Paga')

    class PlanSubscription(models.TextChoices):
        BASIC = 'studioflow_basic', _('StudioFlow Básico')
        PRO = 'studioflow_pro', _('StudioFlow Pro')

    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscription',
        verbose_name=_('usuário')
    )

    plan_id = models.CharField(
        _('plano'),
        max_length=20,
        choices=PlanSubscription.choices,
        default=PlanSubscription.BASIC
    )

    status = models.CharField(
        _('status'),
        max_length=10,
        choices=StatusSubscription.choices,
        default=StatusSubscription.TRIAL
    )

    # Períodos
    trial_start = models.DateTimeField(_('início do trial'), default=timezone.now)
    trial_end = models.DateTimeField(_('fim do trial'), default=get_trial_end_default)
    current_period_start = models.DateTimeField(_('início do período atual'), default=timezone.now)
    current_period_end = models.DateTimeField(_('fim do período atual'), null=True, blank=True)

    # Controle de cancelamento
    cancel_at_period_end = models.BooleanField(_('cancelar no fim do período'), default=False)
    canceled_at = models.DateTimeField(_('data de cancelamento'), null=True, blank=True)

    # Dados do Mercado Pago
    payment_method_id = models.CharField(_('ID do método de pagamento'), max_length=100, null=True, blank=True)
    mercadopago_customer_id = models.CharField(_('ID do cliente Mercado Pago'), max_length=100, null=True, blank=True)
    mercadopago_subscription_id = models.CharField(_('ID da assinatura Mercado Pago'), max_length=100, null=True, blank=True)

    # Pagamentos
    last_payment_date = models.DateTimeField(_('último pagamento'), null=True, blank=True)
    next_payment_date = models.DateTimeField(_('próximo pagamento'), null=True, blank=True)
    amount = models.DecimalField(_('valor'), max_digits=10, decimal_places=2, default=19.99)
    currency = models.CharField(_('moeda'), max_length=3, default='BRL')

    # Timestamps
    data_criacao = models.DateTimeField(_('data de criação'), auto_now_add=True)
    data_atualizacao = models.DateTimeField(_('data de atualização'), auto_now=True)

    class Meta:
        verbose_name = _('assinatura')
        verbose_name_plural = _('assinaturas')
        ordering = ['-data_criacao']

    def __str__(self):
        return f'{self.usuario.email} - {self.get_plan_id_display()} ({self.get_status_display()})'

    @property
    def is_trial_active(self):
        """Verifica se o período de trial ainda está ativo."""
        return self.status == self.StatusSubscription.TRIAL and timezone.now() < self.trial_end

    @property
    def is_active(self):
        """Verifica se a assinatura está ativa."""
        return self.status in [self.StatusSubscription.TRIAL, self.StatusSubscription.ACTIVE]

    @property
    def days_until_trial_end(self):
        """Retorna quantos dias faltam para o fim do trial."""
        if self.is_trial_active:
            return (self.trial_end - timezone.now()).days
        return 0

    def save(self, *args, **kwargs):
        """Salva a assinatura com lógica adicional."""
        # Se é uma nova assinatura, define o período atual
        if not self.current_period_end and self.status == self.StatusSubscription.ACTIVE:
            self.current_period_end = self.current_period_start + timedelta(days=30)

        # Se é trial, define o período de trial
        if self.status == self.StatusSubscription.TRIAL and not self.trial_end:
            self.trial_end = self.trial_start + timedelta(days=15)

        super().save(*args, **kwargs)

    def cancel(self):
        """Cancela a assinatura."""
        self.cancel_at_period_end = True
        self.canceled_at = timezone.now()
        self.save()

    def reactivate(self):
        """Reativa uma assinatura cancelada."""
        self.cancel_at_period_end = False
        self.canceled_at = None
        self.save()