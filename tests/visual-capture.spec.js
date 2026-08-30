import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const captures = [
  { name: 'desktop', viewport: { width: 1440, height: 1200 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
];

for (const capture of captures) {
  test(`home renders and captures at ${capture.name}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: capture.viewport });
    const page = await context.newPage();
    const response = await page.goto('/', { waitUntil: 'networkidle' });

    expect(response?.ok(), `home should return HTTP success for ${capture.name}`).toBeTruthy();
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    fs.mkdirSync('artifacts/visual', { recursive: true });
    await page.screenshot({
      path: `artifacts/visual/home-${capture.name}.png`,
      fullPage: true,
    });

    await context.close();
  });
}
