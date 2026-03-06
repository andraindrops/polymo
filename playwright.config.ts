import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 480_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    viewport: { width: 1920, height: 1080 },
    video: { mode: "on", size: { width: 1920, height: 1080 } },
  },
  projects: [
    {
      name: "tests",
      testMatch: /\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    env: process.env as Record<string, string>, // ← これが超重要。dotenvで読んだ値をNextへ渡す
  },
});
