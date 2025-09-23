-- Migração de dados Django → Supabase
-- Executar após o schema inicial

-- Desabilitar RLS temporariamente para migração
ALTER TABLE salas DISABLE ROW LEVEL SECURITY;

-- Migrar salas de exemplo (dados fictícios baseados na estrutura do Django)
INSERT INTO salas (nome, capacidade, preco_hora, descricao, is_disponivel, created_at) VALUES
('Sala de Rehearsal 1', 5, 50.00, 'Sala equipada com bateria, amplificadores e microfones', true, NOW()),
('Sala de Rehearsal 2', 8, 75.00, 'Sala maior com isolamento acústico premium', true, NOW()),
('Estúdio de Gravação', 4, 100.00, 'Estúdio profissional com equipamentos de gravação', true, NOW()),
('Sala de Ensaios', 6, 60.00, 'Sala versátil para ensaios e pequenas apresentações', true, NOW());

-- Reabilitar RLS
ALTER TABLE salas ENABLE ROW LEVEL SECURITY;

-- NOTA: Usuários serão criados via Supabase Auth quando fizerem login
-- NOTA: Agendamentos serão criados pelos usuários após a migração