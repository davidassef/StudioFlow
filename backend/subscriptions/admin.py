from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Admin para o modelo Subscription."""

    list_display = [
        'usuario',
        'plan_id',
        'status',
        'trial_end',
        'current_period_end',
        'amount',
        'data_criacao'
    ]

    list_filter = [
        'status',
        'plan_id',
        'trial_end',
        'current_period_end',
        'data_criacao'
    ]

    search_fields = [
        'usuario__email',
        'usuario__nome',
        'mercadopago_customer_id',
        'mercadopago_subscription_id'
    ]

    readonly_fields = [
        'data_criacao',
        'data_atualizacao',
        'trial_start',
        'current_period_start'
    ]

    fieldsets = (
        (_('Informações Básicas'), {
            'fields': (
                'usuario',
                'plan_id',
                'status',
                'amount',
                'currency'
            )
        }),
        (_('Períodos'), {
            'fields': (
                'trial_start',
                'trial_end',
                'current_period_start',
                'current_period_end'
            )
        }),
        (_('Cancelamento'), {
            'fields': (
                'cancel_at_period_end',
                'canceled_at'
            )
        }),
        (_('Mercado Pago'), {
            'fields': (
                'payment_method_id',
                'mercadopago_customer_id',
                'mercadopago_subscription_id'
            ),
            'classes': ('collapse',)
        }),
        (_('Pagamentos'), {
            'fields': (
                'last_payment_date',
                'next_payment_date'
            ),
            'classes': ('collapse',)
        }),
        (_('Timestamps'), {
            'fields': (
                'data_criacao',
                'data_atualizacao'
            ),
            'classes': ('collapse',)
        })
    )

    def get_queryset(self, request):
        """Otimiza a query para incluir dados do usuário."""
        return super().get_queryset(request).select_related('usuario')