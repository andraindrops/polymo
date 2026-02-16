import { expect, test } from "@playwright/test";

test.describe("example", () => {
  test("example", async ({ page }) => {
    await page.goto("/examples");
    await expect(page).toHaveURL(/.*\/examples/);

    const createButton = page.getByTestId("example-create-button");
    await createButton.click();

    await page.waitForTimeout(500);

    await expect(page.getByText("Untitled")).toBeVisible();

    const exampleLink = page.getByText("Untitled").first();
    await exampleLink.click();

    await expect(page).toHaveURL(/.*\/examples\/.+/);

    const nameInput = page.getByTestId("example-name-input");
    await nameInput.clear();
    await nameInput.fill("Updated Test Example");

    const submitButton = page.getByTestId("example-submit-button");
    await submitButton.click();

    await page.waitForTimeout(500);

    await expect(nameInput).toHaveValue("Updated Test Example");

    const removeButton = page.getByTestId("example-remove-button");
    await removeButton.click();

    await expect(page).toHaveURL(/.*\/examples/);
  });
});
