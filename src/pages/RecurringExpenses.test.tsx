import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosRequestConfig } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import RecurringExpenses from "./RecurringExpenses";

const rent = { id: 1, name: "rent", category: "housing", cost: 95000, day_of_month: 1, active: true };

const listResponse = (results: object[]) => ({ status: 200, data: { count: results.length, next: null, previous: null, results } });

describe("RecurringExpenses page", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("lists recurring expenses with their day and cost", async () => {
		vi.spyOn(axios, "request").mockResolvedValue(listResponse([rent]));

		render(<RecurringExpenses />);

		expect(await screen.findByText("Housing, day 1 of each month")).toBeInTheDocument();
		expect(screen.getByText("£950.00")).toBeInTheDocument();
		expect(screen.getByRole("switch", { name: "rent active" })).toBeChecked();
	});

	it("adds a recurring expense in pence and reloads the list", async () => {
		const request = vi.spyOn(axios, "request").mockImplementation(async (config: AxiosRequestConfig) => (
			config.method === "post" ? { status: 201, data: {} } : listResponse([])
		));
		render(<RecurringExpenses />);
		await screen.findByText("No recurring expenses yet.");

		await userEvent.type(screen.getByLabelText("Name"), "Gym");
		await userEvent.selectOptions(screen.getByLabelText("Category"), "Leisure");
		await userEvent.type(screen.getByLabelText("Cost (£)"), "35.00");
		await userEvent.selectOptions(screen.getByLabelText("Day of month"), "25");
		await userEvent.click(screen.getByRole("button", { name: "Add" }));

		expect(request).toHaveBeenCalledWith(expect.objectContaining({
			method: "post",
			data: { name: "Gym", category: "leisure", cost: 3500, day_of_month: 25 }
		}));
		await waitFor(() => expect(request).toHaveBeenCalledTimes(3));
	});

	it("pauses a recurring expense", async () => {
		const request = vi.spyOn(axios, "request").mockImplementation(async (config: AxiosRequestConfig) => (
			config.method === "patch" ? { status: 200, data: {} } : listResponse([rent])
		));
		render(<RecurringExpenses />);

		await userEvent.click(await screen.findByRole("switch", { name: "rent active" }));

		expect(request).toHaveBeenCalledWith(expect.objectContaining({
			method: "patch",
			url: expect.stringMatching(/\/recurring-expenses\/1\/$/),
			data: { active: false }
		}));
	});
});
