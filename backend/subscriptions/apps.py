from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class SubscriptionsConfig(AppConfig):
    """Configuração do app subscriptions."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'subscriptions'
    verbose_name = _('Assinaturas')

    def ready(self):
        """Importa os signals quando o app é carregado."""
        import subscriptions.signals