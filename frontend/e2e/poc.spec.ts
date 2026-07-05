import { test, expect } from "@playwright/test";

async function pause(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

test.describe("POC", () => {
  test("full game flow with two players", async ({ browser }) => {
    const aliceCtx = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir: "test-results/videos", size: { width: 1280, height: 720 } },
    });
    const bobCtx = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: { dir: "test-results/videos", size: { width: 1280, height: 720 } },
    });

    const alicePage = await aliceCtx.newPage();
    const bobPage = await bobCtx.newPage();

    for (const page of [alicePage, bobPage]) {
      await page.goto("/");
      await expect(page.getByText("Smart Trip")).toBeVisible();
    }

    await pause(500);
    await alicePage.fill("input[placeholder='Your name']", "Alice");
    await alicePage.fill("input[placeholder='Your age']", "12");
    await pause(300);
    await alicePage.getByText("Create Game").click();

    await expect(alicePage.getByText("Waiting Room")).toBeVisible({ timeout: 10000 });

    const gameUrl = alicePage.url();
    const gameId = new URL(gameUrl).pathname.split("/game/")[1];

    await bobPage.goto("/");
    await bobPage.fill("input[placeholder='Your name']", "Bob");
    await bobPage.fill("input[placeholder='Your age']", "13");

    await bobPage.evaluate((gid) => {
      window.prompt = () => gid;
    }, gameId);
    await pause(300);
    await bobPage.getByText("Join Game").click();

    await expect(bobPage.getByText("Waiting Room")).toBeVisible({ timeout: 10000 });
    await pause(500);
    await expect(alicePage.getByText("Alice (you)")).toBeVisible();
    await expect(alicePage.getByText("Bob")).toBeVisible();

    await pause(500);
    await alicePage.getByText("Start Game").click();

    for (let q = 1; q <= 5; q++) {
      await expect(alicePage.getByText(`Question ${q} of`)).toBeVisible({ timeout: 10000 });
      await pause(400);
      await alicePage.locator("button:has-text('A.')").first().click();
      await pause(200);
      await bobPage.locator("button:has-text('A.')").first().click();
      await pause(300);
    }

    await expect(alicePage.getByText("Game Over!")).toBeVisible({ timeout: 10000 });
    await pause(500);
    await expect(alicePage.getByText(/Winner:/)).toBeVisible();
    await expect(alicePage.getByText("Play Again")).toBeVisible();
    await pause(500);

    // Close contexts to flush videos
    await aliceCtx.close();
    await bobCtx.close();
  });
});
