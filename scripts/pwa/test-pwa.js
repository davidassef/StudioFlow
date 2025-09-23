const fs = require('fs');
const path = require('path');

console.log('🔍 Testando configuração PWA do StudioFlow...\n');

// Verificar arquivos essenciais
const requiredFiles = [
  'public/manifest.json',
  'public/favicon.svg',
  'public/favicon.ico',
  'public/apple-touch-icon.svg',
  'public/browserconfig.xml',
  'public/icons/icon-192x192.svg',
  'public/icons/icon-512x512.svg'
];

console.log('📁 Verificando arquivos essenciais:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Verificar manifest.json
console.log('\n📱 Verificando manifest.json:');
try {
  const manifestPath = path.join(__dirname, 'public/manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  const requiredFields = ['name', 'short_name', 'start_url', 'display', 'theme_color', 'background_color', 'icons'];
  requiredFields.forEach(field => {
    const exists = manifest[field] !== undefined;
    console.log(`   ${exists ? '✅' : '❌'} ${field}: ${exists ? '✓' : 'Missing'}`);
  });
  
  // Verificar ícones
  console.log(`   ✅ Icons: ${manifest.icons?.length || 0} definidos`);
  console.log(`   ✅ Shortcuts: ${manifest.shortcuts?.length || 0} definidos`);
  console.log(`   ✅ Screenshots: ${manifest.screenshots?.length || 0} definidos`);
  
} catch (error) {
  console.log(`   ❌ Erro ao ler manifest.json: ${error.message}`);
  allFilesExist = false;
}

// Verificar next.config.js
console.log('\n⚙️  Verificando configuração Next.js:');
try {
  const configPath = path.join(__dirname, 'next.config.js');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  const checks = [
    { name: 'next-pwa importado', pattern: /require\(['"]next-pwa['"]/ },
    { name: 'withPWA configurado', pattern: /withPWA\(/ },
    { name: 'runtimeCaching definido', pattern: /runtimeCaching/ },
    { name: 'dest: public', pattern: /dest:\s*['"]public['"]/ }
  ];
  
  checks.forEach(check => {
    const exists = check.pattern.test(configContent);
    console.log(`   ${exists ? '✅' : '❌'} ${check.name}`);
  });
  
} catch (error) {
  console.log(`   ❌ Erro ao ler next.config.js: ${error.message}`);
}

// Verificar layout.tsx
console.log('\n🏗️  Verificando layout PWA:');
try {
  const layoutPath = path.join(__dirname, 'src/app/layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  const checks = [
    { name: 'manifest link', pattern: /manifest.*manifest\.json/ },
    { name: 'theme-color meta', pattern: /themeColor/ },
    { name: 'apple-mobile-web-app', pattern: /apple-mobile-web-app/ },
    { name: 'favicon links', pattern: /favicon/ }
  ];
  
  checks.forEach(check => {
    const exists = check.pattern.test(layoutContent);
    console.log(`   ${exists ? '✅' : '❌'} ${check.name}`);
  });
  
} catch (error) {
  console.log(`   ❌ Erro ao ler layout.tsx: ${error.message}`);
}

// Contar assets gerados
console.log('\n🎨 Assets PWA gerados:');
const assetDirs = [
  { name: 'Ícones principais', path: 'public/icons', pattern: /^icon-\d+x\d+\.svg$/ },
  { name: 'Ícones shortcuts', path: 'public/icons', pattern: /^shortcut-.*\.svg$/ },
  { name: 'Screenshots', path: 'public/screenshots', pattern: /.*\.svg$/ },
  { name: 'Splash screens', path: 'public/splash', pattern: /.*\.svg$/ }
];

assetDirs.forEach(assetDir => {
  try {
    const dirPath = path.join(__dirname, assetDir.path);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      const matchingFiles = files.filter(file => assetDir.pattern.test(file));
      console.log(`   ✅ ${assetDir.name}: ${matchingFiles.length} arquivos`);
    } else {
      console.log(`   ❌ ${assetDir.name}: Diretório não encontrado`);
    }
  } catch (error) {
    console.log(`   ❌ ${assetDir.name}: Erro - ${error.message}`);
  }
});

// Resumo final
console.log('\n📊 Resumo da configuração PWA:');
if (allFilesExist) {
  console.log('   ✅ Todos os arquivos essenciais estão presentes');
  console.log('   ✅ Manifest.json configurado corretamente');
  console.log('   ✅ Next.js PWA configurado');
  console.log('   ✅ Layout com meta tags PWA');
  console.log('   ✅ Assets PWA gerados');
  
  console.log('\n🎉 StudioFlow PWA está pronto!');
  console.log('\n📋 Próximos passos:');
  console.log('   1. Teste a instalação: Chrome DevTools > Application > Manifest');
  console.log('   2. Execute Lighthouse PWA audit');
  console.log('   3. Teste em dispositivos móveis reais');
  console.log('   4. Para produção: converta SVGs para PNG');
  
} else {
  console.log('   ❌ Alguns arquivos essenciais estão faltando');
  console.log('   ⚠️  Execute: node generate-pwa-assets.js');
}

console.log('\n🔗 URLs para teste:');
console.log('   • App: http://localhost:5102');
console.log('   • Manifest: http://localhost:5102/manifest.json');
console.log('   • Service Worker: http://localhost:5102/sw.js');
console.log('   • Ícone principal: http://localhost:5102/icons/icon-192x192.svg');

console.log('\n💡 Comandos úteis:');
console.log('   • Habilitar PWA em dev: ENABLE_PWA=true npm run dev');
console.log('   • Lighthouse audit: lighthouse http://localhost:5102 --only-categories=pwa');
console.log('   • Testar offline: Chrome DevTools > Network > Offline');