#!/usr/bin/env python
"""
Teste simples para verificar endpoints da API.
"""

import requests
import json

# Configurações
BASE_URL = "http://127.0.0.1:8200"

def test_endpoints():
    """Testa endpoints básicos."""
    
    # Teste 1: Documentação da API
    print("=== Testando documentação da API ===")
    try:
        response = requests.get(f"{BASE_URL}/api/docs/")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Documentação acessível")
        else:
            print(f"❌ Erro: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro de conexão: {e}")
    
    # Teste 2: Endpoint de login JWT
    print("\n=== Testando endpoint de login ===")
    try:
        login_data = {
            "email": "admin@studioflow.com",
            "password": "admin123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/login/", 
                               json=login_data, 
                               headers={"Content-Type": "application/json"})
        print(f"Status: {response.status_code}")
        print(f"Resposta: {response.text[:200]}...")
    except Exception as e:
        print(f"❌ Erro de conexão: {e}")
    
    # Teste 3: Endpoint de registro
    print("\n=== Testando endpoint de registro ===")
    try:
        register_data = {
            "email": "teste@example.com",
            "nome": "Teste",
            "telefone": "11999999999",
            "user_type": "cliente",
            "password": "senha123!",
            "password_confirm": "senha123!"
        }
        response = requests.post(f"{BASE_URL}/api/v1/users/register/", 
                               json=register_data, 
                               headers={"Content-Type": "application/json"})
        print(f"Status: {response.status_code}")
        print(f"Resposta: {response.text[:200]}...")
    except Exception as e:
        print(f"❌ Erro de conexão: {e}")
    
    # Teste 4: Lista de usuários (deve exigir autenticação)
    print("\n=== Testando lista de usuários (sem auth) ===")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/users/", 
                              headers={"Content-Type": "application/json"})
        print(f"Status: {response.status_code}")
        print(f"Resposta: {response.text[:200]}...")
    except Exception as e:
        print(f"❌ Erro de conexão: {e}")

if __name__ == "__main__":
    test_endpoints()