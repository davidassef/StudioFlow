#!/bin/bash

# Script de desenvolvimento otimizado com Bun
# Uso: ./dev.sh [comando]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se Bun está instalado
if ! command -v bun &> /dev/null; then
    echo -e "${RED}❌ Bun não está instalado!${NC}"
    echo -e "${YELLOW}📦 Instalando Bun...${NC}"
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependências com Bun...${NC}"
    bun install
fi

# Comando padrão
COMMAND=${1:-dev}

case $COMMAND in
    "dev")
        echo -e "${BLUE}🚀 Iniciando servidor de desenvolvimento com Bun...${NC}"
        echo -e "${GREEN}⚡ Bun oferece ~3x mais velocidade que npm!${NC}"
        bun run dev
        ;;
    "build")
        echo -e "${BLUE}🔨 Fazendo build otimizado com Bun...${NC}"
        bun run build
        ;;
    "install")
        echo -e "${BLUE}📦 Instalando dependências com Bun...${NC}"
        bun install
        ;;
    "clean")
        echo -e "${YELLOW}🧹 Limpando cache e node_modules...${NC}"
        rm -rf node_modules .next bun.lockb
        bun install
        ;;
    "help")
        echo -e "${BLUE}📖 Comandos disponíveis:${NC}"
        echo "  dev     - Inicia servidor de desenvolvimento (padrão)"
        echo "  build   - Faz build de produção"
        echo "  install - Instala dependências"
        echo "  clean   - Limpa cache e reinstala dependências"
        echo "  help    - Mostra esta ajuda"
        ;;
    *)
        echo -e "${RED}❌ Comando desconhecido: $COMMAND${NC}"
        echo -e "${YELLOW}Use 'help' para ver comandos disponíveis${NC}"
        exit 1
        ;;
esac