import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: true, workers: 2,
  use: { baseURL: 'http://127.0.0.1:4321/alfawali-site/', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: [{name:'desktop',use:{...devices['Desktop Chrome']}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],
  webServer: { command:'pnpm preview', url:'http://127.0.0.1:4321/alfawali-site/', reuseExistingServer:!process.env.CI, env:{GITHUB_REPOSITORY:'gusdias-coder/alfawali-site'} },
});
