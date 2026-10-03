import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { expenseDataContextValue } from "../test/fixtures";
import ApplyRecurringButton from "./ApplyRecurringButton";

const renderButton = () => {
	const contextValue = expenseDataContextValue();
	render(
		<ExpenseDataContext.Provider value={contextValue}>
			<ApplyRecurringButton />
		</ExpenseDataContext.Provider>
	);
	return contextValue;
};

describe("ApplyRecurringButton", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("adds the shown month's recurring expenses and reloads", async () => {
		const request = vi.spyOn(axios, "request").mockResolvedValue({ status: 201, data: { created: [{ id: 5 }, { id: 6 }] } });
		const contextValue = renderButton();

		await userEvent.click(screen.getByRole("button", { name: "Add recurring expenses for September 2026" }));

		expect(await screen.findByText("Added 2 recurring expenses.")).toBeInTheDocument();
		expect(request).toHaveBeenCalledWith(expect.objectContaining({
			method: "post",
			url: expect.stringMatching(/\/recurring-expenses\/apply\/$/),
			params: { month: "2026-09" }
		}));
		expect(contextValue.refresh).toHaveBeenCalled();
	});

	it("uses the singular for one expense", async () => {
		vi.spyOn(axios, "request").mockResolvedValue({ status: 201, data: { created: [{ id: 5 }] } });
		renderButton();

		await userEvent.click(screen.getByRole("button", { name: "Add recurring expenses for September 2026" }));

		expect(await screen.findByText("Added 1 recurring expense.")).toBeInTheDocument();
	});

	it("says when there's nothing new to add", async () => {
		vi.spyOn(axios, "request").mockResolvedValue({ status: 201, data: { created: [] } });
		const contextValue = renderButton();

		await userEvent.click(screen.getByRole("button", { name: "Add recurring expenses for September 2026" }));

		expect(await screen.findByText("This month's recurring expenses are already added.")).toBeInTheDocument();
		expect(contextValue.refresh).not.toHaveBeenCalled();
	});
});
