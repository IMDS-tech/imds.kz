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

test('home exposes the business premium experience', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-business-home]')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: /Не набор сервисов\. Одна живая система\./ })).toBeVisible();
  await expect(page.locator('[data-proof-bar]')).toBeVisible();
  await expect(page.locator('[data-business-product-card]')).toHaveCount(7);
  await expect(page.locator('[data-platform-layer]')).toHaveCount(4);
  await expect(page.locator('[data-business-value]')).toHaveCount(4);
  await expect(page.getByRole('link', { name: 'Запросить демо' }).first()).toHaveAttribute('href', '/contact');
  await expect(page.getByRole('link', { name: 'Связаться с IMDS' })).toHaveAttribute('href', '/contact');
});

test('desktop hero is balanced and uses real WebGL', async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1330 });
  await page.goto('/');

  const hero = page.locator('[data-business-hero]');
  const heading = page.getByRole('heading', { level: 1 });
  const canvas = page.getByTestId('business-webgl');

  await expect(hero).toBeVisible();
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveAttribute('data-webgl', 'ready');
  await expect(page.locator('[data-hero-line]')).toHaveCount(2);

  const heroBox = await hero.boundingBox();
  const headingBox = await heading.boundingBox();
  expect(heroBox?.height ?? Infinity).toBeLessThan(900);
  expect(headingBox?.height ?? Infinity).toBeLessThan(260);
  expect(headingBox?.width ?? 0).toBeGreaterThan(620);
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
