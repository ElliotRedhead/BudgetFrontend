import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosRequestConfig } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { expenseDataContextValue, septemberSummary } from "../test/fixtures";
import Budget from "./Budget";

const renderBudget = (contextValue = expenseDataContextValue()) => {
	render(
		<ExpenseDataContext.Provider value={contextValue}>
			<Budget />
		</ExpenseDataContext.Provider>
	);
	return contextValue;
};

describe("Budget", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("shows the budget and where a carried-over budget came from", () => {
		renderBudget(expenseDataContextValue({ summary: { ...septemberSummary, budget_month: "2026-06-01" } }));

		expect(screen.getByText("Budget: £2,000.00")).toBeInTheDocument();
		expect(screen.getByText("Carried over from June 2026")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Set budget for September 2026" })).toBeInTheDocument();
	});

	it("updates the month's existing budget and reloads", async () => {
		const request = vi.spyOn(axios, "request").mockImplementation(async (config: AxiosRequestConfig) => (
			config.method === "get" ?
				{ status: 200, data: { count: 1, next: null, previous: null, results: [{ id: 4, month: "2026-09-01", amount: 200000 }] } } :
				{ status: 200, data: { id: 4, month: "2026-09-01", amount: 250000 } }
		));
		const contextValue = renderBudget();

		await userEvent.click(screen.getByRole("button", { name: "Edit budget" }));
		await userEvent.clear(screen.getByLabelText("Budget for September 2026 (£)"));
		await userEvent.type(screen.getByLabelText("Budget for September 2026 (£)"), "2500.00");
		await userEvent.click(screen.getByRole("button", { name: "Save budget" }));

		await waitFor(() => expect(contextValue.refresh).toHaveBeenCalled());
		expect(request).toHaveBeenLastCalledWith(expect.objectContaining({
			method: "patch",
			url: expect.stringMatching(/\/budgets\/4\/$/),
			data: { month: "2026-09-01", amount: 250000 }
		}));
	});

	it("creates a budget when the month has none", async () => {
		const request = vi.spyOn(axios, "request").mockImplementation(async (config: AxiosRequestConfig) => (
			config.method === "get" ?
				{ status: 200, data: { count: 0, next: null, previous: null, results: [] } } :
				{ status: 201, data: { id: 5, month: "2026-09-01", amount: 150000 } }
		));
		renderBudget(expenseDataContextValue({ summary: { ...septemberSummary, budget: null, budget_month: null, remaining: null } }));

		await userEvent.click(screen.getByRole("button", { name: "Set budget for September 2026" }));
		await userEvent.type(screen.getByLabelText("Budget for September 2026 (£)"), "1500");
		await userEvent.click(screen.getByRole("button", { name: "Save budget" }));

		await waitFor(() => expect(request).toHaveBeenLastCalledWith(expect.objectContaining({
			method: "post",
			url: expect.stringMatching(/\/budgets\/$/),
			data: { month: "2026-09-01", amount: 150000 }
		})));
	});

	it("won't save an amount that isn't money", async () => {
		renderBudget();

		await userEvent.click(screen.getByRole("button", { name: "Edit budget" }));
		await userEvent.clear(screen.getByLabelText("Budget for September 2026 (£)"));
		await userEvent.type(screen.getByLabelText("Budget for September 2026 (£)"), "-5");

		expect(screen.getByRole("button", { name: "Save budget" })).toBeDisabled();
	});
});
