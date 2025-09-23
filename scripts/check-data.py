import sqlite3

conn = sqlite3.connect('backend/db.sqlite3')
cursor = conn.cursor()

# Contar registros em cada tabela
tables = ['users_user', 'studios_sala', 'bookings_agendamento']
for table in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {table}")
    count = cursor.fetchone()[0]
    print(f"{table}: {count} registros")

# Ver alguns exemplos
print("\n--- Usuários ---")
cursor.execute("SELECT id, email, nome, user_type FROM users_user LIMIT 3")
for row in cursor.fetchall():
    print(row)

print("\n--- Salas ---")
cursor.execute("SELECT id, nome, capacidade, preco_hora FROM studios_sala LIMIT 3")
for row in cursor.fetchall():
    print(row)

print("\n--- Agendamentos ---")
cursor.execute("SELECT id, sala_id, cliente_id, status FROM bookings_agendamento LIMIT 3")
for row in cursor.fetchall():
    print(row)

conn.close()