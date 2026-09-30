import { render, screen } from "@testing-library/react";
import axios from "axios";
import { useContext } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExpenseDataContext, ExpenseDataProvider, ExpenseDataReducer } from "./ExpenseDataContext";

const loadedState = {
	isLoading: false,
	isErrored: false,
	budget: 2000,
	expenses: [
		{ id: "1", name: "rent", cost: 95000, date: "2026-09-01T12:00:00Z" },
		{ id: "2", name: "bus", cost: 275, date: "2026-09-02T08:00:00Z" }
	]
};

describe("ExpenseDataReducer", () => {
	it("replaces an edited expense without mutating the previous state", () => {
		const previousExpenses = loadedState.expenses;
		const editedBus = { id: "2", name: "bus", cost: 300, date: "2026-09-02T08:00:00Z" };

		const nextState = ExpenseDataReducer(loadedState, { type: "ADD_EXPENSE", payload: editedBus });

		expect(nextState.expenses).toEqual([previousExpenses[0], editedBus]);
		expect(loadedState.expenses[1].cost).toBe(275);
		expect(nextState.expenses).not.toBe(previousExpenses);
	});

	it("appends a new expense", () => {
		const newExpense = { id: "3", name: "coffee", cost: 320, date: "2026-09-03T09:00:00Z" };

		const nextState = ExpenseDataReducer(loadedState, { type: "ADD_EXPENSE", payload: newExpense });

		expect(nextState.expenses).toHaveLength(3);
		expect(loadedState.expenses).toHaveLength(2);
	});

	it("ignores a malformed expense rather than deleting anything", () => {
		const malformedExpense = { id: "1", name: "rent", cost: "lots", date: "2026-09-01" };

		const nextState = ExpenseDataReducer(loadedState, { type: "ADD_EXPENSE", payload: malformedExpense });

		expect(nextState).toBe(loadedState);
	});

	it("removes a deleted expense", () => {
		const nextState = ExpenseDataReducer(loadedState, { type: "DELETE_EXPENSE", payload: { id: "1" } });

		expect(nextState.expenses.map(expense => expense.id)).toEqual(["2"]);
	});
});

const ExpenseNames = () => {
	const { state } = useContext(ExpenseDataContext);
	if (state.isLoading) {
		return (
			<p>
				Loading
			</p>
		);
	}
	if (state.isErrored) {
		return (
			<p>
				Failed
			</p>
		);
	}
	return (
		<p>
			{state.expenses.map(expense => expense.name).join(", ")}
		</p>
	);
};

describe("ExpenseDataProvider", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("loads expenses once and provides them", async () => {
		const request = vi.spyOn(axios, "request").mockResolvedValue({ status: 200, data: loadedState.expenses });

		render(
			<ExpenseDataProvider>
				<ExpenseNames />
			</ExpenseDataProvider>
		);

		expect(await screen.findByText("rent, bus")).toBeInTheDocument();
		expect(request).toHaveBeenCalledTimes(1);
	});

	it("shows the failure and doesn't keep retrying", async () => {
		const request = vi.spyOn(axios, "request").mockRejectedValue(new Error("Network Error"));

		render(
			<ExpenseDataProvider>
				<ExpenseNames />
			</ExpenseDataProvider>
		);

		expect(await screen.findByText("Failed")).toBeInTheDocument();
		await new Promise(resolve => setTimeout(resolve, 50));
		expect(request).toHaveBeenCalledTimes(1);
	});
});
