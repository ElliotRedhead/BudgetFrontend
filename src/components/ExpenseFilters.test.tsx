import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { expenseDataContextValue } from "../test/fixtures";
import ExpenseFilters from "./ExpenseFilters";

const renderFilters = () => {
	const contextValue = expenseDataContextValue();
	render(
		<ExpenseDataContext.Provider value={contextValue}>
			<ExpenseFilters />
		</ExpenseDataContext.Provider>
	);
	return contextValue;
};

describe("ExpenseFilters", () => {
	it("searches once typing pauses, not on every key", async () => {
		const contextValue = renderFilters();

		await userEvent.type(screen.getByLabelText("Search expenses"), "coffee");

		await waitFor(() => expect(contextValue.dispatch).toHaveBeenCalledWith({
			type: "SET_FILTERS",
			payload: { search: "coffee", category: "" }
		}));
		expect(contextValue.dispatch).toHaveBeenCalledTimes(1);
	});

	it("filters by category straight away", async () => {
		const contextValue = renderFilters();

		await userEvent.selectOptions(screen.getByLabelText("Filter by category"), "Eating out");

		expect(contextValue.dispatch).toHaveBeenCalledWith({
			type: "SET_FILTERS",
			payload: { search: "", category: "eating_out" }
		});
	});
});
