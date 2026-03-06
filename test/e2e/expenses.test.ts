import { test, expect } from "@playwright/test";

test("Insert flow", async ({ page }) => {
  await page.goto("https://homefinances.jose-garcia.net/");

  await page.getByRole("button", { name: "+ Add Expense" }).click();
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill("Test name");
  await page.locator('input[name="name"]').press("Tab");
  await page.getByRole("spinbutton").fill("10");
  await page.locator('input[name="frequency"]').click();
  await page.getByRole("dialog").getByText("Monthly").click();
  await page.locator('input[name="category"]').click();
  await page.getByText("Travel").click();
  await page.getByRole("button", { name: "Add Expense", exact: true }).click();
  await page.getByRole("button").nth(3).click();

  await expect(page.getByTestId("expenses-items")).toContainText("Test name");
});
