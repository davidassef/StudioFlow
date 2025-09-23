import sqlite3

conn = sqlite3.connect('backend/db.sqlite3')
cursor = conn.cursor()

# Verificar estrutura da tabela users_user
cursor.execute("PRAGMA table_info(users_user);")
columns = cursor.fetchall()
print("Estrutura da tabela users_user:")
for col in columns:
    print(f"  {col[1]} ({col[2]})")

# Verificar alguns registros
cursor.execute("SELECT id, username, email, first_name, last_name FROM users_user LIMIT 3;")
users = cursor.fetchall()
print("\nPrimeiros usuários:")
for user in users:
    print(f"  {user}")

conn.close()