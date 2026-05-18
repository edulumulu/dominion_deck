import { test, expect } from "@playwright/test";

test.describe("Dominion Deck E2E", () => {
  test("shows empty state on initial load", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("Selecciona expansiones y genera un mazo"),
    ).toBeVisible();
  });

  test("selects expansions and generates a full deck of 10 cards", async ({ page }) => {
    await page.goto("/");

    await page.getByText("Dominion").click();
    await page.getByText("Intriga").click();
    await page.getByText("Terramar").click();

    await page.getByRole("button", { name: "Generar Mazo" }).click();

    await expect(page.locator(".card-item")).toHaveCount(10, { timeout: 10000 });
    await expect(page.locator(".card-item .card-img")).toHaveCount(10);
  });

  test("language toggle switches EN to ES", async ({ page }) => {
    await page.goto("/");

    await page.getByTitle("EN").click();
    await expect(page.getByText("Select All")).toBeVisible();
  });

  test("theme toggle adds light class to html", async ({ page }) => {
    await page.goto("/");

    await page.getByTitle("Modo claro").click();
    await expect(page.locator("html")).toHaveClass(/light/);
  });

  test("card search opens detail modal and ESC closes it", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.getByPlaceholder("Escribe el nombre...");
    await searchInput.fill("Bruja");

    await page.locator(".sidebar-card-item").first().click();

    await expect(page.locator(".modal-overlay")).toBeVisible();
    await expect(page.locator(".modal-title")).toHaveText("Bruja");

    await page.keyboard.press("Escape");
    await expect(page.locator(".modal-overlay")).not.toBeVisible();
  });

  test("shows connection error when backend is down", async ({ page }) => {
    await page.route("**/api/**", (route) => route.abort());
    await page.goto("/");

    await expect(
      page.getByText("No se pudo conectar con el servidor"),
    ).toBeVisible();
  });
});
