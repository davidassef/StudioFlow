#!/usr/bin/env node

/**
 * Script para organizar a documentação do projeto PWA
 * Move arquivos para estrutura organizada em docs/pwa/
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function section(title) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${title}`, 'bright');
  log('='.repeat(60), 'cyan');
}

class DocumentationOrganizer {
  constructor() {
    this.rootDir = process.cwd();
    this.docsDir = path.join(this.rootDir, 'docs', 'pwa');
    this.tasksDir = path.join(this.docsDir, 'tasks');
    this.specsDir = path.join(this.docsDir, 'specs');
    this.scriptsDir = path.join(this.rootDir, 'scripts', 'pwa');
    
    this.filesToMove = [
      // Task files
      { from: 'TASK_1.2_COMPLETE.md', to: 'docs/pwa/tasks/task-1.2-assets.md' },
      { from: 'TASK_2.1_COMPLETE.md', to: 'docs/pwa/tasks/task-2.1-caching.md' },
      { from: 'TASK_2.2_COMPLETE.md', to: 'docs/pwa/tasks/task-2.2-offline-data.md' },
      { from: 'TASK_2.3_COMPLETE.md', to: 'docs/pwa/tasks/task-2.3-offline-ui.md' },
      { from: 'TASK_3.1_COMPLETE.md', to: 'docs/pwa/tasks/task-3.1-push-frontend.md' },
      { from: 'TASK_3.2_COMPLETE.md', to: 'docs/pwa/tasks/task-3.2-push-backend.md' },
      { from: 'TASK_3.3_COMPLETE.md', to: 'docs/pwa/tasks/task-3.3-push-integration.md' },
      
      // Spec files
      { from: 'backend-push-notifications-spec.md', to: 'docs/pwa/specs/push-notifications-spec.md' },
      
      // Scripts PWA
      { from: 'frontend/demo-notification-integration.js', to: 'scripts/pwa/demo-notification-integration.js' },
      { from: 'frontend/test-notification-integration.js', to: 'scripts/pwa/test-notification-integration.js' },
      { from: 'frontend/demo-backend-integration.js', to: 'scripts/pwa/demo-backend-integration.js' },
      { from: 'frontend/test-backend-integration.js', to: 'scripts/pwa/test-backend-integration.js' },
      { from: 'frontend/demo-push-notifications.js', to: 'scripts/pwa/demo-push-notifications.js' },
      { from: 'frontend/test-push-notifications.js', to: 'scripts/pwa/test-push-notifications.js' },
      { from: 'frontend/demo-offline-features.js', to: 'scripts/pwa/demo-offline-features.js' },
      { from: 'frontend/test-offline-ui.js', to: 'scripts/pwa/test-offline-ui.js' },
      { from: 'frontend/test-offline-data.js', to: 'scripts/pwa/test-offline-data.js' },
      { from: 'frontend/test-caching-strategies.js', to: 'scripts/pwa/test-caching-strategies.js' },
      { from: 'frontend/test-pwa.js', to: 'scripts/pwa/test-pwa.js' },
      
      // Utility scripts
      { from: 'frontend/generate-pwa-assets.js', to: 'scripts/pwa/generate-pwa-assets.js' },
      { from: 'frontend/convert-svg-to-png.js', to: 'scripts/pwa/convert-svg-to-png.js' },
      { from: 'frontend/generate-screenshots.js', to: 'scripts/pwa/generate-screenshots.js' },
      { from: 'frontend/validate-pwa-assets.js', to: 'scripts/pwa/validate-pwa-assets.js' }
    ];
    
    this.filesToDelete = [
      'PWA_IMPLEMENTATION_STATUS.md' // Já movido para docs/pwa/implementation-status.md
    ];
  }

  async organize() {
    section('🧹 ORGANIZANDO DOCUMENTAÇÃO PWA');
    
    await this.createDirectories();
    await this.moveFiles();
    await this.deleteOldFiles();
    await this.createIndexFiles();
    
    this.printSummary();
  }

  async createDirectories() {
    info('Criando estrutura de diretórios...');
    
    const dirs = [
      this.docsDir,
      this.tasksDir,
      this.specsDir,
      this.scriptsDir
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        success(`Diretório criado: ${path.relative(this.rootDir, dir)}`);
      }
    });
  }

  async moveFiles() {
    info('Movendo arquivos...');
    
    for (const file of this.filesToMove) {
      const fromPath = path.join(this.rootDir, file.from);
      const toPath = path.join(this.rootDir, file.to);
      
      if (fs.existsSync(fromPath)) {
        // Criar diretório de destino se não existir
        const toDir = path.dirname(toPath);
        if (!fs.existsSync(toDir)) {
          fs.mkdirSync(toDir, { recursive: true });
        }
        
        // Mover arquivo
        fs.copyFileSync(fromPath, toPath);
        fs.unlinkSync(fromPath);
        success(`Movido: ${file.from} → ${file.to}`);
      } else {
        warning(`Arquivo não encontrado: ${file.from}`);
      }
    }
  }

  async deleteOldFiles() {
    info('Removendo arquivos antigos...');
    
    for (const file of this.filesToDelete) {
      const filePath = path.join(this.rootDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        success(`Removido: ${file}`);
      }
    }
  }

  async createIndexFiles() {
    info('Criando arquivos de índice...');
    
    // Criar package.json para scripts PWA
    const packageJson = {
      "name": "studioflow-pwa-scripts",
      "version": "1.0.0",
      "description": "Scripts de teste e demonstração para PWA do StudioFlow",
      "scripts": {
        "demo:all": "node demo-notification-integration.js && node demo-backend-integration.js && node demo-push-notifications.js && node demo-offline-features.js",
        "test:all": "node test-notification-integration.js && node test-backend-integration.js && node test-push-notifications.js && node test-offline-ui.js && node test-offline-data.js && node test-caching-strategies.js && node test-pwa.js",
        "generate:assets": "node generate-pwa-assets.js && node convert-svg-to-png.js && node generate-screenshots.js",
        "validate:assets": "node validate-pwa-assets.js"
      },
      "keywords": ["pwa", "studioflow", "testing", "demo"],
      "author": "Kiro AI Assistant"
    };
    
    const packagePath = path.join(this.scriptsDir, 'package.json');
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    success('Criado: scripts/pwa/package.json');
    
    // Criar README para scripts
    const scriptsReadme = `# 🔧 PWA Scripts - StudioFlow

## 📋 **Scripts Disponíveis**

### 🎭 **Demonstrações**
- \`demo-notification-integration.js\` - Demo completo de integração de notificações
- \`demo-backend-integration.js\` - Demo de integração backend
- \`demo-push-notifications.js\` - Demo de push notifications
- \`demo-offline-features.js\` - Demo de funcionalidades offline

### 🧪 **Testes**
- \`test-notification-integration.js\` - Testes de integração de notificações
- \`test-backend-integration.js\` - Testes de backend
- \`test-push-notifications.js\` - Testes de push notifications
- \`test-offline-ui.js\` - Testes de UI offline
- \`test-offline-data.js\` - Testes de dados offline
- \`test-caching-strategies.js\` - Testes de cache
- \`test-pwa.js\` - Testes gerais de PWA

### 🎨 **Utilitários**
- \`generate-pwa-assets.js\` - Gerar assets PWA
- \`convert-svg-to-png.js\` - Converter SVG para PNG
- \`generate-screenshots.js\` - Gerar screenshots
- \`validate-pwa-assets.js\` - Validar assets PWA

## 🚀 **Como Usar**

\`\`\`bash
# Executar todos os demos
npm run demo:all

# Executar todos os testes
npm run test:all

# Gerar assets
npm run generate:assets

# Validar assets
npm run validate:assets
\`\`\`

---

**Última atualização**: 18 de Setembro de 2025
`;
    
    const scriptsReadmePath = path.join(this.scriptsDir, 'README.md');
    fs.writeFileSync(scriptsReadmePath, scriptsReadme);
    success('Criado: scripts/pwa/README.md');
  }

  printSummary() {
    section('📊 RESUMO DA ORGANIZAÇÃO');
    
    log('✅ Estrutura organizada com sucesso!', 'green');
    log('\n📁 Nova estrutura:', 'blue');
    log('docs/pwa/', 'cyan');
    log('├── README.md                    # Visão geral', 'cyan');
    log('├── implementation-status.md     # Status detalhado', 'cyan');
    log('├── tasks/                       # Documentação por tarefa', 'cyan');
    log('│   ├── README.md', 'cyan');
    log('│   ├── task-1.2-assets.md', 'cyan');
    log('│   ├── task-2.1-caching.md', 'cyan');
    log('│   ├── task-2.2-offline-data.md', 'cyan');
    log('│   ├── task-2.3-offline-ui.md', 'cyan');
    log('│   ├── task-3.1-push-frontend.md', 'cyan');
    log('│   ├── task-3.2-push-backend.md', 'cyan');
    log('│   └── task-3.3-push-integration.md', 'cyan');
    log('└── specs/                       # Especificações técnicas', 'cyan');
    log('    └── push-notifications-spec.md', 'cyan');
    log('', 'cyan');
    log('scripts/pwa/', 'cyan');
    log('├── README.md                    # Documentação dos scripts', 'cyan');
    log('├── package.json                 # Scripts npm', 'cyan');
    log('├── demo-*.js                    # Scripts de demonstração', 'cyan');
    log('├── test-*.js                    # Scripts de teste', 'cyan');
    log('└── generate-*.js                # Scripts utilitários', 'cyan');
    
    log('\n🔗 Links úteis:', 'yellow');
    log('- Documentação: docs/pwa/README.md', 'yellow');
    log('- Status: docs/pwa/implementation-status.md', 'yellow');
    log('- Scripts: scripts/pwa/README.md', 'yellow');
  }
}

// Executar organização
if (require.main === module) {
  const organizer = new DocumentationOrganizer();
  organizer.organize().catch(console.error);
}

module.exports = { DocumentationOrganizer };