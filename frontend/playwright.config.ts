import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
    video: { mode: "on", size: { width: 1280, height: 720 } },
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "pnpm dev --port 3000",
      port: 3000,
      timeout: 30000,
      reuseExistingServer: true,
    },
  ],
});
