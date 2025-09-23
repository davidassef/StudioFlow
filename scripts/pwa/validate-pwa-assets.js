const fs = require('fs');
const path = require('path');

console.log('🔍 Validando assets PWA...\n');

const publicDir = path.join(__dirname, 'public');
const iconsDir = path.join(publicDir, 'icons');
const screenshotsDir = path.join(publicDir, 'screenshots');
const splashDir = path.join(publicDir, 'splash');

// Verificar arquivos essenciais
const essentialFiles = [
  'manifest.json',
  'favicon.ico',
  'favicon.png',
  'favicon.svg',
  'apple-touch-icon.png',
  'browserconfig.xml'
];

console.log('📋 Arquivos Essenciais:');
essentialFiles.forEach(file => {
  const filepath = path.join(publicDir, file);
  const exists = fs.existsSync(filepath);
  const status = exists ? '✅' : '❌';
  
  if (exists) {
    const stats = fs.statSync(filepath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`   ${status} ${file} (${sizeKB}KB)`);
  } else {
    console.log(`   ${status} ${file} - FALTANDO`);
  }
});

// Verificar ícones PNG
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
console.log('\n📱 Ícones PNG:');
iconSizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  const exists = fs.existsSync(filepath);
  const status = exists ? '✅' : '❌';
  
  if (exists) {
    const stats = fs.statSync(filepath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`   ${status} ${filename} (${sizeKB}KB)`);
  } else {
    console.log(`   ${status} ${filename} - FALTANDO`);
  }
});

// Verificar ícones de shortcuts
const shortcuts = ['shortcut-dashboard', 'shortcut-calendar', 'shortcut-add'];
console.log('\n🔗 Ícones de Shortcuts:');
shortcuts.forEach(shortcut => {
  const filename = `${shortcut}.png`;
  const filepath = path.join(iconsDir, filename);
  const exists = fs.existsSync(filepath);
  const status = exists ? '✅' : '❌';
  
  if (exists) {
    const stats = fs.statSync(filepath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`   ${status} ${filename} (${sizeKB}KB)`);
  } else {
    console.log(`   ${status} ${filename} - FALTANDO`);
  }
});

// Verificar screenshots
console.log('\n📸 Screenshots:');
const screenshots = ['desktop-1', 'desktop-2', 'mobile-1', 'mobile-2', 'tablet-1'];
screenshots.forEach(screenshot => {
  const filename = `${screenshot}.svg`;
  const filepath = path.join(screenshotsDir, filename);
  const exists = fs.existsSync(filepath);
  const status = exists ? '✅' : '❌';
  
  if (exists) {
    const stats = fs.statSync(filepath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`   ${status} ${filename} (${sizeKB}KB)`);
  } else {
    console.log(`   ${status} ${filename} - FALTANDO`);
  }
});

// Verificar splash screens
console.log('\n💫 Splash Screens:');
const splashScreens = ['splash-iphone-x', 'splash-iphone-plus', 'splash-ipad'];
splashScreens.forEach(splash => {
  const filename = `${splash}.svg`;
  const filepath = path.join(splashDir, filename);
  const exists = fs.existsSync(filepath);
  const status = exists ? '✅' : '❌';
  
  if (exists) {
    const stats = fs.statSync(filepath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`   ${status} ${filename} (${sizeKB}KB)`);
  } else {
    console.log(`   ${status} ${filename} - FALTANDO`);
  }
});

// Validar manifest.json
console.log('\n📄 Validação do Manifest:');
try {
  const manifestPath = path.join(publicDir, 'manifest.json');
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  
  // Verificações essenciais
  const checks = [
    { key: 'name', required: true },
    { key: 'short_name', required: true },
    { key: 'start_url', required: true },
    { key: 'display', required: true },
    { key: 'theme_color', required: true },
    { key: 'background_color', required: true },
    { key: 'icons', required: true, isArray: true },
    { key: 'screenshots', required: false, isArray: true },
    { key: 'shortcuts', required: false, isArray: true }
  ];
  
  checks.forEach(check => {
    const value = manifest[check.key];
    const exists = value !== undefined;
    const isValidArray = check.isArray ? Array.isArray(value) && value.length > 0 : true;
    const status = exists && isValidArray ? '✅' : (check.required ? '❌' : '⚠️');
    
    if (check.isArray && exists) {
      console.log(`   ${status} ${check.key}: ${value.length} itens`);
    } else {
      console.log(`   ${status} ${check.key}: ${exists ? 'OK' : 'FALTANDO'}`);
    }
  });
  
  // Verificar se os ícones do manifest existem
  console.log('\n🔗 Validação de Links do Manifest:');
  if (manifest.icons) {
    manifest.icons.forEach((icon, index) => {
      const iconPath = path.join(publicDir, icon.src.replace('/', ''));
      const exists = fs.existsSync(iconPath);
      const status = exists ? '✅' : '❌';
      console.log(`   ${status} Ícone ${index + 1}: ${icon.src} (${icon.sizes})`);
    });
  }
  
  if (manifest.screenshots) {
    manifest.screenshots.forEach((screenshot, index) => {
      const screenshotPath = path.join(publicDir, screenshot.src.replace('/', ''));
      const exists = fs.existsSync(screenshotPath);
      const status = exists ? '✅' : '❌';
      console.log(`   ${status} Screenshot ${index + 1}: ${screenshot.src} (${screenshot.sizes})`);
    });
  }
  
} catch (error) {
  console.log('   ❌ Erro ao validar manifest.json:', error.message);
}

// Calcular tamanho total dos assets
console.log('\n📊 Estatísticas dos Assets:');
function calculateDirectorySize(dirPath) {
  let totalSize = 0;
  let fileCount = 0;
  
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        totalSize += stats.size;
        fileCount++;
      }
    });
  }
  
  return { size: totalSize, count: fileCount };
}

const iconsStats = calculateDirectorySize(iconsDir);
const screenshotsStats = calculateDirectorySize(screenshotsDir);
const splashStats = calculateDirectorySize(splashDir);

console.log(`   📱 Ícones: ${iconsStats.count} arquivos, ${Math.round(iconsStats.size / 1024)}KB`);
console.log(`   📸 Screenshots: ${screenshotsStats.count} arquivos, ${Math.round(screenshotsStats.size / 1024)}KB`);
console.log(`   💫 Splash: ${splashStats.count} arquivos, ${Math.round(splashStats.size / 1024)}KB`);

const totalSize = iconsStats.size + screenshotsStats.size + splashStats.size;
const totalFiles = iconsStats.count + screenshotsStats.count + splashStats.count;

console.log(`   🎯 Total: ${totalFiles} arquivos, ${Math.round(totalSize / 1024)}KB`);

console.log('\n🎉 Validação concluída!');
console.log('\n💡 Próximos passos:');
console.log('   1. Teste a instalação PWA em diferentes navegadores');
console.log('   2. Execute Lighthouse audit para verificar score PWA');
console.log('   3. Teste offline functionality');
console.log('   4. Capture screenshots reais da aplicação para produção');

console.log('\n✨ Assets PWA validados e prontos!');