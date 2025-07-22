from django.contrib import admin
from .models import Sala


@admin.register(Sala)
class SalaAdmin(admin.ModelAdmin):
    """Admin para o modelo Sala."""
    
    list_display = ('nome', 'capacidade', 'preco_hora', 'is_disponivel')
    list_filter = ('is_disponivel', 'capacidade')
    search_fields = ('nome', 'descricao')
    list_editable = ('is_disponivel', 'preco_hora')
    readonly_fields = ('data_criacao', 'data_atualizacao')
    fieldsets = (
        (None, {
            'fields': ('nome', 'capacidade', 'preco_hora', 'descricao', 'is_disponivel')
        }),
        ('Informações de Registro', {
            'fields': ('data_criacao', 'data_atualizacao'),
            'classes': ('collapse',)
        }),
    )
