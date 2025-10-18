import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL:
      'https://modern-alchemy-site-git-preview-brady-hadens-projects.vercel.app',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on failure */
    video: 'retain-on-failure',
    /* Run in headed mode - shows browser window */
    headless: false,
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project - runs first to authenticate (only when needed)
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts$/,
      timeout: 600000, // 10 minutes for authentication setup
      use: {
        channel: 'chrome', // Use real Chrome for authentication
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled', // Hide automation
            '--disable-features=IsolateOrigins,site-per-process', // Additional stealth
          ],
        },
      },
    },

    // Main test project - uses saved authentication
    {
      name: 'chromium',
      testMatch: '/tests/*.spec.ts', // Only run .spec.ts files in this project
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // or 'msedge' for Edge
        // Use saved authentication state
        storageState: 'playwright/.auth/user.json',
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled', // Hide automation
            '--disable-features=IsolateOrigins,site-per-process', // Additional stealth
          ],
        },
      },
      // Remove dependencies - setup runs separately only when auth file is missing
    },
  ],

  /* Global timeout for each test */
  timeout: 60000,
})
