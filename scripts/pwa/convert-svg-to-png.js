const fs = require('fs');
const path = require('path');

// Check if sharp is available, if not, provide instructions
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('❌ Sharp não está instalado. Instalando...');
  console.log('Execute: npm install sharp --save-dev');
  process.exit(1);
}

const publicDir = path.join(__dirname, 'public');
const iconsDir = path.join(publicDir, 'icons');

// Tamanhos de ícones que precisam ser PNG
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('🔄 Convertendo ícones SVG para PNG...');

async function convertSvgToPng() {
  try {
    // Converter ícones principais
    for (const size of iconSizes) {
      const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
      const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      if (fs.existsSync(svgPath)) {
        await sharp(svgPath)
          .resize(size, size)
          .png({ quality: 90, compressionLevel: 9 })
          .toFile(pngPath);
        
        console.log(`✅ Convertido: icon-${size}x${size}.png`);
      }
    }

    // Converter favicon
    const faviconSvgPath = path.join(publicDir, 'favicon.svg');
    const faviconPngPath = path.join(publicDir, 'favicon.png');
    const faviconIcoPath = path.join(publicDir, 'favicon.ico');
    
    if (fs.existsSync(faviconSvgPath)) {
      // PNG favicon
      await sharp(faviconSvgPath)
        .resize(32, 32)
        .png({ quality: 90 })
        .toFile(faviconPngPath);
      
      // ICO favicon (múltiplos tamanhos)
      await sharp(faviconSvgPath)
        .resize(32, 32)
        .png()
        .toFile(faviconIcoPath);
      
      console.log('✅ Convertido: favicon.png e favicon.ico');
    }

    // Converter apple-touch-icon
    const appleTouchSvgPath = path.join(publicDir, 'apple-touch-icon.svg');
    const appleTouchPngPath = path.join(publicDir, 'apple-touch-icon.png');
    
    if (fs.existsSync(appleTouchSvgPath)) {
      await sharp(appleTouchSvgPath)
        .resize(180, 180)
        .png({ quality: 90 })
        .toFile(appleTouchPngPath);
      
      console.log('✅ Convertido: apple-touch-icon.png');
    }

    // Converter ícones de shortcuts
    const shortcuts = ['shortcut-dashboard', 'shortcut-calendar', 'shortcut-add'];
    for (const shortcut of shortcuts) {
      const svgPath = path.join(iconsDir, `${shortcut}.svg`);
      const pngPath = path.join(iconsDir, `${shortcut}.png`);
      
      if (fs.existsSync(svgPath)) {
        await sharp(svgPath)
          .resize(96, 96)
          .png({ quality: 90 })
          .toFile(pngPath);
        
        console.log(`✅ Convertido: ${shortcut}.png`);
      }
    }

    console.log('\n🎉 Conversão concluída com sucesso!');
    console.log('\n📊 Estatísticas:');
    console.log(`   📱 Ícones principais: ${iconSizes.length} PNGs gerados`);
    console.log(`   🔗 Ícones de shortcuts: ${shortcuts.length} PNGs gerados`);
    console.log(`   🎯 Favicon: PNG e ICO gerados`);
    console.log(`   🍎 Apple touch icon: PNG gerado`);

    // Verificar tamanhos dos arquivos
    console.log('\n📏 Tamanhos dos arquivos:');
    for (const size of iconSizes) {
      const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      if (fs.existsSync(pngPath)) {
        const stats = fs.statSync(pngPath);
        const sizeKB = Math.round(stats.size / 1024);
        console.log(`   icon-${size}x${size}.png: ${sizeKB}KB`);
      }
    }

  } catch (error) {
    console.error('❌ Erro durante a conversão:', error);
    process.exit(1);
  }
}

convertSvgToPng();