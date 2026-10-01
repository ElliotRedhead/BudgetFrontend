import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import ModalContext from "../context/ModalContext";
import { expenseDataContextValue, modalContextValue } from "../test/fixtures";
import ExpenseItem from "./ExpenseItem";

const groceries = { id: 7, name: "groceries", cost: 4235, date: "2026-07-01T11:30:00Z" };

describe("ExpenseItem", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("deletes through the expense's detail URL, then refreshes the month", async () => {
		const request = vi.spyOn(axios, "request").mockResolvedValue({ status: 204 });
		const contextValue = expenseDataContextValue();
		render(
			<ExpenseDataContext.Provider value={contextValue}>
				<ul>
					<ExpenseItem expense={groceries} />
				</ul>
			</ExpenseDataContext.Provider>
		);

		await userEvent.click(screen.getByRole("button", { name: "Delete groceries" }));

		expect(request).toHaveBeenCalledWith(expect.objectContaining({
			method: "delete",
			url: expect.stringMatching(/\/expenses\/7\/$/)
		}));
		await waitFor(() => expect(contextValue.dispatch).toHaveBeenCalledWith({ type: "DELETE_EXPENSE", payload: { id: 7 } }));
		expect(contextValue.refresh).toHaveBeenCalled();
	});

	it("shows the cost in pounds", () => {
		render(
			<ul>
				<ExpenseItem expense={groceries} />
			</ul>
		);

		expect(screen.getByText("£42.35")).toBeInTheDocument();
	});

	it("opens the editor with the expense's local time, not UTC", async () => {
		const expenseDateSetter = vi.fn();
		render(
			<ModalContext.Provider value={modalContextValue({ expenseDateSetter })}>
				<ul>
					<ExpenseItem expense={groceries} />
				</ul>
			</ModalContext.Provider>
		);

		await userEvent.click(screen.getByText("groceries"));

		expect(expenseDateSetter).toHaveBeenCalledWith("2026-07-01T12:30");
	});
});
