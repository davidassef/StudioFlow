'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Upload,
  X,
  Save,
  Loader2,
  Calendar,
  Music,
} from 'lucide-react';

// Schema de validação
const clientRegistrationSchema = z.object({
  // Informações Pessoais
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  dateOfBirth: z.string().min(1, 'Data de nascimento é obrigatória'),
  
  // Endereço
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
  zipCode: z.string().min(8, 'CEP deve ter 8 dígitos'),
  
  // Preferências
  musicGenres: z.array(z.string()).optional(),
  instrumentsPlayed: z.array(z.string()).optional(),
  experienceLevel: z.string().optional(),
  
  // Configurações
  allowLocationAccess: z.boolean().default(true),
  allowNotifications: z.boolean().default(true),
  allowMarketingEmails: z.boolean().default(false),
});

type ClientRegistrationData = z.infer<typeof clientRegistrationSchema>;

interface ClientRegistrationFormProps {
  onSubmit: (data: ClientRegistrationData & { profileImage: File | null }) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<ClientRegistrationData>;
}

const musicGenres = [
  'Rock',
  'Pop',
  'Jazz',
  'Blues',
  'Country',
  'Hip Hop',
  'R&B',
  'Eletrônica',
  'Clássica',
  'Reggae',
  'Folk',
  'Punk',
  'Metal',
  'Indie',
  'Funk',
  'Samba',
  'MPB',
  'Bossa Nova',
  'Forró',
  'Sertanejo',
];

const instruments = [
  'Violão',
  'Guitarra',
  'Baixo',
  'Bateria',
  'Piano',
  'Teclado',
  'Violino',
  'Saxofone',
  'Trompete',
  'Flauta',
  'Harmônica',
  'Ukulele',
  'Cavaquinho',
  'Acordeon',
  'Vocal',
  'Percussão',
];

const experienceLevels = [
  { value: 'beginner', label: 'Iniciante' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'advanced', label: 'Avançado' },
  { value: 'professional', label: 'Profissional' },
];

export function ClientRegistrationForm({ onSubmit, isLoading = false, initialData }: ClientRegistrationFormProps) {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ClientRegistrationData>({
    resolver: zodResolver(clientRegistrationSchema),
    defaultValues: {
      allowLocationAccess: true,
      allowNotifications: true,
      allowMarketingEmails: false,
      musicGenres: [],
      instrumentsPlayed: [],
      ...initialData,
    },
  });

  // Função para lidar com upload da foto de perfil
  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfileImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remover foto de perfil
  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
  };

  // Adicionar/remover gênero musical
  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
    setValue('musicGenres', newGenres);
  };

  // Adicionar/remover instrumento
  const toggleInstrument = (instrument: string) => {
    const newInstruments = selectedInstruments.includes(instrument)
      ? selectedInstruments.filter(i => i !== instrument)
      : [...selectedInstruments, instrument];
    setSelectedInstruments(newInstruments);
    setValue('instrumentsPlayed', newInstruments);
  };

  const onFormSubmit = async (data: ClientRegistrationData) => {
    await onSubmit({ ...data, profileImage });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Foto de Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Foto de Perfil
          </CardTitle>
          <CardDescription>
            Adicione uma foto para personalizar seu perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {profileImagePreview ? (
              <div className="relative">
                <img
                  src={profileImagePreview}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-2 border-border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={removeProfileImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="w-24 h-24 border-2 border-dashed border-border rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            
            <div>
              <Label htmlFor="profile-image" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  <Upload className="h-4 w-4" />
                  {profileImagePreview ? 'Alterar Foto' : 'Adicionar Foto'}
                </div>
              </Label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageUpload}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Formatos aceitos: JPG, PNG, WebP (máx. 5MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nome *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Seu nome"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Sobrenome *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Seu sobrenome"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="(11) 99999-9999"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Data de Nascimento *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço
          </CardTitle>
          <CardDescription>
            Essas informações nos ajudam a encontrar estúdios próximos a você
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo *</Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="Rua, número, complemento"
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="São Paulo"
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                {...register('state')}
                placeholder="SP"
              />
              {errors.state && (
                <p className="text-sm text-destructive">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                {...register('zipCode')}
                placeholder="01234-567"
              />
              {errors.zipCode && (
                <p className="text-sm text-destructive">{errors.zipCode.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferências Musicais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Preferências Musicais
          </CardTitle>
          <CardDescription>
            Essas informações são opcionais e nos ajudam a personalizar sua experiência
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nível de Experiência */}
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Nível de Experiência</Label>
            <Select onValueChange={(value) => setValue('experienceLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu nível" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gêneros Musicais */}
          <div className="space-y-3">
            <Label>Gêneros Musicais de Interesse</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {musicGenres.map((genre) => (
                <Button
                  key={genre}
                  type="button"
                  variant={selectedGenres.includes(genre) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleGenre(genre)}
                  className="justify-start text-left h-auto py-2 px-3"
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Instrumentos */}
          <div className="space-y-3">
            <Label>Instrumentos que Você Toca</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {instruments.map((instrument) => (
                <Button
                  key={instrument}
                  type="button"
                  variant={selectedInstruments.includes(instrument) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleInstrument(instrument)}
                  className="justify-start text-left h-auto py-2 px-3"
                >
                  {instrument}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Privacidade */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Privacidade</CardTitle>
          <CardDescription>
            Configure suas preferências de privacidade e notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowLocationAccess">Permitir Acesso à Localização</Label>
                <p className="text-sm text-muted-foreground">
                  Permite encontrar estúdios próximos a você
                </p>
              </div>
              <input
                id="allowLocationAccess"
                type="checkbox"
                {...register('allowLocationAccess')}
                className="h-4 w-4 rounded border-border"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowNotifications">Receber Notificações</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre reservas e atualizações importantes
                </p>
              </div>
              <input
                id="allowNotifications"
                type="checkbox"
                {...register('allowNotifications')}
                className="h-4 w-4 rounded border-border"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowMarketingEmails">Emails de Marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Receber ofertas especiais e novidades por email
                </p>
              </div>
              <input
                id="allowMarketingEmails"
                type="checkbox"
                {...register('allowMarketingEmails')}
                className="h-4 w-4 rounded border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setProfileImage(null);
            setProfileImagePreview(null);
            setSelectedGenres([]);
            setSelectedInstruments([]);
          }}
        >
          Limpar Formulário
        </Button>
        
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Cadastrando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Criar Conta
            </>
          )}
        </Button>
      </div>
    </form>
  );
}