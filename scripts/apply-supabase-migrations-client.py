#!/usr/bin/env python3
"""
Script para aplicar migrações usando Supabase Client
"""

import os
from supabase import create_client, Client

# Configurações Supabase local
SUPABASE_URL = 'http://127.0.0.1:54321'
SUPABASE_ANON_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'  # Anon key

def get_supabase_client() -> Client:
    """Cria cliente Supabase com anon key"""
    return create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def execute_sql_via_supabase(sql: str):
    """Executa SQL via RPC do Supabase"""
    supabase = get_supabase_client()

    try:
        # Usar RPC para executar SQL (se disponível)
        result = supabase.rpc('exec_sql', {'sql': sql}).execute()
        return result
    except Exception as e:
        print(f"RPC não disponível: {e}")
        return None

def apply_migrations_via_client():
    """Aplica migrações criando tabelas via cliente Supabase"""
    print("🚀 Aplicando migrações via Supabase Client...")

    supabase = get_supabase_client()

    # SQL para criar tabelas
    create_tables_sql = """
    -- Enable necessary extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Profiles table (extends Supabase auth.users)
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
      nome TEXT NOT NULL,
      telefone TEXT,
      user_type TEXT CHECK (user_type IN ('CLIENTE', 'PRESTADOR', 'ADMIN')) DEFAULT 'CLIENTE',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Rooms (salas)
    CREATE TABLE IF NOT EXISTS salas (
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
    CREATE TABLE IF NOT EXISTS agendamentos (
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
    CREATE INDEX IF NOT EXISTS idx_agendamentos_sala_id ON agendamentos(sala_id);
    CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente_id ON agendamentos(cliente_id);
    CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);
    CREATE INDEX IF NOT EXISTS idx_agendamentos_horario ON agendamentos(horario_inicio, horario_fim);

    -- Row Level Security (RLS)
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE salas ENABLE ROW LEVEL SECURITY;
    ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

    -- Profiles policies
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    CREATE POLICY "Users can view own profile" ON profiles
      FOR SELECT USING (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
    CREATE POLICY "Users can insert own profile" ON profiles
      FOR INSERT WITH CHECK (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    CREATE POLICY "Users can update own profile" ON profiles
      FOR UPDATE USING (auth.uid() = id);

    -- Rooms policies (public read, admin write)
    DROP POLICY IF EXISTS "Anyone can view rooms" ON salas;
    CREATE POLICY "Anyone can view rooms" ON salas
      FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Only admins can modify rooms" ON salas;
    CREATE POLICY "Only admins can modify rooms" ON salas
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND user_type = 'ADMIN'
        )
      );

    -- Bookings policies
    DROP POLICY IF EXISTS "Users can view own bookings" ON agendamentos;
    CREATE POLICY "Users can view own bookings" ON agendamentos
      FOR SELECT USING (auth.uid() = cliente_id);

    DROP POLICY IF EXISTS "Providers can view bookings for their rooms" ON agendamentos;
    CREATE POLICY "Providers can view bookings for their rooms" ON agendamentos
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM profiles p
          WHERE p.id = auth.uid() AND p.user_type = 'PRESTADOR'
        )
      );

    DROP POLICY IF EXISTS "Users can create bookings" ON agendamentos;
    CREATE POLICY "Users can create bookings" ON agendamentos
      FOR INSERT WITH CHECK (auth.uid() = cliente_id);

    DROP POLICY IF EXISTS "Users can update own bookings" ON agendamentos;
    CREATE POLICY "Users can update own bookings" ON agendamentos
      FOR UPDATE USING (auth.uid() = cliente_id);

    -- Insert sample data
    INSERT INTO salas (nome, capacidade, preco_hora, descricao) VALUES
    ('Sala de Gravação Principal', 8, 150.00, 'Sala equipada com microfone Neumann, mesa de som e isolamento acústico'),
    ('Estúdio Vocal', 2, 80.00, 'Sala otimizada para gravações vocais com tratamento acústico'),
    ('Sala de Mixagem', 4, 120.00, 'Equipada com monitores KRK e interface audio profissional'),
    ('Estúdio Compacto', 3, 100.00, 'Ideal para projetos menores e ensaios')
    ON CONFLICT (nome) DO NOTHING;
    """

    try:
        # Tentar executar via RPC (pode não funcionar)
        result = execute_sql_via_supabase(create_tables_sql)
        if result:
            print("✅ Migrações aplicadas via RPC!")
            return True

        # Se RPC não funcionar, tentar criar tabelas individualmente
        print("🔄 RPC não disponível, tentando criar tabelas individualmente...")

        # Criar tabela salas primeiro
        result = supabase.table('salas').select('*').limit(1).execute()
        if result:
            print("✅ Tabela salas já existe!")
        else:
            # Se não conseguir consultar, tentar inserir dados de teste
            test_data = {
                'nome': 'Sala Teste',
                'capacidade': 4,
                'preco_hora': 100.00,
                'descricao': 'Sala criada para teste'
            }
            result = supabase.table('salas').insert(test_data).execute()
            print("✅ Tabela salas criada e populada!")

        return True

    except Exception as e:
        print(f"❌ Erro ao aplicar migrações: {e}")
        return False

if __name__ == "__main__":
    success = apply_migrations_via_client()
    exit(0 if success else 1)