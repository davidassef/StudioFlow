from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .models import Subscription
from .serializers import (
    SubscriptionSerializer,
    SubscriptionCreateSerializer,
    SubscriptionUpdateSerializer
)


class SubscriptionViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar assinaturas."""

    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Retorna as assinaturas do usuário atual ou todas para admin."""
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Subscription.objects.all()
        return Subscription.objects.filter(usuario=user)

    def get_serializer_class(self):
        """Retorna o serializer apropriado baseado na ação."""
        if self.action == 'create':
            return SubscriptionCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return SubscriptionUpdateSerializer
        return SubscriptionSerializer

    def perform_create(self, serializer):
        """Cria a assinatura para o usuário atual."""
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Retorna a assinatura atual do usuário."""
        subscription = self.get_queryset().first()
        if not subscription:
            return Response(
                {'detail': 'Usuário não possui assinatura ativa.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(subscription)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancela a assinatura."""
        subscription = self.get_object()

        # Verifica se o usuário pode cancelar esta assinatura
        if subscription.usuario != request.user and not request.user.is_staff:
            return Response(
                {'detail': 'Você não tem permissão para cancelar esta assinatura.'},
                status=status.HTTP_403_FORBIDDEN
            )

        subscription.cancel()
        serializer = self.get_serializer(subscription)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reactivate(self, request, pk=None):
        """Reativa uma assinatura cancelada."""
        subscription = self.get_object()

        # Verifica se o usuário pode reativar esta assinatura
        if subscription.usuario != request.user and not request.user.is_staff:
            return Response(
                {'detail': 'Você não tem permissão para reativar esta assinatura.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if subscription.status != Subscription.StatusSubscription.CANCELED:
            return Response(
                {'detail': 'Apenas assinaturas canceladas podem ser reativadas.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        subscription.reactivate()
        serializer = self.get_serializer(subscription)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def plans(self, request):
        """Retorna os planos disponíveis."""
        from ..lib.mercadopago import SUBSCRIPTION_PLANS

        plans_data = []
        for plan in SUBSCRIPTION_PLANS:
            plans_data.append({
                'id': plan.id,
                'name': plan.name,
                'price': plan.price,
                'currency': plan.currency,
                'interval': plan.interval,
                'description': plan.description,
                'features': plan.features
            })

        return Response(plans_data)

    @action(detail=False, methods=['post'])
    def create_payment_preference(self, request):
        """Cria uma preferência de pagamento no Mercado Pago."""
        try:
            from ..lib.mercadopago import createPaymentPreference

            plan_id = request.data.get('plan_id')
            if not plan_id:
                return Response(
                    {'detail': 'plan_id é obrigatório.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Verifica se o usuário já tem assinatura
            existing_subscription = Subscription.objects.filter(usuario=request.user).first()
            if existing_subscription:
                return Response(
                    {'detail': 'Usuário já possui uma assinatura ativa.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            preference = createPaymentPreference(
                plan_id,
                str(request.user.id),
                request.user.email
            )

            return Response({
                'preference_id': preference.id,
                'init_point': preference.init_point,
                'sandbox_init_point': preference.sandbox_init_point
            })

        except Exception as e:
            return Response(
                {'detail': f'Erro ao criar preferência de pagamento: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )