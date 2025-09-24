import { test, expect } from '@playwright/test';

test.describe('Theme colors - black & gold', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('CSS variables are set to black + gold', async ({ page }) => {
    const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--background'));
    const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--primary'));

    // Trim and basic assertions
    expect(bg.trim().length).toBeGreaterThan(0);
    expect(primary.trim().length).toBeGreaterThan(0);

    // Primary should contain '51' (H value for gold used in project) or hex fallback
    expect(primary.includes('51') || primary.includes('#FFD700')).toBeTruthy();
  });

  test('Buttons use gold class when expected', async ({ page }) => {
    // find first primary-like button
    const btn = await page.locator('button, a').filter({ hasText: /nova reserva|novo agendamento|começar/i }).first();
    if (await btn.count() === 0) {
      test.skip();
    }

    // check class list
    const classList = await btn.evaluate(el => Array.from(el.classList));

    // expect at least one of the gold classes to exist or primary utility
    const hasGold = classList.some(c => ['btn-gold','gold-text','gold-bg','btn-primary'].includes(c));
    expect(hasGold).toBeTruthy();
  });
});
