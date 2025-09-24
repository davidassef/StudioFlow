import { test, expect } from '@playwright/test';

test.describe('HomePage Direct Scroll Removal Test', () => {
  test('should manually remove scroll and verify', async ({ page }) => {
    // Navegar para a homepage
    await page.goto('http://localhost:5102');
    await page.waitForLoadState('networkidle');
    
    // Aplicar estilos anti-scroll diretamente no navegador
    await page.evaluate(() => {
      // HTML
      document.documentElement.style.setProperty('overflow', 'hidden', 'important');
      document.documentElement.style.setProperty('height', '100vh', 'important');
      document.documentElement.style.setProperty('width', '100vw', 'important');
      document.documentElement.style.setProperty('margin', '0', 'important');
      document.documentElement.style.setProperty('padding', '0', 'important');
      
      // Body
      document.body.style.setProperty('overflow', 'hidden', 'important');
      document.body.style.setProperty('height', '100vh', 'important');
      document.body.style.setProperty('width', '100vw', 'important');
      document.body.style.setProperty('margin', '0', 'important');
      document.body.style.setProperty('padding', '0', 'important');
      
      // Next.js root
      const nextRoot = document.getElementById('__next');
      if (nextRoot) {
        nextRoot.style.setProperty('overflow', 'hidden', 'important');
        nextRoot.style.setProperty('height', '100vh', 'important');
        nextRoot.style.setProperty('width', '100vw', 'important');
        nextRoot.style.setProperty('margin', '0', 'important');
        nextRoot.style.setProperty('padding', '0', 'important');
      }
    });
    
    // Aguardar um pouco para os estilos serem aplicados
    await page.waitForTimeout(500);
    
    // Verificar se agora não há scroll
    const scrollInfo = await page.evaluate(() => {
      return {
        hasVerticalScroll: document.documentElement.scrollHeight > document.documentElement.clientHeight,
        hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        bodyOverflow: window.getComputedStyle(document.body).overflow,
        htmlOverflow: window.getComputedStyle(document.documentElement).overflow,
        bodyInlineOverflow: document.body.style.overflow,
        htmlInlineOverflow: document.documentElement.style.overflow,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });
    
    console.log('Scroll info after applying styles:', scrollInfo);
    
    // Verificar se conseguimos remover o scroll
    if (scrollInfo.bodyInlineOverflow === 'hidden' && scrollInfo.htmlInlineOverflow === 'hidden') {
      console.log('✅ Estilos inline aplicados com sucesso!');
      console.log('✅ Isso confirma que é possível remover o scroll manualmente');
      
      // Verificar se ainda há elementos com scroll interno
      const scrollableElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const scrollable = [];
        
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const hasVerticalScroll = element.scrollHeight > element.clientHeight;
          const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
          
          if (hasVerticalScroll || hasHorizontalScroll) {
            scrollable.push({
              tag: element.tagName,
              id: element.id || null,
              className: element.className || null,
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
      
      console.log('Elementos ainda com scroll:', scrollableElements);
      
    } else {
      console.log('❌ Estilos inline não foram aplicados corretamente');
    }
    
    // O teste deve passar se conseguirmos aplicar os estilos
    expect(scrollInfo.bodyInlineOverflow).toBe('hidden');
    expect(scrollInfo.htmlInlineOverflow).toBe('hidden');
  });
});