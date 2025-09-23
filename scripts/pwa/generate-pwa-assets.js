const fs = require('fs');
const path = require('path');

// Configurações dos ícones PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
const shortcutSizes = [96];

// Cores do StudioFlow
const colors = {
  primary: '#3b82f6',
  accent: '#8b5cf6',
  background: '#0f172a',
  white: '#ffffff'
};

console.log('🎨 Gerando assets PWA para StudioFlow...');

// Criar diretórios necessários
const dirs = ['public/icons', 'public/screenshots', 'public/splash'];
dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Criado diretório: ${dir}`);
  }
});

// Função para gerar SVG de ícone
function generateIconSVG(size, type = 'app') {
  const iconSize = Math.floor(size * 0.6);
  const centerX = size / 2;
  const centerY = size / 2;
  
  let iconContent = '';
  
  if (type === 'app') {
    // Ícone principal do app (nota musical + ondas)
    iconContent = `
      <!-- Nota musical principal -->
      <rect x="${centerX + 20}" y="${centerY - 60}" width="4" height="80" fill="${colors.white}" rx="2"/>
      <ellipse cx="${centerX + 16}" cy="${centerY + 20}" rx="10" ry="6" fill="${colors.white}"/>
      
      <!-- Segunda nota -->
      <rect x="${centerX - 24}" y="${centerY - 40}" width="4" height="60" fill="${colors.white}" rx="2"/>
      <ellipse cx="${centerX - 28}" cy="${centerY + 20}" rx="10" ry="6" fill="${colors.white}"/>
      
      <!-- Conexão entre notas -->
      <path d="M ${centerX - 20} ${centerY - 40} L ${centerX + 24} ${centerY - 60} L ${centerX + 24} ${centerY - 50} L ${centerX - 20} ${centerY - 30} Z" fill="${colors.white}"/>
      
      <!-- Ondas sonoras -->
      <g opacity="0.8">
        <path d="M ${centerX - 40} ${centerY - 10} Q ${centerX - 30} ${centerY - 15} ${centerX - 20} ${centerY - 10} Q ${centerX - 10} ${centerY - 5} ${centerX} ${centerY - 10}" 
              stroke="${colors.white}" stroke-width="2" fill="none"/>
        <path d="M ${centerX - 40} ${centerY} Q ${centerX - 30} ${centerY - 5} ${centerX - 20} ${centerY} Q ${centerX - 10} ${centerY + 5} ${centerX} ${centerY}" 
              stroke="${colors.white}" stroke-width="2" fill="none"/>
        <path d="M ${centerX - 40} ${centerY + 10} Q ${centerX - 30} ${centerY + 5} ${centerX - 20} ${centerY + 10} Q ${centerX - 10} ${centerY + 15} ${centerX} ${centerY + 10}" 
              stroke="${colors.white}" stroke-width="2" fill="none"/>
      </g>
    `;
  } else if (type === 'shortcut-dashboard') {
    // Ícone para shortcut do dashboard
    iconContent = `
      <rect x="${centerX - 15}" y="${centerY - 15}" width="8" height="8" fill="${colors.white}" rx="1"/>
      <rect x="${centerX - 15}" y="${centerY - 2}" width="8" height="8" fill="${colors.white}" rx="1"/>
      <rect x="${centerX - 15}" y="${centerY + 11}" width="8" height="8" fill="${colors.white}" rx="1"/>
      <rect x="${centerX + 2}" y="${centerY - 15}" width="8" height="8" fill="${colors.white}" rx="1"/>
      <rect x="${centerX + 2}" y="${centerY - 2}" width="8" height="8" fill="${colors.white}" rx="1"/>
      <rect x="${centerX + 2}" y="${centerY + 11}" width="8" height="8" fill="${colors.white}" rx="1"/>
    `;
  } else if (type === 'shortcut-calendar') {
    // Ícone para shortcut do calendário
    iconContent = `
      <rect x="${centerX - 18}" y="${centerY - 12}" width="36" height="24" fill="none" stroke="${colors.white}" stroke-width="2" rx="2"/>
      <line x1="${centerX - 18}" y1="${centerY - 4}" x2="${centerX + 18}" y2="${centerY - 4}" stroke="${colors.white}" stroke-width="2"/>
      <line x1="${centerX - 12}" y1="${centerY - 18}" x2="${centerX - 12}" y2="${centerY - 8}" stroke="${colors.white}" stroke-width="2"/>
      <line x1="${centerX + 12}" y1="${centerY - 18}" x2="${centerX + 12}" y2="${centerY - 8}" stroke="${colors.white}" stroke-width="2"/>
      <circle cx="${centerX - 8}" cy="${centerY + 4}" r="2" fill="${colors.white}"/>
      <circle cx="${centerX}" cy="${centerY + 4}" r="2" fill="${colors.white}"/>
      <circle cx="${centerX + 8}" cy="${centerY + 4}" r="2" fill="${colors.white}"/>
    `;
  } else if (type === 'shortcut-add') {
    // Ícone para shortcut de adicionar
    iconContent = `
      <circle cx="${centerX}" cy="${centerY}" r="16" fill="none" stroke="${colors.white}" stroke-width="2"/>
      <line x1="${centerX}" y1="${centerY - 10}" x2="${centerX}" y2="${centerY + 10}" stroke="${colors.white}" stroke-width="2"/>
      <line x1="${centerX - 10}" y1="${centerY}" x2="${centerX + 10}" y2="${centerY}" stroke="${colors.white}" stroke-width="2"/>
    `;
  }
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-gradient-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.primary}"/>
        <stop offset="100%" style="stop-color:${colors.accent}"/>
      </linearGradient>
    </defs>
    
    <!-- Background -->
    <rect width="${size}" height="${size}" fill="url(#bg-gradient-${size})" rx="${size * 0.1}"/>
    
    <!-- Icon content -->
    ${iconContent}
    
    <!-- Subtle border -->
    <rect width="${size}" height="${size}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" rx="${size * 0.1}"/>
  </svg>`;
}

// Gerar ícones principais da aplicação
iconSizes.forEach(size => {
  const svgContent = generateIconSVG(size, 'app');
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(__dirname, 'public', 'icons', filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Gerado: ${filename}`);
});

// Gerar ícones para shortcuts
const shortcuts = [
  { name: 'shortcut-dashboard', type: 'shortcut-dashboard' },
  { name: 'shortcut-calendar', type: 'shortcut-calendar' },
  { name: 'shortcut-add', type: 'shortcut-add' }
];

shortcuts.forEach(shortcut => {
  shortcutSizes.forEach(size => {
    const svgContent = generateIconSVG(size, shortcut.type);
    const filename = `${shortcut.name}.svg`;
    const filepath = path.join(__dirname, 'public', 'icons', filename);
    
    fs.writeFileSync(filepath, svgContent);
    console.log(`✅ Gerado: ${filename}`);
  });
});

// Gerar favicon melhorado
const faviconSVG = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="favicon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.primary}"/>
      <stop offset="100%" style="stop-color:${colors.accent}"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" fill="url(#favicon-gradient)" rx="3"/>
  <rect x="18" y="8" width="2" height="16" fill="${colors.white}" rx="1"/>
  <ellipse cx="17" cy="24" rx="3" ry="2" fill="${colors.white}"/>
  <rect x="12" y="12" width="2" height="12" fill="${colors.white}" rx="1"/>
  <ellipse cx="11" cy="24" rx="3" ry="2" fill="${colors.white}"/>
  <path d="M 14 12 L 20 8 L 20 10 L 14 14 Z" fill="${colors.white}"/>
</svg>`;

fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSVG);
console.log('✅ Gerado: favicon.svg');

// Gerar apple-touch-icon
const appleTouchIcon = generateIconSVG(180, 'app');
fs.writeFileSync(path.join(__dirname, 'public', 'apple-touch-icon.svg'), appleTouchIcon);
console.log('✅ Gerado: apple-touch-icon.svg');

// Criar screenshots placeholder
const screenshotSizes = [
  { name: 'desktop-1', width: 1280, height: 720 },
  { name: 'mobile-1', width: 390, height: 844 }
];

screenshotSizes.forEach(screenshot => {
  const svgContent = `<svg width="${screenshot.width}" height="${screenshot.height}" viewBox="0 0 ${screenshot.width} ${screenshot.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="screenshot-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.background}"/>
        <stop offset="100%" style="stop-color:#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="${screenshot.width}" height="${screenshot.height}" fill="url(#screenshot-bg)"/>
    <text x="${screenshot.width/2}" y="${screenshot.height/2}" text-anchor="middle" fill="${colors.white}" font-size="24" font-family="Arial">
      StudioFlow ${screenshot.name.includes('desktop') ? 'Desktop' : 'Mobile'}
    </text>
    <text x="${screenshot.width/2}" y="${screenshot.height/2 + 40}" text-anchor="middle" fill="${colors.primary}" font-size="16" font-family="Arial">
      ${screenshot.width}x${screenshot.height}
    </text>
  </svg>`;
  
  const filename = `${screenshot.name}.svg`;
  const filepath = path.join(__dirname, 'public', 'screenshots', filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Gerado: screenshots/${filename}`);
});

// Criar splash screens para iOS
const splashSizes = [
  { name: 'iphone-x', width: 375, height: 812 },
  { name: 'iphone-plus', width: 414, height: 736 },
  { name: 'ipad', width: 768, height: 1024 }
];

splashSizes.forEach(splash => {
  const svgContent = `<svg width="${splash.width}" height="${splash.height}" viewBox="0 0 ${splash.width} ${splash.height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="splash-bg-${splash.name}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.background}"/>
        <stop offset="100%" style="stop-color:#1e293b"/>
      </linearGradient>
    </defs>
    <rect width="${splash.width}" height="${splash.height}" fill="url(#splash-bg-${splash.name})"/>
    
    <!-- Logo centralizado -->
    <g transform="translate(${splash.width/2}, ${splash.height/2})">
      ${generateIconSVG(120, 'app').match(/<g[^>]*>[\s\S]*<\/g>|<rect[^>]*\/>|<ellipse[^>]*\/>|<path[^>]*\/>/g)?.join('') || ''}
    </g>
    
    <!-- Texto -->
    <text x="${splash.width/2}" y="${splash.height/2 + 100}" text-anchor="middle" fill="${colors.white}" font-size="24" font-family="Arial, sans-serif" font-weight="bold">
      StudioFlow
    </text>
    <text x="${splash.width/2}" y="${splash.height/2 + 130}" text-anchor="middle" fill="${colors.primary}" font-size="16" font-family="Arial, sans-serif">
      Gestão de Estúdios Musicais
    </text>
  </svg>`;
  
  const filename = `splash-${splash.name}.svg`;
  const filepath = path.join(__dirname, 'public', 'splash', filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Gerado: splash/${filename}`);
});

console.log('\n🎉 Assets PWA gerados com sucesso!');
console.log('\n📋 Resumo:');
console.log(`   📱 Ícones da app: ${iconSizes.length} tamanhos`);
console.log(`   🔗 Ícones de shortcuts: ${shortcuts.length} tipos`);
console.log(`   📸 Screenshots: ${screenshotSizes.length} formatos`);
console.log(`   💫 Splash screens: ${splashSizes.length} dispositivos`);
console.log(`   🎯 Favicon e apple-touch-icon`);

console.log('\n💡 Próximos passos:');
console.log('   1. Para produção, converta SVGs para PNG usando:');
console.log('      - https://realfavicongenerator.net/');
console.log('      - https://www.pwabuilder.com/imageGenerator');
console.log('      - Biblioteca sharp (Node.js)');
console.log('   2. Capture screenshots reais da aplicação');
console.log('   3. Teste a instalação PWA em diferentes dispositivos');

console.log('\n✨ StudioFlow PWA assets prontos!');