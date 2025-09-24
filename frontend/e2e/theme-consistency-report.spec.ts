import { test, expect } from '@playwright/test';

test.describe('Theme Consistency Report - Black & Gold', () => {
  let report: string[] = [];

  test.beforeEach(async ({ page }) => {
    report = [];
    // Log all console messages and errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        report.push(`❌ CONSOLE ERROR: ${msg.text()}`);
      }
    });
    page.on('pageerror', err => {
      report.push(`🚨 PAGE ERROR: ${err.message}`);
    });
  });

  test('Comprehensive Theme Analysis', async ({ page }) => {
    report.push('🔍 STUDIOFLOW THEME CONSISTENCY REPORT');
    report.push('📅 Generated: ' + new Date().toLocaleString());
    report.push('🎨 Expected Theme: Black (#000000) + Gold (#FFD700)');
    report.push('='.repeat(60));

    // Test multiple key pages
    const pagesToTest = [
      { url: '/', name: 'Home Page' },
      { url: '/login', name: 'Login Page' },
      { url: '/register', name: 'Register Page' },
      { url: '/simple-test', name: 'Simple Test Page' }
    ];

    for (const pageInfo of pagesToTest) {
      report.push(`\n📄 TESTING: ${pageInfo.name} (${pageInfo.url})`);
      report.push('-'.repeat(40));

      try {
        await page.goto(`http://localhost:5102${pageInfo.url}`, { 
          waitUntil: 'networkidle', 
          timeout: 10000 
        });

        // 1. Check CSS Variables
        const cssVars = await page.evaluate(() => {
          const styles = getComputedStyle(document.documentElement);
          return {
            background: styles.getPropertyValue('--background').trim(),
            foreground: styles.getPropertyValue('--foreground').trim(),
            primary: styles.getPropertyValue('--primary').trim(),
            secondary: styles.getPropertyValue('--secondary').trim()
          };
        });

        report.push(`🔧 CSS Variables:`);
        if (cssVars.background) {
          report.push(`  ✅ --background: ${cssVars.background}`);
        } else {
          report.push(`  ❌ --background: MISSING or EMPTY`);
        }

        if (cssVars.primary) {
          if (cssVars.primary.includes('51') || cssVars.primary.includes('#FFD700')) {
            report.push(`  ✅ --primary: ${cssVars.primary} (GOLD DETECTED)`);
          } else {
            report.push(`  ⚠️ --primary: ${cssVars.primary} (NOT GOLD)`);
          }
        } else {
          report.push(`  ❌ --primary: MISSING or EMPTY`);
        }

        // 2. Check Gold Elements
        const goldElements = await page.evaluate(() => {
          const goldClasses = ['gold-text', 'gold-bg', 'btn-gold'];
          const results: any[] = [];
          
          goldClasses.forEach(className => {
            const elements = document.querySelectorAll(`.${className}`);
            if (elements.length > 0) {
              elements.forEach((el, i) => {
                const styles = getComputedStyle(el);
                const color = styles.color;
                const backgroundColor = styles.backgroundColor;
                results.push({
                  className,
                  index: i,
                  text: el.textContent?.slice(0, 50) || '',
                  color,
                  backgroundColor,
                  tagName: el.tagName.toLowerCase()
                });
              });
            }
          });
          return results;
        });

        report.push(`\n🏆 Gold Class Elements:`);
        if (goldElements.length > 0) {
          goldElements.forEach(el => {
            const hasGoldColor = el.color.includes('255, 215, 0') || el.color.includes('#FFD700') || el.color.includes('rgb(255, 215, 0)');
            const hasGoldBg = el.backgroundColor.includes('255, 215, 0') || el.backgroundColor.includes('#FFD700') || el.backgroundColor.includes('rgb(255, 215, 0)');
            const status = (hasGoldColor || hasGoldBg) ? '✅' : '❌';
            report.push(`  ${status} .${el.className}[${el.index}] (${el.tagName}): "${el.text}"`);
            report.push(`     Color: ${el.color}, Background: ${el.backgroundColor}`);
          });
        } else {
          report.push(`  ❌ NO GOLD ELEMENTS FOUND`);
        }

        // 3. Check StudioFlow Logo/Brand Elements
        const logoElements = await page.evaluate(() => {
          const logoSelectors = [
            'h1:contains("StudioFlow")',
            '[class*="logo"]',
            '[class*="brand"]',
            '*:contains("StudioFlow")'
          ];
          const results: any[] = [];
          
          // Find elements containing "StudioFlow"
          const allElements = document.querySelectorAll('*');
          allElements.forEach((el, i) => {
            if (el.textContent?.includes('StudioFlow') && el.children.length === 0) {
              const styles = getComputedStyle(el);
              results.push({
                index: i,
                text: el.textContent.trim(),
                color: styles.color,
                fontWeight: styles.fontWeight,
                textShadow: styles.textShadow,
                className: el.className,
                tagName: el.tagName.toLowerCase()
              });
            }
          });
          return results;
        });

        report.push(`\n🏢 StudioFlow Brand Elements:`);
        if (logoElements.length > 0) {
          logoElements.forEach(el => {
            const hasGoldColor = el.color.includes('255, 215, 0') || el.color.includes('#FFD700') || el.color.includes('rgb(255, 215, 0)');
            const hasGoldShadow = el.textShadow.includes('215') || el.textShadow.includes('#FFD700');
            const status = (hasGoldColor || hasGoldShadow) ? '✅' : '❌';
            report.push(`  ${status} ${el.tagName}.${el.className}: "${el.text}"`);
            report.push(`     Color: ${el.color}, Shadow: ${el.textShadow}`);
          });
        } else {
          report.push(`  ❌ NO STUDIOFLOW BRAND ELEMENTS FOUND`);
        }

        // 4. Check Background Colors
        const backgroundAnalysis = await page.evaluate(() => {
          const body = document.body;
          const html = document.documentElement;
          const bodyStyles = getComputedStyle(body);
          const htmlStyles = getComputedStyle(html);
          
          return {
            bodyBg: bodyStyles.backgroundColor,
            htmlBg: htmlStyles.backgroundColor,
            bodyColor: bodyStyles.color,
            htmlColor: htmlStyles.color
          };
        });

        report.push(`\n🎨 Background Analysis:`);
        const isBodyBlack = backgroundAnalysis.bodyBg.includes('0, 0, 0') || backgroundAnalysis.bodyBg === 'rgb(0, 0, 0)' || backgroundAnalysis.bodyBg === '#000000';
        const isHtmlBlack = backgroundAnalysis.htmlBg.includes('0, 0, 0') || backgroundAnalysis.htmlBg === 'rgb(0, 0, 0)' || backgroundAnalysis.htmlBg === '#000000';
        
        report.push(`  ${isBodyBlack ? '✅' : '❌'} Body Background: ${backgroundAnalysis.bodyBg}`);
        report.push(`  ${isHtmlBlack ? '✅' : '❌'} HTML Background: ${backgroundAnalysis.htmlBg}`);

        // 5. Check for Legacy Gradients
        const legacyGradients = await page.evaluate(() => {
          const allElements = document.querySelectorAll('*');
          const gradientsFound: any[] = [];
          
          allElements.forEach((el, i) => {
            const styles = getComputedStyle(el);
            const bg = styles.background;
            const bgImage = styles.backgroundImage;
            
            if (bg.includes('gradient') || bgImage.includes('gradient')) {
              gradientsFound.push({
                index: i,
                tagName: el.tagName.toLowerCase(),
                className: el.className,
                background: bg.slice(0, 100),
                backgroundImage: bgImage.slice(0, 100)
              });
            }
          });
          return gradientsFound;
        });

        report.push(`\n🌈 Legacy Gradient Check:`);
        if (legacyGradients.length > 0) {
          report.push(`  ⚠️ GRADIENTS FOUND (should be solid colors):`);
          legacyGradients.forEach(el => {
            report.push(`    - ${el.tagName}.${el.className}`);
            report.push(`      Background: ${el.background}`);
          });
        } else {
          report.push(`  ✅ NO LEGACY GRADIENTS FOUND`);
        }

        // 6. Color Contrast Analysis
        const contrastIssues = await page.evaluate(() => {
          const allTextElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button');
          const issues: any[] = [];
          
          allTextElements.forEach((el, i) => {
            const styles = getComputedStyle(el);
            const color = styles.color;
            const backgroundColor = styles.backgroundColor;
            
            // Check for potential contrast issues (light text on light bg, dark on dark)
            const isLightText = color.includes('255') || color.includes('white');
            const isDarkText = color.includes('0, 0, 0') || color.includes('black');
            const isLightBg = backgroundColor.includes('255') || backgroundColor.includes('white');
            const isDarkBg = backgroundColor.includes('0, 0, 0') || backgroundColor.includes('black') || backgroundColor === 'rgba(0, 0, 0, 0)';
            
            if ((isLightText && isLightBg) || (isDarkText && isDarkBg && backgroundColor !== 'rgba(0, 0, 0, 0)')) {
              issues.push({
                index: i,
                text: el.textContent?.slice(0, 30) || '',
                color,
                backgroundColor,
                tagName: el.tagName.toLowerCase()
              });
            }
          });
          return issues.slice(0, 10); // Limit to first 10 issues
        });

        report.push(`\n🔍 Color Contrast Issues:`);
        if (contrastIssues.length > 0) {
          contrastIssues.forEach(issue => {
            report.push(`  ⚠️ ${issue.tagName}: "${issue.text}"`);
            report.push(`     Text: ${issue.color} on Background: ${issue.backgroundColor}`);
          });
        } else {
          report.push(`  ✅ NO MAJOR CONTRAST ISSUES DETECTED`);
        }

      } catch (error) {
        report.push(`❌ ERROR LOADING PAGE: ${error}`);
      }
    }

    // Generate final report
    report.push('\n' + '='.repeat(60));
    report.push('📊 SUMMARY & RECOMMENDATIONS');
    report.push('='.repeat(60));

    // Save report
    const reportText = report.join('\n');
    console.log('\n' + reportText);

    // Always pass the test, we're just generating a report
    expect(true).toBeTruthy();
  });
});