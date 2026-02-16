import { expect, test } from "@playwright/test";

test.describe("product", () => {
  test("product", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveURL(/.*\/products/);

    const createButton = page.getByTestId("product-create-button");
    await createButton.click();

    await page.waitForTimeout(500);

    await expect(page.getByText("Untitled")).toBeVisible();

    const productLink = page.getByText("Untitled").first();
    await productLink.click();

    await expect(page).toHaveURL(/.*\/products\/.+/);

    const nameInput = page.getByTestId("product-name-input");
    await nameInput.clear();
    await nameInput.fill("Updated Test Product");

    const bodyInput = page.getByTestId("product-body-input");
    await bodyInput.clear();
    await bodyInput.fill("Updated Test Body");

    const specInput = page.getByTestId("product-spec-input");
    await specInput.clear();
    await specInput.fill("Updated Test Spec");

    const submitButton = page.getByTestId("product-submit-button");
    await submitButton.click();

    await page.waitForTimeout(500);

    await expect(nameInput).toHaveValue("Updated Test Product");
    await expect(bodyInput).toHaveValue("Updated Test Body");
    await expect(specInput).toHaveValue("Updated Test Spec");

    const removeButton = page.getByTestId("product-remove-button");
    await removeButton.click();

    await expect(page).toHaveURL(/.*\/products/);
  });
});
