import { defineConfig, devices } from '@playwright/test';

const basePath = process.env.BASE_PATH ?? '/niigata-pairing-lab';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:4321${basePath}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm build && node scripts/serve-static.mjs',
    url: `http://127.0.0.1:4321${basePath}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
