import { expect, test } from '@playwright/test';

test('critical public journey', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await page.getByRole('link', { name: 'Смотреть продукты' }).click();

  await expect(page.getByRole('link', { name: 'BELES' }).first()).toHaveAttribute('href', 'https://beles.imds.kz');
  await expect(page.getByRole('link', { name: 'MIS' }).first()).toHaveAttribute('href', 'https://mis.imds.kz');

  await page.getByRole('link', { name: 'IMDS Resto' }).first().click();
  await expect(page).toHaveURL(/products\/resto/);
  await page.getByRole('link', { name: 'Запросить демо' }).click();
  await expect(page).toHaveURL(/contact/);
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
