'use client';

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  Camera,
  Save,
} from 'lucide-react';

// Mock user data
const mockUser = {
  name: 'João Silva',
  email: 'joao@studioflow.com',
};

// Mock studio data
const mockStudio = {
  nome: 'Studio Sound Pro',
  descricao: 'Estúdio profissional de gravação e mixagem com equipamentos de última geração.',
  endereco: 'Rua da Música, 123 - Centro',
  cidade: 'São Paulo',
  telefone: '(11) 99999-9999',
  email: 'contato@studiosoundpro.com',
  horario_funcionamento: '08:00 - 22:00',
  preco_hora: 'R$ 80,00',
  especialidades: ['Gravação', 'Mixagem', 'Masterização', 'Ensaio'],
};

export default function PerfilEstudioPage() {
  const { requireAuth, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [studioData, setStudioData] = useState(mockStudio);

  const handleEditProfile = () => {
    if (requireAuth('editar o perfil do estúdio')) {
      setIsEditing(true);
    }
  };

  const handleSaveProfile = () => {
    if (requireAuth('salvar alterações no perfil')) {
      // Lógica para salvar o perfil
      console.log('Salvando perfil do estúdio...', studioData);
      setIsEditing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setStudioData({
      ...studioData,
      [field]: value,
    });
  };

  // Mapear o user para o formato esperado pelo Layout
  const layoutUser = user ? {
    name: user.nome,
    email: user.email,
  } : mockUser;

  return (
    <Layout user={layoutUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Perfil do Estúdio</h1>
            <p className="text-muted-foreground">
              Gerencie as informações do seu estúdio
            </p>
          </div>
          {!isEditing ? (
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={handleEditProfile}
            >
              <Building className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={handleSaveProfile}
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          )}
        </div>

        {/* Studio Profile Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
            <CardDescription>
              Informações principais do seu estúdio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Nome do Estúdio
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={studioData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-foreground">{studioData.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Preço por Hora
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={studioData.preco_hora}
                    onChange={(e) => handleInputChange('preco_hora', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <p className="text-foreground">{studioData.preco_hora}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Descrição
              </label>
              {isEditing ? (
                <textarea
                  value={studioData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-foreground">{studioData.descricao}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={studioData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-foreground">{studioData.endereco}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={studioData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-foreground">{studioData.telefone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={studioData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-foreground">{studioData.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Horário de Funcionamento</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={studioData.horario_funcionamento}
                      onChange={(e) => handleInputChange('horario_funcionamento', e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="text-foreground">{studioData.horario_funcionamento}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Especialidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {studioData.especialidades.map((especialidade, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {especialidade}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Warning for non-authenticated users */}
        {!user && (
          <Card className="bg-accent/10 border-accent">
            <CardContent className="pt-6">
              <p className="text-accent text-center">
                💡 Para editar o perfil do estúdio, você precisa estar logado como prestador de serviço.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}