from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer para o modelo de assinaturas."""

    usuario_detail = serializers.SerializerMethodField()
    is_trial_active = serializers.ReadOnlyField()
    is_active = serializers.ReadOnlyField()
    days_until_trial_end = serializers.ReadOnlyField()

    class Meta:
        model = Subscription
        fields = [
            'id', 'usuario', 'plan_id', 'status', 'trial_start', 'trial_end',
            'current_period_start', 'current_period_end', 'cancel_at_period_end',
            'canceled_at', 'payment_method_id', 'mercadopago_customer_id',
            'mercadopago_subscription_id', 'last_payment_date', 'next_payment_date',
            'amount', 'currency', 'data_criacao', 'data_atualizacao',
            'usuario_detail', 'is_trial_active', 'is_active', 'days_until_trial_end'
        ]
        read_only_fields = [
            'data_criacao', 'data_atualizacao', 'trial_start', 'current_period_start',
            'is_trial_active', 'is_active', 'days_until_trial_end'
        ]

    def get_usuario_detail(self, obj):
        """Retorna detalhes básicos do usuário."""
        return {
            'id': obj.usuario.id,
            'email': obj.usuario.email,
            'nome': obj.usuario.nome if hasattr(obj.usuario, 'nome') else obj.usuario.email
        }

    def validate(self, attrs):
        """Valida os dados da assinatura."""
        # Se está criando uma nova assinatura, verifica se o usuário já tem uma
        if not self.instance:
            usuario = attrs.get('usuario')
            if Subscription.objects.filter(usuario=usuario).exists():
                raise serializers.ValidationError("O usuário já possui uma assinatura ativa.")

        # Valida períodos
        if attrs.get('trial_end') and attrs.get('trial_start'):
            if attrs['trial_end'] <= attrs['trial_start']:
                raise serializers.ValidationError("O fim do trial deve ser posterior ao início.")

        if attrs.get('current_period_end') and attrs.get('current_period_start'):
            if attrs['current_period_end'] <= attrs['current_period_start']:
                raise serializers.ValidationError("O fim do período deve ser posterior ao início.")

        return attrs


class SubscriptionCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de assinaturas."""

    class Meta:
        model = Subscription
        fields = ['plan_id']

    def create(self, validated_data):
        """Cria uma nova assinatura com período de trial."""
        usuario = self.context['request'].user
        plan_id = validated_data['plan_id']

        # Define o valor baseado no plano
        amount = 19.99 if plan_id == 'studioflow_basic' else 39.99

        return Subscription.objects.create(
            usuario=usuario,
            plan_id=plan_id,
            amount=amount,
            status=Subscription.StatusSubscription.TRIAL
        )


class SubscriptionUpdateSerializer(serializers.ModelSerializer):
    """Serializer para atualização de assinaturas."""

    class Meta:
        model = Subscription
        fields = ['status', 'cancel_at_period_end']

    def update(self, instance, validated_data):
        """Atualiza a assinatura com validações."""
        status = validated_data.get('status')
        cancel_at_period_end = validated_data.get('cancel_at_period_end')

        if status:
            # Validações de mudança de status
            if status == Subscription.StatusSubscription.ACTIVE and instance.status == Subscription.StatusSubscription.TRIAL:
                # Ativando assinatura paga
                instance.current_period_end = timezone.now() + timedelta(days=30)
                instance.next_payment_date = instance.current_period_end
            elif status == Subscription.StatusSubscription.CANCELED:
                # Cancelando assinatura
                instance.canceled_at = timezone.now()

        if cancel_at_period_end is not None:
            instance.cancel_at_period_end = cancel_at_period_end
            if cancel_at_period_end:
                instance.canceled_at = timezone.now()
            else:
                instance.canceled_at = None

        return super().update(instance, validated_data)