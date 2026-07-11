import { defineConfig, devices } from "@playwright/test";

const DEMO_PORT = 8090;
const DEMO_BASE_URL = `http://127.0.0.1:${DEMO_PORT}`;

export default defineConfig({
  testDir: ".",
  testMatch: "demo.spec.ts",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 1 : 0,
  outputDir: "test-results",
  reporter: [["list"], ["blob", { outputDir: "reports/demo" }]],
  use: {
    baseURL: DEMO_BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: process.env.CI
      ? `yarn serve demo/dist -l tcp://127.0.0.1:${DEMO_PORT} --no-clipboard --no-port-switching --no-request-logging`
      : `yarn gulp build-demo && yarn serve demo/dist -l tcp://127.0.0.1:${DEMO_PORT} --no-clipboard --no-port-switching --no-request-logging`,
    url: DEMO_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: process.env.CI ? 30_000 : 300_000,
    cwd:
      process.env.GITHUB_WORKSPACE ??
      new URL("../..", import.meta.url).pathname,
    stdout: "pipe",
    stderr: "pipe",
  },
});
