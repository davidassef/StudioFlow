from django.contrib import admin
from .models import Agendamento


@admin.register(Agendamento)
class AgendamentoAdmin(admin.ModelAdmin):
    """Admin para o modelo Agendamento."""
    
    list_display = ('sala', 'cliente', 'horario_inicio', 'horario_fim', 'valor_total', 'status')
    list_filter = ('status', 'sala', 'horario_inicio')
    search_fields = ('sala__nome', 'cliente__email', 'cliente__nome')
    readonly_fields = ('valor_total', 'data_criacao', 'data_atualizacao')
    fieldsets = (
        (None, {
            'fields': ('sala', 'cliente')
        }),
        ('Informações do Agendamento', {
            'fields': ('horario_inicio', 'horario_fim', 'valor_total', 'status')
        }),
        ('Informações de Registro', {
            'fields': ('data_criacao', 'data_atualizacao'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        """Garante que o valor total seja calculado corretamente ao salvar no admin."""
        obj.save()
