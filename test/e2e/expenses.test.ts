import { test } from "@playwright/test";

test("Insert/Edit and Delete expense flow", async ({ page }) => {
  await page.goto("https://homefinances.jose-garcia.net/");
  await page.getByRole("button", { name: "+ Add Expense" }).click();
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill("Test expense");
  await page.getByRole("spinbutton").click();
  await page.getByRole("spinbutton").press("ArrowUp");
  await page.getByRole("spinbutton").fill("1");
  await page.getByRole("spinbutton").press("ArrowUp");
  await page.getByRole("spinbutton").fill("2");
  await page.getByRole("spinbutton").press("ArrowUp");
  await page.getByRole("spinbutton").fill("20");
  await page.locator('input[name="frequency"]').click();
  await page.getByText("Annual").click();
  await page.locator('input[name="category"]').click();
  await page.getByText("Food").click();
  await page.getByRole("button", { name: "Add Expense", exact: true }).click();
  await page.getByTestId("expenses-items").getByRole("button").click();

  await page.getByRole("button", { name: "Edit" }).click();
  await page.locator('input[name="name"]').click();
  await page.locator('input[name="name"]').fill("Test expense 123");
  await page.getByRole("button", { name: "Add Expense", exact: true }).click();
  await page.getByTestId("expenses-items").getByRole("button").click();

  await page.getByRole("button", { name: "Delete" }).click();
  await page.locator("button").filter({ hasText: "Delete" }).click();
});
