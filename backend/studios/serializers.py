from rest_framework import serializers
from .models import Sala


class SalaSerializer(serializers.ModelSerializer):
    """Serializer para o modelo de salas de estúdio."""
    
    class Meta:
        model = Sala
        fields = ['id', 'nome', 'capacidade', 'preco_hora', 'descricao', 'is_disponivel', 'data_criacao', 'data_atualizacao']
        read_only_fields = ['data_criacao', 'data_atualizacao']
        
    def validate_capacidade(self, value):
        """Valida se a capacidade é um valor positivo."""
        if value <= 0:
            raise serializers.ValidationError("A capacidade deve ser um valor positivo.")
        return value
    
    def validate_preco_hora(self, value):
        """Valida se o preço por hora é um valor positivo."""
        if value <= 0:
            raise serializers.ValidationError("O preço por hora deve ser um valor positivo.")
        return value