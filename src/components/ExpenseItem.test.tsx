import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import ExpenseItem from "./ExpenseItem";

describe("ExpenseItem", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("deletes through the expense's detail URL, with its trailing slash", async () => {
		const request = vi.spyOn(axios, "request").mockResolvedValue({ status: 204 });
		const dispatch = vi.fn();
		render(
			<ExpenseDataContext.Provider value={{ state: { isLoading: false, isErrored: false, budget: 0, expenses: [] }, dispatch }}>
				<ul>
					<ExpenseItem
						key="7"
						id="7"
						name="groceries"
						cost={4235}
						date="2026-09-14T12:00:00Z" />
				</ul>
			</ExpenseDataContext.Provider>
		);

		await userEvent.click(screen.getByRole("button", { name: "Delete groceries" }));

		expect(request).toHaveBeenCalledWith(expect.objectContaining({
			method: "delete",
			url: expect.stringMatching(/\/expenses\/7\/$/)
		}));
		await waitFor(() => expect(dispatch).toHaveBeenCalledWith({ type: "DELETE_EXPENSE", payload: { id: "7" } }));
	});
});
