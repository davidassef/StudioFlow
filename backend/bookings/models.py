from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from studios.models import Sala


class Agendamento(models.Model):
    """Modelo para representar os agendamentos de salas de estúdio."""
    
    class StatusAgendamento(models.TextChoices):
        PENDENTE = 'PENDENTE', _('Pendente')
        CONFIRMADO = 'CONFIRMADO', _('Confirmado')
        CANCELADO = 'CANCELADO', _('Cancelado')
        CONCLUIDO = 'CONCLUIDO', _('Concluído')
    
    sala = models.ForeignKey(
        Sala,
        on_delete=models.CASCADE,
        related_name='agendamentos',
        verbose_name=_('sala')
    )
    cliente = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='agendamentos',
        verbose_name=_('cliente')
    )
    horario_inicio = models.DateTimeField(_('horário de início'))
    horario_fim = models.DateTimeField(_('horário de fim'))
    valor_total = models.DecimalField(_('valor total'), max_digits=10, decimal_places=2)
    status = models.CharField(
        _('status'),
        max_length=10,
        choices=StatusAgendamento.choices,
        default=StatusAgendamento.PENDENTE
    )
    data_criacao = models.DateTimeField(_('data de criação'), auto_now_add=True)
    data_atualizacao = models.DateTimeField(_('data de atualização'), auto_now=True)
    
    class Meta:
        verbose_name = _('agendamento')
        verbose_name_plural = _('agendamentos')
        ordering = ['-horario_inicio']
    
    def __str__(self):
        return f'{self.sala.nome} - {self.cliente.nome} - {self.horario_inicio.strftime("%d/%m/%Y %H:%M")}'
    
    def save(self, *args, **kwargs):
        """Calcula o valor total do agendamento com base no preço por hora da sala."""
        if not self.valor_total:
            # Calcula a duração em horas
            duracao = (self.horario_fim - self.horario_inicio).total_seconds() / 3600
            # Calcula o valor total
            self.valor_total = self.sala.preco_hora * duracao
        super().save(*args, **kwargs)
