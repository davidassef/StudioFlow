from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
import json
import hmac
import hashlib

from .models import Subscription


@method_decorator(csrf_exempt, name='dispatch')
class MercadoPagoWebhookView(APIView):
    """View para receber webhooks do Mercado Pago."""

    permission_classes = [AllowAny]

    def post(self, request):
        """Processa notificações do Mercado Pago."""
        try:
            # Verifica se é uma notificação válida do Mercado Pago
            if not self._verify_webhook_signature(request):
                return Response(
                    {'detail': 'Assinatura inválida'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            data = request.data
            topic = data.get('topic') or data.get('type')
            resource_id = data.get('resource')

            if topic == 'payment':
                return self._handle_payment_notification(data)
            elif topic == 'subscription':
                return self._handle_subscription_notification(data)
            else:
                # Outros tipos de notificação (por enquanto ignoramos)
                return Response({'detail': 'Notificação recebida'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Log do erro para debug
            print(f"Erro no webhook: {str(e)}")
            return Response(
                {'detail': 'Erro interno'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _verify_webhook_signature(self, request):
        """Verifica a assinatura do webhook (implementação básica)."""
        # Em produção, implementar verificação adequada da assinatura
        # Por enquanto, aceitamos todos os webhooks (não recomendado para produção)
        return True

    def _handle_payment_notification(self, data):
        """Processa notificações de pagamento."""
        try:
            payment_id = data.get('resource')
            if not payment_id:
                return Response({'detail': 'Payment ID não encontrado'}, status=status.HTTP_400_BAD_REQUEST)

            # Buscar detalhes do pagamento no Mercado Pago
            # Por enquanto, simulamos o processamento
            print(f"Pagamento recebido: {payment_id}")

            # Aqui seria implementada a lógica para:
            # 1. Buscar detalhes do pagamento via API do Mercado Pago
            # 2. Atualizar status da assinatura
            # 3. Enviar notificações para o usuário

            return Response({'detail': 'Pagamento processado'}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Erro ao processar pagamento: {str(e)}")
            return Response(
                {'detail': 'Erro ao processar pagamento'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _handle_subscription_notification(self, data):
        """Processa notificações de assinatura."""
        try:
            subscription_id = data.get('resource')
            if not subscription_id:
                return Response({'detail': 'Subscription ID não encontrado'}, status=status.HTTP_400_BAD_REQUEST)

            # Buscar detalhes da assinatura no Mercado Pago
            # Por enquanto, simulamos o processamento
            print(f"Assinatura atualizada: {subscription_id}")

            # Aqui seria implementada a lógica para:
            # 1. Buscar detalhes da assinatura via API do Mercado Pago
            # 2. Atualizar status da assinatura no banco
            # 3. Gerenciar renovações/cancelamentos

            return Response({'detail': 'Assinatura processada'}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Erro ao processar assinatura: {str(e)}")
            return Response(
                {'detail': 'Erro ao processar assinatura'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )