#!/usr/bin/env python3
"""
Script para aplicar migrações SQL no Supabase local
"""

import psycopg2
import os
from pathlib import Path

# Configurações do banco Supabase local
DB_CONFIG = {
    'host': '127.0.0.1',
    'port': 54322,
    'database': 'postgres',
    'user': 'postgres',
    'password': 'postgres'
}

def execute_sql_file(cursor, file_path):
    """Executa um arquivo SQL"""
    print(f"📄 Executando {file_path}...")

    with open(file_path, 'r', encoding='utf-8') as f:
        sql = f.read()

    try:
        cursor.execute(sql)
        print(f"✅ {file_path} executado com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao executar {file_path}: {e}")
        raise

def apply_migrations():
    """Aplica todas as migrações do Supabase"""
    print("🚀 Aplicando migrações Supabase...")

    try:
        # Conectar ao banco
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Caminho das migrações
        migrations_dir = Path("supabase-project/supabase/migrations")

        if not migrations_dir.exists():
            print(f"❌ Diretório de migrações não encontrado: {migrations_dir}")
            return False

        # Executar migrações em ordem
        migration_files = sorted(migrations_dir.glob("*.sql"))

        if not migration_files:
            print("❌ Nenhum arquivo de migração encontrado!")
            return False

        for migration_file in migration_files:
            execute_sql_file(cursor, migration_file)

        # Commit das mudanças
        conn.commit()
        print("✅ Todas as migrações aplicadas com sucesso!")

        # Verificar tabelas criadas
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)

        tables = cursor.fetchall()
        print(f"📊 Tabelas criadas: {[t[0] for t in tables]}")

        return True

    except Exception as e:
        print(f"❌ Erro durante migração: {e}")
        return False

    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    success = apply_migrations()
    exit(0 if success else 1)