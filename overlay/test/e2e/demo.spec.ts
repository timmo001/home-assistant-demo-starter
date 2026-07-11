import { expect, test } from "@playwright/test";
import { appErrors } from "./helpers";

test.describe("Home Assistant demo starter", () => {
  let pageErrors: Error[] = [];

  test.beforeEach(async ({ page }) => {
    pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error));
    await page.goto("/");
    await expect(page.locator("#ha-launch-screen")).toBeHidden({
      timeout: 30_000,
    });
  });

  test("renders the starter section and image tile", async ({ page }) => {
    const heading = page.locator("hui-heading-card");
    await expect(heading).toContainText("Living room");

    const tile = page.locator("hui-tile-card");
    await expect(tile).toContainText("Nest mini");

    const image = tile.locator("ha-tile-icon img");
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute(
      "src",
      /\/assets\/sections\/images\/media_player_family_room\.jpg$/
    );
    await expect
      .poll(() => image.evaluate((element) => element.naturalWidth))
      .toBeGreaterThan(0);

    await tile.click();
    await expect(page.locator("ha-more-info-dialog")).toBeAttached();
    expect(appErrors(pageErrors)).toHaveLength(0);
  });
});
