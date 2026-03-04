import { expect, test } from "@playwright/test";

test.describe("product studio", () => {
  test("product studio", async ({ page }) => {
    await page.goto("/");

    const createButton = page.getByTestId("product-studio-create-button");
    await createButton.click();
    await expect(page).toHaveURL(/.*\/products\/.+\/studio/);

    const input = page.getByTestId("product-studio-input");
    await input.type("Build a mini memo app.", { delay: 120 });

    const submitButton = page.getByTestId("product-studio-submit-button");

    await submitButton.click();
  });
});
