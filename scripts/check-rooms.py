import sqlite3

conn = sqlite3.connect('backend/db.sqlite3')
cursor = conn.cursor()

# Verificar estrutura da tabela studios_sala
cursor.execute("PRAGMA table_info(studios_sala);")
columns = cursor.fetchall()
print("Estrutura da tabela studios_sala:")
for col in columns:
    print(f"  {col[1]} ({col[2]})")

# Verificar alguns registros
cursor.execute("SELECT id, nome, descricao, capacidade, preco_hora FROM studios_sala LIMIT 3;")
rooms = cursor.fetchall()
print("\nPrimeiras salas:")
for room in rooms:
    print(f"  {room}")

conn.close()