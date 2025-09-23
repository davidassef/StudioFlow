import sqlite3

conn = sqlite3.connect('backend/db.sqlite3')
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]
print("Tabelas encontradas:")
for table in tables:
    print(f"  - {table}")
conn.close()