import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import ModalContext from "../context/ModalContext";
import { expenseDataContextValue, modalContextValue } from "../test/fixtures";
import ExpenseFormModal from "./ExpenseFormModal";

describe("ExpenseFormModal", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("saves a new expense with its category, in pence, then reloads the month", async () => {
		const request = vi.spyOn(axios, "request").mockResolvedValue({
			status: 201,
			data: { id: 9, name: "coffee", cost: 320, category: "eating_out", date: "2026-07-01T07:30:00Z" }
		});
		const dataContext = expenseDataContextValue();
		render(
			<ExpenseDataContext.Provider value={dataContext}>
				<ModalContext.Provider value={modalContextValue({ modalVisibility: true, expenseDate: "2026-07-01T08:30" })}>
					<ExpenseFormModal />
				</ModalContext.Provider>
			</ExpenseDataContext.Provider>
		);

		await userEvent.type(screen.getByLabelText("Name"), "Coffee");
		await userEvent.clear(screen.getByLabelText("Cost (£)"));
		await userEvent.type(screen.getByLabelText("Cost (£)"), "3.20");
		await userEvent.selectOptions(screen.getByLabelText("Category"), "Eating out");
		await userEvent.click(screen.getByRole("button", { name: "Save expense" }));

		expect(request).toHaveBeenCalledWith(expect.objectContaining({
			method: "post",
			url: expect.stringMatching(/\/expenses\/$/),
			data: { name: "Coffee", category: "eating_out", cost: 320, date: "2026-07-01T07:30:00.000Z" }
		}));
		await waitFor(() => expect(dataContext.refresh).toHaveBeenCalled());
	});

	it("updates an existing expense in place", async () => {
		const request = vi.spyOn(axios, "request").mockResolvedValue({ status: 200, data: {} });
		const editingRent = modalContextValue({
			modalVisibility: true,
			expenseId: 4,
			expenseName: "rent",
			expenseCost: 95000,
			expenseCategory: "housing",
			expenseDate: "2026-09-01T13:00"
		});
		render(
			<ExpenseDataContext.Provider value={expenseDataContextValue()}>
				<ModalContext.Provider value={editingRent}>
					<ExpenseFormModal />
				</ModalContext.Provider>
			</ExpenseDataContext.Provider>
		);

		await userEvent.click(screen.getByRole("button", { name: "Save expense" }));

		expect(request).toHaveBeenCalledWith(expect.objectContaining({
			method: "patch",
			url: expect.stringMatching(/\/expenses\/4\/$/),
			data: expect.objectContaining({ cost: 95000, category: "housing" })
		}));
	});
});
