import django_filters
from .models import Sala


class SalaFilter(django_filters.FilterSet):
    """Filtros personalizados para o modelo Sala."""
    
    capacidade_min = django_filters.NumberFilter(field_name='capacidade', lookup_expr='gte')
    capacidade_max = django_filters.NumberFilter(field_name='capacidade', lookup_expr='lte')
    preco_min = django_filters.NumberFilter(field_name='preco_hora', lookup_expr='gte')
    preco_max = django_filters.NumberFilter(field_name='preco_hora', lookup_expr='lte')
    
    class Meta:
        model = Sala
        fields = {
            'is_disponivel': ['exact'],
            'capacidade': ['exact'],
            'preco_hora': ['exact'],
        }