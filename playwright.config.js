// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  // globalSetup: require.resolve('./utils/globalSetup'), // Thêm đường dẫn đến globalSetup
  reporter: [
    ['html', { outputFolder: 'html-report', open: 'never' }]
  ],
  use: {
    browserName: 'chromium', // Hoặc 'firefox', 'webkit' tùy chọn
    navigationTimeout: 60000,
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
  },
});