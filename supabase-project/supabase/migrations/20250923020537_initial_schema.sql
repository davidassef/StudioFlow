-- Enable necessary extensions
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

-- Trigger for automatic value calculation
CREATE TRIGGER trigger_calculate_booking_value
    BEFORE INSERT OR UPDATE ON agendamentos
    FOR EACH ROW
    EXECUTE FUNCTION calculate_booking_value();

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

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
      WHERE p.id = auth.uid() AND p.user_type = 'PRESTADOR'
    )
  );

CREATE POLICY "Users can create bookings" ON agendamentos
  FOR INSERT WITH CHECK (auth.uid() = cliente_id);

CREATE POLICY "Users can update own bookings" ON agendamentos
  FOR UPDATE USING (auth.uid() = cliente_id);

-- Insert sample data
INSERT INTO salas (nome, capacidade, preco_hora, descricao) VALUES
('Sala de Gravação Principal', 8, 150.00, 'Sala equipada com microfone Neumann, mesa de som e isolamento acústico'),
('Estúdio Vocal', 2, 80.00, 'Sala otimizada para gravações vocais com tratamento acústico'),
('Sala de Mixagem', 4, 120.00, 'Equipada com monitores KRK e interface audio profissional'),
('Estúdio Compacto', 3, 100.00, 'Ideal para projetos menores e ensaios');