from django.db import models
from django.utils.translation import gettext_lazy as _


class Sala(models.Model):
    """Modelo para representar as salas de estúdio disponíveis para agendamento."""
    
    nome = models.CharField(_('nome'), max_length=100)
    capacidade = models.PositiveIntegerField(_('capacidade'))
    preco_hora = models.DecimalField(_('preço por hora'), max_digits=10, decimal_places=2)
    descricao = models.TextField(_('descrição'), blank=True)
    is_disponivel = models.BooleanField(_('disponível'), default=True)
    data_criacao = models.DateTimeField(_('data de criação'), auto_now_add=True)
    data_atualizacao = models.DateTimeField(_('data de atualização'), auto_now=True)
    
    class Meta:
        verbose_name = _('sala')
        verbose_name_plural = _('salas')
        ordering = ['nome']
    
    def __str__(self):
        return self.nome
