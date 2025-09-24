from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubscriptionViewSet
from .webhooks import MercadoPagoWebhookView

router = DefaultRouter()
router.register('', SubscriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('webhooks/mercadopago/', MercadoPagoWebhookView.as_view(), name='mercadopago-webhook'),
]