const fs = require('fs');
const path = require('path');

// Função para gerar screenshots mais realistas
function generateRealisticScreenshot(width, height, type = 'desktop') {
  const isDesktop = type === 'desktop';
  const headerHeight = isDesktop ? 80 : 60;
  const sidebarWidth = isDesktop ? 280 : 0;
  const contentWidth = width - sidebarWidth;
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-gradient-${type}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0f172a"/>
        <stop offset="100%" style="stop-color:#1e293b"/>
      </linearGradient>
      <linearGradient id="card-gradient-${type}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1e293b"/>
        <stop offset="100%" style="stop-color:#334155"/>
      </linearGradient>
      <linearGradient id="primary-gradient-${type}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#3b82f6"/>
        <stop offset="100%" style="stop-color:#8b5cf6"/>
      </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bg-gradient-${type})"/>
    
    ${isDesktop ? `
    <!-- Desktop Sidebar -->
    <rect x="0" y="0" width="${sidebarWidth}" height="${height}" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    
    <!-- Logo area -->
    <rect x="20" y="20" width="40" height="40" fill="url(#primary-gradient-${type})" rx="8"/>
    <text x="80" y="45" fill="#ffffff" font-size="18" font-family="Arial, sans-serif" font-weight="bold">StudioFlow</text>
    
    <!-- Navigation items -->
    <rect x="20" y="80" width="${sidebarWidth - 40}" height="40" fill="#3b82f6" rx="6"/>
    <text x="40" y="105" fill="#ffffff" font-size="14" font-family="Arial, sans-serif">📊 Dashboard</text>
    
    <rect x="20" y="130" width="${sidebarWidth - 40}" height="40" fill="rgba(255,255,255,0.1)" rx="6"/>
    <text x="40" y="155" fill="#cbd5e1" font-size="14" font-family="Arial, sans-serif">📅 Agendamentos</text>
    
    <rect x="20" y="180" width="${sidebarWidth - 40}" height="40" fill="rgba(255,255,255,0.1)" rx="6"/>
    <text x="40" y="205" fill="#cbd5e1" font-size="14" font-family="Arial, sans-serif">🎵 Estúdios</text>
    
    <rect x="20" y="230" width="${sidebarWidth - 40}" height="40" fill="rgba(255,255,255,0.1)" rx="6"/>
    <text x="40" y="255" fill="#cbd5e1" font-size="14" font-family="Arial, sans-serif">👥 Clientes</text>
    ` : ''}
    
    <!-- Header -->
    <rect x="${sidebarWidth}" y="0" width="${contentWidth}" height="${headerHeight}" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    
    ${!isDesktop ? `
    <!-- Mobile header with logo -->
    <rect x="20" y="15" width="30" height="30" fill="url(#primary-gradient-${type})" rx="6"/>
    <text x="60" y="35" fill="#ffffff" font-size="16" font-family="Arial, sans-serif" font-weight="bold">StudioFlow</text>
    ` : `
    <!-- Desktop header -->
    <text x="${sidebarWidth + 30}" y="35" fill="#ffffff" font-size="20" font-family="Arial, sans-serif" font-weight="bold">Dashboard</text>
    <text x="${sidebarWidth + 30}" y="55" fill="#94a3b8" font-size="14" font-family="Arial, sans-serif">Bem-vindo de volta!</text>
    `}
    
    <!-- Search bar -->
    <rect x="${width - 250}" y="${headerHeight/2 - 15}" width="200" height="30" fill="#334155" stroke="#475569" stroke-width="1" rx="15"/>
    <text x="${width - 240}" y="${headerHeight/2 + 5}" fill="#94a3b8" font-size="12" font-family="Arial, sans-serif">🔍 Buscar...</text>
    
    <!-- Main content area -->
    <rect x="${sidebarWidth + 20}" y="${headerHeight + 20}" width="${contentWidth - 40}" height="120" fill="url(#card-gradient-${type})" rx="12" stroke="#475569" stroke-width="1"/>
    
    <!-- Stats cards -->
    <rect x="${sidebarWidth + 40}" y="${headerHeight + 40}" width="${(contentWidth - 100) / 3}" height="80" fill="url(#primary-gradient-${type})" rx="8"/>
    <text x="${sidebarWidth + 50}" y="${headerHeight + 65}" fill="#ffffff" font-size="24" font-family="Arial, sans-serif" font-weight="bold">42</text>
    <text x="${sidebarWidth + 50}" y="${headerHeight + 85}" fill="#e2e8f0" font-size="12" font-family="Arial, sans-serif">Agendamentos Hoje</text>
    
    <rect x="${sidebarWidth + 60 + (contentWidth - 100) / 3}" y="${headerHeight + 40}" width="${(contentWidth - 100) / 3}" height="80" fill="#10b981" rx="8"/>
    <text x="${sidebarWidth + 70 + (contentWidth - 100) / 3}" y="${headerHeight + 65}" fill="#ffffff" font-size="24" font-family="Arial, sans-serif" font-weight="bold">R$ 2.8k</text>
    <text x="${sidebarWidth + 70 + (contentWidth - 100) / 3}" y="${headerHeight + 85}" fill="#e2e8f0" font-size="12" font-family="Arial, sans-serif">Receita do Mês</text>
    
    <rect x="${sidebarWidth + 80 + 2 * (contentWidth - 100) / 3}" y="${headerHeight + 40}" width="${(contentWidth - 100) / 3}" height="80" fill="#f59e0b" rx="8"/>
    <text x="${sidebarWidth + 90 + 2 * (contentWidth - 100) / 3}" y="${headerHeight + 65}" fill="#ffffff" font-size="24" font-family="Arial, sans-serif" font-weight="bold">8</text>
    <text x="${sidebarWidth + 90 + 2 * (contentWidth - 100) / 3}" y="${headerHeight + 85}" fill="#e2e8f0" font-size="12" font-family="Arial, sans-serif">Estúdios Ativos</text>
    
    <!-- Calendar/Schedule area -->
    <rect x="${sidebarWidth + 20}" y="${headerHeight + 160}" width="${contentWidth - 40}" height="${height - headerHeight - 200}" fill="url(#card-gradient-${type})" rx="12" stroke="#475569" stroke-width="1"/>
    
    <!-- Calendar header -->
    <text x="${sidebarWidth + 40}" y="${headerHeight + 185}" fill="#ffffff" font-size="16" font-family="Arial, sans-serif" font-weight="bold">📅 Próximos Agendamentos</text>
    
    <!-- Calendar items -->
    <rect x="${sidebarWidth + 40}" y="${headerHeight + 200}" width="${contentWidth - 80}" height="40" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" stroke-width="1" rx="6"/>
    <text x="${sidebarWidth + 50}" y="${headerHeight + 215}" fill="#3b82f6" font-size="12" font-family="Arial, sans-serif" font-weight="bold">14:00</text>
    <text x="${sidebarWidth + 50}" y="${headerHeight + 230}" fill="#cbd5e1" font-size="11" font-family="Arial, sans-serif">Gravação - João Silva</text>
    
    <rect x="${sidebarWidth + 40}" y="${headerHeight + 250}" width="${contentWidth - 80}" height="40" fill="rgba(139, 92, 246, 0.1)" stroke="#8b5cf6" stroke-width="1" rx="6"/>
    <text x="${sidebarWidth + 50}" y="${headerHeight + 265}" fill="#8b5cf6" font-size="12" font-family="Arial, sans-serif" font-weight="bold">16:30</text>
    <text x="${sidebarWidth + 50}" y="${headerHeight + 280}" fill="#cbd5e1" font-size="11" font-family="Arial, sans-serif">Mixagem - Banda Rock</text>
    
    <rect x="${sidebarWidth + 40}" y="${headerHeight + 300}" width="${contentWidth - 80}" height="40" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" stroke-width="1" rx="6"/>
    <text x="${sidebarWidth + 50}" y="${headerHeight + 315}" fill="#10b981" font-size="12" font-family="Arial, sans-serif" font-weight="bold">19:00</text>
    <text x="${sidebarWidth + 50}" y="${headerHeight + 330}" fill="#cbd5e1" font-size="11" font-family="Arial, sans-serif">Ensaio - Maria Santos</text>
    
    ${!isDesktop ? `
    <!-- Mobile bottom navigation -->
    <rect x="0" y="${height - 60}" width="${width}" height="60" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <rect x="20" y="${height - 45}" width="30" height="30" fill="#3b82f6" rx="15"/>
    <text x="30" y="${height - 25}" fill="#ffffff" font-size="12" font-family="Arial, sans-serif">📊</text>
    
    <rect x="${width/4}" y="${height - 45}" width="30" height="30" fill="rgba(255,255,255,0.1)" rx="15"/>
    <text x="${width/4 + 10}" y="${height - 25}" fill="#94a3b8" font-size="12" font-family="Arial, sans-serif">📅</text>
    
    <rect x="${width/2}" y="${height - 45}" width="30" height="30" fill="rgba(255,255,255,0.1)" rx="15"/>
    <text x="${width/2 + 10}" y="${height - 25}" fill="#94a3b8" font-size="12" font-family="Arial, sans-serif">🎵</text>
    
    <rect x="${3*width/4}" y="${height - 45}" width="30" height="30" fill="rgba(255,255,255,0.1)" rx="15"/>
    <text x="${3*width/4 + 10}" y="${height - 25}" fill="#94a3b8" font-size="12" font-family="Arial, sans-serif">👥</text>
    ` : ''}
    
    <!-- Subtle branding -->
    <text x="${width - 100}" y="${height - 20}" fill="#475569" font-size="10" font-family="Arial, sans-serif">StudioFlow PWA</text>
  </svg>`;
}

console.log('📸 Gerando screenshots realistas...');

// Screenshots para diferentes formatos
const screenshots = [
  { name: 'desktop-1', width: 1280, height: 720, type: 'desktop' },
  { name: 'desktop-2', width: 1920, height: 1080, type: 'desktop' },
  { name: 'mobile-1', width: 390, height: 844, type: 'mobile' },
  { name: 'mobile-2', width: 414, height: 896, type: 'mobile' },
  { name: 'tablet-1', width: 768, height: 1024, type: 'mobile' }
];

const screenshotsDir = path.join(__dirname, 'public', 'screenshots');

screenshots.forEach(screenshot => {
  const svgContent = generateRealisticScreenshot(screenshot.width, screenshot.height, screenshot.type);
  const filename = `${screenshot.name}.svg`;
  const filepath = path.join(screenshotsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Gerado: screenshots/${filename} (${screenshot.width}x${screenshot.height})`);
});

console.log('\n🎉 Screenshots realistas gerados com sucesso!');
console.log('\n💡 Próximos passos:');
console.log('   1. Para produção, capture screenshots reais da aplicação rodando');
console.log('   2. Use ferramentas como Puppeteer ou Playwright para automação');
console.log('   3. Teste em diferentes dispositivos e resoluções');
console.log('\n✨ Screenshots prontos para PWA!');