import { expect, test } from "@playwright/test";
import type { HomeAssistant } from "../../src/types";
import { appErrors } from "./helpers";

type DemoElement = HTMLElement & { hass: HomeAssistant };

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
      /\/assets\/starter\/sample-album\.svg$/
    );
    await expect
      .poll(() => image.evaluate((element) => element.naturalWidth))
      .toBeGreaterThan(0);

    await tile.click();
    await expect(page.locator("ha-more-info-dialog")).toBeAttached();
    expect(appErrors(pageErrors)).toHaveLength(0);
  });

  test("uses the default theme in automatic mode", async ({ page }) => {
    const themeState = () =>
      page.locator("ha-demo").evaluate((element: DemoElement) => ({
        darkMode: element.hass.themes.darkMode,
        selectedTheme: element.hass.selectedTheme,
        theme: element.hass.themes.theme,
      }));

    await page.emulateMedia({ colorScheme: "dark" });
    await expect.poll(themeState).toEqual({
      darkMode: true,
      selectedTheme: { theme: "default" },
      theme: "default",
    });

    await page.emulateMedia({ colorScheme: "light" });
    await expect.poll(themeState).toEqual({
      darkMode: false,
      selectedTheme: { theme: "default" },
      theme: "default",
    });
  });
});
