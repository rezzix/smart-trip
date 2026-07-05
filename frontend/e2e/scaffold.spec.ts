import { test, expect } from "@playwright/test";

test.describe("Scaffold", () => {
  test("welcome page renders with title and action buttons", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Smart Trip")).toBeVisible();

    await expect(page.getByText("Online multiplayer educational game")).toBeVisible();

    const createButton = page.getByText("Create Game");
    await expect(createButton).toBeVisible();

    const joinButton = page.getByText("Join Game");
    await expect(joinButton).toBeVisible();
  });

  test("backend health endpoint responds correctly", async ({ request }) => {
    const response = await request.get("http://localhost:8000/api/v1/health");
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.app).toBe("Smart Trip");
    expect(body.version).toBe("0.1.0");
  });
});
