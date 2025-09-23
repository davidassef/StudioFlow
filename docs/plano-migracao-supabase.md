# 🚀 Plano de Migração Completa: Django → Supabase

## 📋 **VISÃO GERAL**

**Objetivo:** Migrar completamente o StudioFlow de Django para Supabase  
**Prazo:** 4-6 semanas  
**Status:** Em andamento  

---

## 📊 **STATUS ATUAL DA MIGRAÇÃO**

### **✅ FASE 1: Foundation - CONCLUÍDA**
- [x] Criar projeto Supabase local
- [x] Configurar banco PostgreSQL
- [x] Migrar schema de dados (salas, agendamentos, perfis)
- [x] Configurar Row Level Security
- [x] Instalar Supabase Client no frontend
- [x] Criar cliente Supabase configurado
- [x] Migrar dados de salas para desenvolvimento

### **🔄 FASE 2: Autenticação - EM ANDAMENTO**
- [x] Atualizar authStore para usar Supabase Auth
- [ ] **PRÓXIMO:** Testar fluxo de login/cadastro
- [ ] Migrar usuários existentes (será feito quando fizerem login)
- [ ] Atualizar componentes que usam autenticação

### **⏳ FASE 3: APIs e Lógica**
- [ ] Migrar chamadas de API para Supabase Client
- [ ] Atualizar studioStore para usar Supabase
- [ ] Implementar Edge Functions para lógica de negócio
- [ ] Migrar push notifications

### **⏳ FASE 4: Frontend**
- [ ] Atualizar todos os componentes
- [ ] Testar funcionalidades PWA
- [ ] Real-time subscriptions
- [ ] Deploy e testes

---

## 🛠️ **ÚLTIMAS ATUALIZAÇÕES**

✅ **Schema Supabase criado** com tabelas `profiles`, `salas`, `agendamentos`  
✅ **Row Level Security configurado** para segurança de dados  
✅ **Dados de salas migrados** (4 salas de exemplo criadas)  
✅ **Cliente Supabase configurado** no frontend  
✅ **authStore atualizado** para Supabase Auth  

---

## 🎯 **PRÓXIMOS PASSOS IMEDIATOS**

1. **Testar autenticação**: Fazer login/cadastro com Supabase Auth
2. **Corrigir erros de linting** no frontend (200+ erros TypeScript)
3. **Atualizar studioStore** para usar Supabase Client
4. **Implementar real-time** para agendamentos
5. **Testes end-to-end** da migração

---

## 🛠️ **FERRAMENTAS NECESSÁRIAS**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Instalar cliente Supabase
npm install @supabase/supabase-js
```

---

## 📁 **ESTRUTURA APÓS MIGRAÇÃO**

```
StudioFlow/
├── 📁 supabase/              # Configurações Supabase
│   ├── 📄 config.toml       # Config Supabase
│   ├── 📁 migrations/       # SQL migrations
│   └── 📁 functions/        # Edge Functions
├── 📁 frontend/             # Next.js (atualizado)
│   └── 📄 lib/supabase.ts   # Cliente Supabase
└── 📁 docs/                 # Documentação
```

---

## ⚠️ **BACKUP IMPORTANTE**

Antes de começar, faça backup completo:

```bash
# Backup do banco atual
pg_dump studioflow > backup_pre_migracao.sql

# Backup dos arquivos estáticos
cp -r backend/media backup_media/
```

---

## 🔄 **EXECUÇÃO - FASE 1: FOUNDATION**

### **Passo 1: Criar Projeto Supabase**

```bash
# Login no Supabase
supabase login

# Criar novo projeto
supabase init studioflow-supabase
cd studioflow-supabase

# Configurar conexão local
supabase start
```

### **Passo 2: Schema Migration**

Criar arquivo `supabase/migrations/001_initial_schema.sql`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  user_type TEXT CHECK (user_type IN ('CLIENTE', 'PRESTADOR', 'ADMIN')) DEFAULT 'CLIENTE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms (salas)
CREATE TABLE salas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  capacidade INTEGER NOT NULL,
  preco_hora DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  is_disponivel BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings (agendamentos)
CREATE TABLE agendamentos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sala_id UUID REFERENCES salas(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  horario_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  horario_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  valor_total DECIMAL(10,2),
  status TEXT CHECK (status IN ('PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO')) DEFAULT 'PENDENTE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_agendamentos_sala_id ON agendamentos(sala_id);
CREATE INDEX idx_agendamentos_cliente_id ON agendamentos(cliente_id);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
CREATE INDEX idx_agendamentos_horario ON agendamentos(horario_inicio, horario_fim);
```

### **Passo 3: Row Level Security**

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Rooms policies (public read, admin write)
CREATE POLICY "Anyone can view rooms" ON salas
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify rooms" ON salas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'ADMIN'
    )
  );

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON agendamentos
  FOR SELECT USING (auth.uid() = cliente_id);

CREATE POLICY "Providers can view bookings for their rooms" ON agendamentos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN salas s ON s.id = agendamentos.sala_id
      WHERE p.id = auth.uid() AND p.user_type = 'PRESTADOR'
    )
  );

CREATE POLICY "Users can create bookings" ON agendamentos
  FOR INSERT WITH CHECK (auth.uid() = cliente_id);

CREATE POLICY "Users can update own bookings" ON agendamentos
  FOR UPDATE USING (auth.uid() = cliente_id);
```

---

## 🔐 **EXECUÇÃO - FASE 2: AUTENTICAÇÃO**

### **Passo 1: Migrar Usuários**

Criar script `scripts/migrate_users.py`:

```python
import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'studioflow.settings')
django.setup()

from users.models import User
from supabase import create_client

# Supabase client
supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_ANON_KEY')
)

def migrate_users():
    for user in User.objects.all():
        # Create user in Supabase Auth
        auth_response = supabase.auth.admin.create_user({
            'email': user.email,
            'password': 'temp_password_123',  # User will reset
            'email_confirm': True
        })

        if auth_response.user:
            # Create profile
            profile_data = {
                'id': auth_response.user.id,
                'nome': user.nome,
                'telefone': user.telefone,
                'user_type': user.user_type
            }
            supabase.table('profiles').insert(profile_data).execute()

            print(f"Migrated user: {user.email}")

if __name__ == '__main__':
    migrate_users()
```

### **Passo 2: Atualizar Frontend Auth**

Criar `frontend/src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, metadata: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}
```

---

## 🔧 **EXECUÇÃO - FASE 3: EDGE FUNCTIONS**

### **Passo 1: Função para Cálculo de Valor**

Criar `supabase/functions/calculate_booking_value/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { sala_id, horario_inicio, horario_fim } = await req.json()

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  // Get room price
  const { data: sala } = await supabaseClient
    .from('salas')
    .select('preco_hora')
    .eq('id', sala_id)
    .single()

  // Calculate duration in hours
  const start = new Date(horario_inicio)
  const end = new Date(horario_fim)
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

  // Calculate total value
  const valor_total = sala.preco_hora * durationHours

  return new Response(
    JSON.stringify({ valor_total }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

### **Passo 2: Trigger para Atualização Automática**

```sql
-- Function to calculate booking value
CREATE OR REPLACE FUNCTION calculate_booking_value()
RETURNS TRIGGER AS $$
DECLARE
    sala_preco DECIMAL(10,2);
    duracao_horas DECIMAL(10,2);
BEGIN
    -- Get room price
    SELECT preco_hora INTO sala_preco
    FROM salas WHERE id = NEW.sala_id;

    -- Calculate duration
    duracao_horas := EXTRACT(EPOCH FROM (NEW.horario_fim - NEW.horario_inicio)) / 3600;

    -- Calculate total
    NEW.valor_total := sala_preco * duracao_horas;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trigger_calculate_booking_value
    BEFORE INSERT OR UPDATE ON agendamentos
    FOR EACH ROW
    EXECUTE FUNCTION calculate_booking_value();
```

---

## 🎨 **EXECUÇÃO - FASE 4: FRONTEND**

### **Passo 1: Atualizar API Calls**

Criar `frontend/src/lib/api-supabase.ts`:

```typescript
import { supabase } from './supabase'

// Rooms API
export const roomsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('salas')
      .select('*')
      .eq('is_disponivel', true)
    return { data, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('salas')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  }
}

// Bookings API
export const bookingsApi = {
  getMyBookings: async () => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        salas (
          nome,
          preco_hora
        )
      `)
      .eq('cliente_id', supabase.auth.user()?.id)
    return { data, error }
  },

  create: async (bookingData: any) => {
    const { data, error } = await supabase
      .from('agendamentos')
      .insert([bookingData])
    return { data, error }
  },

  updateStatus: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from('agendamentos')
      .update({ status })
      .eq('id', id)
    return { data, error }
  }
}

// Real-time subscriptions
export const realtime = {
  subscribeToBookings: (callback: Function) => {
    return supabase
      .channel('bookings')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'agendamentos' },
        callback
      )
      .subscribe()
  }
}
```

### **Passo 2: Atualizar Stores**

Atualizar `frontend/src/stores/authStore.ts`:

```typescript
import { create } from 'zustand'
import { supabase, auth } from '@/lib/supabase'

interface AuthState {
  user: any
  profile: any
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  loadProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })

    const { data, error } = await auth.signIn(email, password)

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }

    set({
      user: data.user,
      isAuthenticated: true,
      isLoading: false
    })

    // Load profile
    await get().loadProfile()
  },

  register: async (data) => {
    set({ isLoading: true, error: null })

    const { data: authData, error } = await auth.signUp(
      data.email,
      data.password,
      {
        nome: data.nome,
        telefone: data.telefone,
        user_type: data.user_type || 'CLIENTE'
      }
    )

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }

    set({
      user: authData.user,
      isAuthenticated: true,
      isLoading: false
    })
  },

  logout: async () => {
    await auth.signOut()
    set({
      user: null,
      profile: null,
      isAuthenticated: false
    })
  },

  loadProfile: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabase.auth.user()?.id)
      .single()

    if (!error && data) {
      set({ profile: data })
    }
  }
}))
```

---

## 🧪 **EXECUÇÃO - FASE 5: TESTING**

### **Passo 1: Testes Unitários**

```typescript
// frontend/__tests__/supabase-api.test.ts
import { roomsApi, bookingsApi } from '@/lib/api-supabase'

describe('Supabase API', () => {
  test('should fetch rooms', async () => {
    const { data, error } = await roomsApi.getAll()
    expect(error).toBeNull()
    expect(Array.isArray(data)).toBe(true)
  })

  test('should create booking', async () => {
    const bookingData = {
      sala_id: 'test-id',
      horario_inicio: new Date().toISOString(),
      horario_fim: new Date(Date.now() + 3600000).toISOString()
    }

    const { data, error } = await bookingsApi.create(bookingData)
    expect(error).toBeNull()
    expect(data).toBeDefined()
  })
})
```

### **Passo 2: Deploy**

```bash
# Deploy Supabase
supabase db push
supabase functions deploy calculate_booking_value

# Deploy frontend
npm run build
npm run start
```

---

## 📊 **MONITORAMENTO DE PROGRESSO**

- [ ] **Semana 1:** Foundation completa
- [ ] **Semana 2:** Autenticação migrada
- [ ] **Semana 3:** APIs e lógica migradas
- [ ] **Semana 4:** Frontend atualizado
- [ ] **Semana 5-6:** Testing e otimização

---

## 🚨 **ROLLBACK PLAN**

Se algo der errado:

```bash
# Restaurar banco Django
psql studioflow < backup_pre_migracao.sql

# Reverter frontend
git checkout branch-django

# Restaurar arquivos estáticos
cp -r backup_media/* backend/media/
```

---

## 📞 **SUPORTE**

- **Documentação Supabase:** https://supabase.com/docs
- **Discord Supabase:** https://supabase.com/discord
- **GitHub Issues:** Para problemas específicos

---

**Status:** Preparado para execução  
**Próximo passo:** Executar Fase 1 - Foundation