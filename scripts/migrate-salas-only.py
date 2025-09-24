#!/usr/bin/env python3
"""
Script simples para migrar dados do Django para Supabase
Foco inicial: migrar apenas salas
"""

import sqlite3
import os
from supabase import create_client, Client

# Configurações
DJANGO_DB = 'backend/db.sqlite3'
SUPABASE_URL = 'http://127.0.0.1:54321'
SUPABASE_ANON_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'

def migrate_salas():
    """Migra salas do Django para Supabase"""
    print("🏗️ Migrando salas do Django para Supabase...")

    # Conectar aos bancos
    django_conn = sqlite3.connect(DJANGO_DB)
    django_cursor = django_conn.cursor()

    supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

    try:
        # Buscar salas no Django
        django_cursor.execute("""
            SELECT id, nome, capacidade, preco_hora, descricao, is_disponivel
            FROM studios_sala
        """)

        salas = django_cursor.fetchall()
        print(f"📊 Encontradas {len(salas)} salas no Django")

        migrated = 0
        for sala in salas:
            sala_id, nome, capacidade, preco_hora, descricao, is_disponivel = sala

            try:
                sala_data = {
                    'nome': nome,
                    'capacidade': capacidade,
                    'preco_hora': float(preco_hora),
                    'descricao': descricao or '',
                    'is_disponivel': bool(is_disponivel)
                }

                # Verificar se já existe
                existing = supabase.table('salas').select('*').eq('nome', nome).execute()
                if existing.data:
                    print(f"⚠️  Sala '{nome}' já existe, pulando...")
                    continue

                result = supabase.table('salas').insert(sala_data).execute()
                migrated += 1
                print(f"✅ Sala '{nome}' migrada")

            except Exception as e:
                print(f"❌ Erro ao migrar sala '{nome}': {e}")

        print(f"📊 Salas migradas: {migrated}/{len(salas)}")

    except Exception as e:
        print(f"❌ Erro durante migração: {e}")

    finally:
        django_conn.close()

if __name__ == "__main__":
    migrate_salas()