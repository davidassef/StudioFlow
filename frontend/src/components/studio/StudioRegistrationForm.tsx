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
  Building,
  MapPin,
  Phone,
  Mail,
  Camera,
  Upload,
  X,
  Plus,
  DollarSign,
  Clock,
  Music,
  Save,
  Loader2,
} from 'lucide-react';

// Schema de validação
const studioRegistrationSchema = z.object({
  // Informações Básicas
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  studioType: z.string().min(1, 'Selecione o tipo de estúdio'),
  
  // Contato
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  
  // Endereço
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().min(2, 'Estado deve ter pelo menos 2 caracteres'),
  zipCode: z.string().min(8, 'CEP deve ter 8 dígitos'),
  
  // Configurações
  capacity: z.number().min(1, 'Capacidade deve ser pelo menos 1'),
  pricePerHour: z.number().min(1, 'Preço deve ser maior que 0'),
  minimumHours: z.number().min(1, 'Mínimo de horas deve ser pelo menos 1'),
  
  // Horário de Funcionamento
  openTime: z.string().min(1, 'Horário de abertura é obrigatório'),
  closeTime: z.string().min(1, 'Horário de fechamento é obrigatório'),
  
  // Equipamentos (array de strings)
  equipment: z.array(z.string()).min(1, 'Adicione pelo menos um equipamento'),
});

type StudioRegistrationData = z.infer<typeof studioRegistrationSchema>;

interface StudioRegistrationFormProps {
  onSubmit: (data: StudioRegistrationData & { images: File[]; profileImage: File | null }) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<StudioRegistrationData>;
}

const studioTypes = [
  'Gravação',
  'Ensaio',
  'Mixagem',
  'Masterização',
  'Podcast',
  'Live Session',
  'Produção Musical',
  'Dublagem',
];

const commonEquipment = [
  'Microfones Profissionais',
  'Mesa de Som Digital',
  'Monitores de Estúdio',
  'Fones de Ouvido',
  'Interface de Áudio',
  'Computador/DAW',
  'Piano/Teclado',
  'Bateria Acústica',
  'Amplificadores',
  'Cabine Isolada',
  'Tratamento Acústico',
  'Microfones Condensadores',
  'Microfones Dinâmicos',
  'Compressores',
  'Equalizadores',
];

export function StudioRegistrationForm({ onSubmit, isLoading = false, initialData }: StudioRegistrationFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [newEquipment, setNewEquipment] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<StudioRegistrationData>({
    resolver: zodResolver(studioRegistrationSchema),
    defaultValues: {
      capacity: 1,
      pricePerHour: 50,
      minimumHours: 1,
      equipment: [],
      ...initialData,
    },
  });

  // Função para lidar com upload de imagens do estúdio
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + images.length > 10) {
      alert('Máximo de 10 imagens permitidas');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Criar previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

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

  // Remover imagem
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Remover foto de perfil
  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
  };

  // Adicionar equipamento
  const addEquipment = (equipment: string) => {
    if (!selectedEquipment.includes(equipment)) {
      const newList = [...selectedEquipment, equipment];
      setSelectedEquipment(newList);
      setValue('equipment', newList);
    }
  };

  // Remover equipamento
  const removeEquipment = (equipment: string) => {
    const newList = selectedEquipment.filter(eq => eq !== equipment);
    setSelectedEquipment(newList);
    setValue('equipment', newList);
  };

  // Adicionar equipamento personalizado
  const addCustomEquipment = () => {
    if (newEquipment.trim() && !selectedEquipment.includes(newEquipment.trim())) {
      addEquipment(newEquipment.trim());
      setNewEquipment('');
    }
  };

  const onFormSubmit = async (data: StudioRegistrationData) => {
    await onSubmit({ ...data, images, profileImage });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Foto de Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Foto de Perfil do Estúdio
          </CardTitle>
          <CardDescription>
            Adicione uma foto principal que representará seu estúdio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {profileImagePreview ? (
              <div className="relative">
                <img
                  src={profileImagePreview}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-lg object-cover border-2 border-border"
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
              <div className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-muted-foreground" />
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

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Estúdio *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Studio Sound Pro"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studioType">Tipo de Estúdio *</Label>
              <Select onValueChange={(value) => setValue('studioType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {studioTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studioType && (
                <p className="text-sm text-destructive">{errors.studioType.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Descreva seu estúdio, equipamentos, especialidades..."
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="contato@seuestudio.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website (opcional)</Label>
            <Input
              id="website"
              {...register('website')}
              placeholder="https://www.seuestudio.com"
            />
            {errors.website && (
              <p className="text-sm text-destructive">{errors.website.message}</p>
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

      {/* Configurações e Preços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configurações e Preços
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade (pessoas) *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                {...register('capacity', { valueAsNumber: true })}
              />
              {errors.capacity && (
                <p className="text-sm text-destructive">{errors.capacity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerHour">Preço por Hora (R$) *</Label>
              <Input
                id="pricePerHour"
                type="number"
                min="1"
                step="0.01"
                {...register('pricePerHour', { valueAsNumber: true })}
              />
              {errors.pricePerHour && (
                <p className="text-sm text-destructive">{errors.pricePerHour.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumHours">Mínimo de Horas *</Label>
              <Input
                id="minimumHours"
                type="number"
                min="1"
                {...register('minimumHours', { valueAsNumber: true })}
              />
              {errors.minimumHours && (
                <p className="text-sm text-destructive">{errors.minimumHours.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openTime">Horário de Abertura *</Label>
              <Input
                id="openTime"
                type="time"
                {...register('openTime')}
              />
              {errors.openTime && (
                <p className="text-sm text-destructive">{errors.openTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="closeTime">Horário de Fechamento *</Label>
              <Input
                id="closeTime"
                type="time"
                {...register('closeTime')}
              />
              {errors.closeTime && (
                <p className="text-sm text-destructive">{errors.closeTime.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Equipamentos
          </CardTitle>
          <CardDescription>
            Selecione os equipamentos disponíveis no seu estúdio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Equipamentos Comuns */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Equipamentos Disponíveis</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {commonEquipment.map((equipment) => (
                <Button
                  key={equipment}
                  type="button"
                  variant={selectedEquipment.includes(equipment) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (selectedEquipment.includes(equipment)) {
                      removeEquipment(equipment);
                    } else {
                      addEquipment(equipment);
                    }
                  }}
                  className="justify-start text-left h-auto py-2 px-3"
                >
                  {equipment}
                </Button>
              ))}
            </div>
          </div>

          {/* Adicionar Equipamento Personalizado */}
          <div className="space-y-2">
            <Label htmlFor="newEquipment">Adicionar Equipamento Personalizado</Label>
            <div className="flex gap-2">
              <Input
                id="newEquipment"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                placeholder="Ex: Microfone Neumann U87"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomEquipment();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addCustomEquipment}
                disabled={!newEquipment.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Equipamentos Selecionados */}
          {selectedEquipment.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Equipamentos Selecionados</Label>
              <div className="flex flex-wrap gap-2">
                {selectedEquipment.map((equipment) => (
                  <div
                    key={equipment}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                  >
                    {equipment}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeEquipment(equipment)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.equipment && (
            <p className="text-sm text-destructive">{errors.equipment.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Fotos do Estúdio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Fotos do Estúdio
          </CardTitle>
          <CardDescription>
            Adicione fotos que mostrem seu estúdio (máximo 10 fotos)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="studio-images" className="cursor-pointer">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Clique para adicionar fotos ou arraste e solte aqui
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Formatos aceitos: JPG, PNG, WebP (máx. 5MB cada)
                </p>
              </div>
            </Label>
            <input
              id="studio-images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Preview das Imagens */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setImages([]);
            setProfileImage(null);
            setImagePreviews([]);
            setProfileImagePreview(null);
            setSelectedEquipment([]);
          }}
        >
          Limpar Formulário
        </Button>
        
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Cadastrar Estúdio
            </>
          )}
        </Button>
      </div>
    </form>
  );
}