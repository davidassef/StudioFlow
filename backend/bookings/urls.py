from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AgendamentoViewSet

router = DefaultRouter()
router.register('', AgendamentoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]