import { expect, test } from "@playwright/test";

test("Insert/Edit and Delete expense flow", async ({ page }) => {
  await page.goto("https://homefinances.jose-garcia.net/expenses");
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
  await page.getByTestId("datepicker-trigger").click();
  await page.getByRole("button", { name: "Today" }).click();
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

test("Insert and Delete programmed expense flow", async ({ page }) => {
  await page.goto("https://homefinances.jose-garcia.net/expenses?tab=frequent");
  await page.getByRole("button", { name: "+ Add Expense" }).click();
  await page.locator('input[name="name"]').fill("Test programmed expense");
  await page.locator('input[name="chargeDay"]').fill("15");
  await page.locator('input[name="category"]').click();
  await page.getByText("Food").click();
  await page.getByRole("button", { name: "Add Expense", exact: true }).click();

  const items = page.getByTestId("frequent-expenses-items");
  await expect(items.getByText("Test programmed expense")).toBeVisible();
  await expect(items.getByText("Charged monthly on day 15")).toBeVisible();

  await items.getByRole("button").click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.locator("button").filter({ hasText: "Delete" }).click();
});
