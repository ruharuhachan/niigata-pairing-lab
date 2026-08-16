import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home communicates the Phase 1 purpose', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('新潟ペアリングラボ');
  await expect(page.getByRole('heading', { level: 1, name: /うまい、の先を/ })).toBeVisible();
  await expect(page.getByText('PHASE 1 / 検証準備中')).toBeVisible();
});

test('primary navigation and empty-state transparency work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'ペアリング', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'ペアリング' })).toBeVisible();
  await expect(page.getByText('最初のペアリング仮説を検証中です。')).toBeVisible();
});

test('home has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? ''),
    ),
  ).toEqual([]);
});

test('mobile viewport has no horizontal document overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
});
