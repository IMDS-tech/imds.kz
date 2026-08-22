import { expect, test } from '@playwright/test';

test('critical public journey', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await page.getByRole('link', { name: 'Смотреть продукты' }).click();

  await expect(page.locator('img.product-logo')).toHaveCount(7);
  await expect(page.getByRole('link', { name: 'BELES' }).first()).toHaveAttribute('href', '/products/beles');
  await expect(page.getByRole('link', { name: 'MIS' }).first()).toHaveAttribute('href', '/products/mis');

  await page.getByRole('link', { name: 'BELES' }).first().click();
  await expect(page).toHaveURL(/products\/beles/);
  await expect(page.locator('img.product-hero-logo')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Открыть BELES' })).toHaveAttribute('href', 'https://beles.imds.kz');
  await expect(page.getByRole('link', { name: 'Запросить демо' })).toHaveAttribute('href', '/contact');

  await page.goto('/products/resto');
  await expect(page.locator('img.product-hero-logo')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Запросить демо' })).toHaveAttribute('href', '/contact');
});

test('Industry homepage replacement matches the approved contract', async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1152 });
  await page.goto('/');

  const home = page.locator('[data-industry-home]');
  const hero = page.locator('[data-industry-hero]');
  const heading = page.getByRole('heading', { level: 1 });
  const canvases = page.getByTestId('business-webgl');

  await expect(home).toBeVisible();
  await expect(hero).toBeVisible();
  await expect(canvases).toHaveCount(2);
  await expect(canvases.nth(0)).toHaveAttribute('data-webgl', 'ready');
  await expect(canvases.nth(1)).toHaveAttribute('data-webgl', 'ready');
  await expect(page.locator('[data-hero-line]')).toHaveCount(2);
  await expect(page.locator('[data-industry-product-card]')).toHaveCount(7);
  await expect(page.locator('[data-platform-plane]')).toHaveCount(3);
  await expect(page.locator('[data-industry-value]')).toHaveCount(4);
  await expect(page.locator('[data-final-cta]')).toBeVisible();
  await expect(page.locator('[data-industry-product-card]').first()).toHaveAttribute('href', '/products/beles');
  await expect(page.locator('[data-industry-product-card]').nth(1)).toHaveAttribute('href', '/products/mis');

  const heroBox = await hero.boundingBox();
  const headingBox = await heading.boundingBox();
  expect(heroBox?.height ?? Infinity).toBeLessThan(780);
  expect(headingBox?.height ?? Infinity).toBeLessThan(170);
  expect(headingBox?.width ?? 0).toBeGreaterThan(520);
});

test('home preserves product detail routing', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-business-product-card]').first()).toHaveAttribute('href', '/products/beles');
  await expect(page.locator('[data-business-product-card]').nth(1)).toHaveAttribute('href', '/products/mis');
});

test('mobile navigation opens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Меню' });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Мобильная навигация' })).toBeVisible();
});

test('legal and discovery endpoints work', async ({ page }) => {
  for (const path of ['/privacy', '/terms', '/security', '/sitemap.xml', '/robots.txt']) {
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();
  }
});
