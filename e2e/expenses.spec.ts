import { expect, test } from "@playwright/test";

test("register, add an expense, see the totals, then delete it", async ({ page }) => {
	const email = `e2e-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;
	const password = "e2e-Str0ng-password";

	await page.goto("/register");
	await page.getByLabel("Email address").fill(email);
	await page.getByLabel("Password", { exact: true }).fill(password);
	await page.getByLabel("Confirm password").fill(password);
	await page.getByRole("button", { name: "register" }).click();

	await expect(page).toHaveURL(/\/expenses$/);
	await expect(page.getByText("No expenses this month yet.")).toBeVisible();
	await expect(page.getByText("Spent: £0.00")).toBeVisible();

	await page.getByRole("button", { name: "Set budget for" }).click();
	await page.getByLabel(/Budget for/).fill("500");
	await page.getByRole("button", { name: "Save budget" }).click();
	await expect(page.getByText("Budget: £500.00")).toBeVisible();

	await page.getByRole("button", { name: "Add new expense" }).click();
	await page.getByLabel("Name").fill("Weekly shop");
	await page.getByLabel("Cost (£)").fill("64.20");
	await page.getByLabel("Category", { exact: true }).selectOption({ label: "Groceries" });
	await page.getByRole("button", { name: "Save expense" }).click();

	const shopRow = page.getByRole("listitem").filter({ hasText: /weekly shop/i });
	await expect(shopRow).toContainText("£64.20");
	await expect(shopRow).toContainText("Groceries");
	await expect(page.getByText("Spent: £64.20")).toBeVisible();
	await expect(page.getByText("Remaining: £435.80")).toBeVisible();

	await page.getByRole("button", { name: "Delete Weekly shop" }).click();
	await expect(shopRow).toHaveCount(0);
	await expect(page.getByText("Spent: £0.00")).toBeVisible();
});
