import { test, expect } from '@playwright/test';

test.describe('HomePage Scroll Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a homepage
    await page.goto('http://localhost:5102');
    await page.waitForLoadState('networkidle');
  });

  test('should have no native browser scroll', async ({ page }) => {
    // Verificar se a página não tem scroll vertical
    const hasVerticalScroll = await page.evaluate(() => {
      return document.documentElement.scrollHeight > document.documentElement.clientHeight;
    });
    
    expect(hasVerticalScroll).toBeFalsy();
    console.log('Vertical scroll detected:', hasVerticalScroll);
  });

  test('should have no horizontal scroll', async ({ page }) => {
    // Verificar se a página não tem scroll horizontal
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasHorizontalScroll).toBeFalsy();
    console.log('Horizontal scroll detected:', hasHorizontalScroll);
  });

  test('should prevent default scroll behavior', async ({ page }) => {
    // Aguardar um pouco para o JavaScript executar
    await page.waitForTimeout(2000);
    
    // Verificar propriedades CSS que previnem scroll
    const bodyOverflow = await page.evaluate(() => {
      return window.getComputedStyle(document.body).overflow;
    });
    
    const htmlOverflow = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).overflow;
    });
    
    console.log('Body overflow:', bodyOverflow);
    console.log('HTML overflow:', htmlOverflow);
    
    // Verificar se os estilos estão sendo aplicados via JavaScript
    const stylesApplied = await page.evaluate(() => {
      return {
        bodyInlineOverflow: document.body.style.overflow,
        htmlInlineOverflow: document.documentElement.style.overflow,
        bodyHasOverflowHidden: document.body.style.overflow === 'hidden',
        htmlHasOverflowHidden: document.documentElement.style.overflow === 'hidden'
      };
    });
    
    console.log('Inline styles applied:', stylesApplied);
    
    // Se os estilos inline estão sendo aplicados, o teste deve passar
    expect(stylesApplied.bodyHasOverflowHidden || bodyOverflow === 'hidden').toBeTruthy();
    expect(stylesApplied.htmlHasOverflowHidden || htmlOverflow === 'hidden').toBeTruthy();
  });

  test('should have fixed viewport dimensions', async ({ page }) => {
    // Verificar se o container principal tem dimensões fixas
    const containerDimensions = await page.evaluate(() => {
      const container = document.querySelector('[data-testid="main-container"]') || document.querySelector('.main-container');
      if (!container) return null;
      
      const rect = container.getBoundingClientRect();
      const styles = window.getComputedStyle(container as Element);
      
      return {
        width: rect.width,
        height: rect.height,
        position: styles.position,
        overflow: styles.overflow,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };
    });
    
    console.log('Container dimensions:', containerDimensions);
    
    if (containerDimensions) {
      expect(containerDimensions.position).toBe('fixed');
      expect(containerDimensions.overflow).toBe('hidden');
      expect(containerDimensions.width).toBe(containerDimensions.viewportWidth);
      expect(containerDimensions.height).toBe(containerDimensions.viewportHeight);
    }
  });

  test('should have hero sections occupying full viewport', async ({ page }) => {
    // Verificar se as hero sections ocupam toda a viewport
    const heroSectionDimensions = await page.evaluate(() => {
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return null;
      
      const rect = heroSection.getBoundingClientRect();
      const styles = window.getComputedStyle(heroSection);
      
      return {
        width: rect.width,
        height: rect.height,
        position: styles.position,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };
    });
    
    console.log('Hero section dimensions:', heroSectionDimensions);
    
    if (heroSectionDimensions) {
      expect(heroSectionDimensions.position).toBe('fixed');
      expect(heroSectionDimensions.width).toBe(heroSectionDimensions.viewportWidth);
      expect(heroSectionDimensions.height).toBe(heroSectionDimensions.viewportHeight);
    }
  });

  test('should detect any scrollable elements', async ({ page }) => {
    // Procurar por elementos que podem ter scroll
    const scrollableElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const scrollable = [];
      
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const styles = window.getComputedStyle(element);
        const hasVerticalScroll = element.scrollHeight > element.clientHeight;
        const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
        
        if (hasVerticalScroll || hasHorizontalScroll) {
          scrollable.push({
            tag: element.tagName,
            id: element.id || null,
            className: element.className || null,
            overflow: styles.overflow,
            overflowX: styles.overflowX,
            overflowY: styles.overflowY,
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth,
            hasVerticalScroll,
            hasHorizontalScroll
          });
        }
      }
      
      return scrollable;
    });
    
    console.log('Scrollable elements found:', scrollableElements);
    
    // Se encontrar elementos com scroll, falhar o teste
    if (scrollableElements.length > 0) {
      console.log('⚠️  Elements with scroll detected:');
      scrollableElements.forEach((el, index) => {
        console.log(`${index + 1}. ${el.tag}${el.id ? `#${el.id}` : ''}${el.className ? `.${el.className.split(' ').join('.')}` : ''}`);
        console.log(`   - Overflow: ${el.overflow}, OverflowX: ${el.overflowX}, OverflowY: ${el.overflowY}`);
        console.log(`   - Vertical scroll: ${el.hasVerticalScroll} (${el.scrollHeight}px > ${el.clientHeight}px)`);
        console.log(`   - Horizontal scroll: ${el.hasHorizontalScroll} (${el.scrollWidth}px > ${el.clientWidth}px)`);
      });
    }
    
    expect(scrollableElements.length).toBe(0);
  });

  test('should not scroll when wheel event is triggered', async ({ page }) => {
    // Obter posição inicial do scroll
    const initialScrollPosition = await page.evaluate(() => {
      return {
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
        scrollLeft: document.documentElement.scrollLeft || document.body.scrollLeft
      };
    });
    
    console.log('Initial scroll position:', initialScrollPosition);
    
    // Tentar fazer scroll com wheel event
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(100);
    
    // Verificar se a posição do scroll mudou
    const finalScrollPosition = await page.evaluate(() => {
      return {
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
        scrollLeft: document.documentElement.scrollLeft || document.body.scrollLeft
      };
    });
    
    console.log('Final scroll position:', finalScrollPosition);
    
    // A posição do scroll não deve ter mudado
    expect(finalScrollPosition.scrollTop).toBe(initialScrollPosition.scrollTop);
    expect(finalScrollPosition.scrollLeft).toBe(initialScrollPosition.scrollLeft);
  });

  test('should detect current section navigation', async ({ page }) => {
    // Verificar se a navegação entre seções está funcionando
    const initialSection = await page.evaluate(() => {
      // Procurar por indicador de seção atual ou estado
      const progressBar = document.querySelector('.fixed.bottom-0 .bg-gold');
      if (progressBar) {
        const width = window.getComputedStyle(progressBar).width;
        return { progressBarWidth: width };
      }
      return null;
    });
    
    console.log('Initial section state:', initialSection);
    
    // Simular wheel event para mudar seção
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(600); // Aguardar cooldown
    
    const finalSection = await page.evaluate(() => {
      const progressBar = document.querySelector('.fixed.bottom-0 .bg-gold');
      if (progressBar) {
        const width = window.getComputedStyle(progressBar).width;
        return { progressBarWidth: width };
      }
      return null;
    });
    
    console.log('Final section state:', finalSection);
    
    // Verificar se a seção mudou (barra de progresso deve ter mudado)
    if (initialSection && finalSection) {
      expect(finalSection.progressBarWidth).not.toBe(initialSection.progressBarWidth);
    }
  });
});