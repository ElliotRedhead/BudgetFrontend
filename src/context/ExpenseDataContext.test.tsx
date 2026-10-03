import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosRequestConfig } from "axios";
import { useContext } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadedState, septemberExpenses, septemberSummary } from "../test/fixtures";
import { addMonths } from "../utilities/months";
import { ExpenseDataContext, ExpenseDataProvider, ExpenseDataReducer } from "./ExpenseDataContext";

describe("ExpenseDataReducer", () => {
	it("replaces an edited expense without mutating the previous state", () => {
		const previousState = loadedState();
		const editedBus = { id: 2, name: "bus", cost: 300, category: "transport", date: "2026-09-02T08:00:00Z" };

		const nextState = ExpenseDataReducer(previousState, { type: "ADD_EXPENSE", payload: editedBus });

		expect(nextState.expenses).toEqual([septemberExpenses[0], editedBus]);
		expect(previousState.expenses[1].cost).toBe(275);
	});

	it("puts a new expense at the top, like the API's newest-first order", () => {
		const newExpense = { id: 3, name: "coffee", cost: 320, category: "eating_out", date: "2026-09-03T09:00:00Z" };

		const nextState = ExpenseDataReducer(loadedState(), { type: "ADD_EXPENSE", payload: newExpense });

		expect(nextState.expenses.map(expense => expense.id)).toEqual([3, 1, 2]);
	});

	it("ignores a malformed expense rather than deleting anything", () => {
		const previousState = loadedState();
		const malformedExpense = { id: 1, name: "rent", cost: "lots", date: 5 } as never;

		expect(ExpenseDataReducer(previousState, { type: "ADD_EXPENSE", payload: malformedExpense })).toBe(previousState);
	});

	it("removes a deleted expense", () => {
		const nextState = ExpenseDataReducer(loadedState(), { type: "DELETE_EXPENSE", payload: { id: 1 } });

		expect(nextState.expenses.map(expense => expense.id)).toEqual([2]);
	});

	it("appends the next page and remembers whether there's another", () => {
		const nextState = ExpenseDataReducer(loadedState({ nextPage: "/expenses/?page=2" }), {
			type: "APPEND_EXPENSES",
			payload: { count: 3, next: null, previous: "/expenses/", results: [{ id: 9, name: "tea", cost: 150, category: "eating_out", date: "2026-09-04T09:00:00Z" }] }
		});

		expect(nextState.expenses.map(expense => expense.id)).toEqual([1, 2, 9]);
		expect(nextState.nextPage).toBeNull();
	});

	it("clears the summary while a new month loads", () => {
		const october = new Date(2026, 9, 1);

		const nextState = ExpenseDataReducer(loadedState(), { type: "SET_MONTH", payload: october });

		expect(nextState.month).toEqual(october);
		expect(nextState.isLoading).toBe(true);
		expect(nextState.summary).toBeNull();
	});
});

const MonthView = () => {
	const { state, dispatch, loadMore } = useContext(ExpenseDataContext);
	if (state.isErrored){
		return (
			<p>
				Failed
			</p>
		);
	}
	return (
		<>
			<p>
				{state.isLoading ? "Loading" : state.expenses.map(expense => expense.name).join(", ")}
			</p>
			<p>
				{state.summary ? `Total ${state.summary.total}` : "No summary"}
			</p>
			<button
				type="button"
				onClick={() => dispatch({ type: "SET_MONTH", payload: addMonths(state.month, -1) })}>
				Previous
			</button>
			<button
				type="button"
				onClick={loadMore}>
				More
			</button>
		</>
	);
};

const FilterButton = () => {
	const { dispatch } = useContext(ExpenseDataContext);
	return (
		<button
			type="button"
			onClick={() => dispatch({ type: "SET_FILTERS", payload: { search: "bus", category: "transport" } })}>
			Transport named bus
		</button>
	);
};

const renderMonthView = () => render(
	<ExpenseDataProvider>
		<MonthView />
	</ExpenseDataProvider>
);

const apiResponses = (config: AxiosRequestConfig) => {
	if (config.url?.endsWith("/expenses/summary/")){
		return { status: 200, data: septemberSummary };
	}
	if (config.url?.includes("page=2")){
		return { status: 200, data: { count: 3, next: null, previous: null, results: [{ id: 9, name: "tea", cost: 150, category: "eating_out", date: "2026-09-04T09:00:00Z" }] } };
	}
	return { status: 200, data: { count: 3, next: "http://api/expenses/?page=2", previous: null, results: septemberExpenses } };
};

describe("ExpenseDataProvider", () => {
	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("loads the current month's expenses and summary once", async () => {
		vi.useFakeTimers({ toFake: ["Date"] });
		vi.setSystemTime(new Date(2026, 8, 17));
		const request = vi.spyOn(axios, "request").mockImplementation(async config => apiResponses(config));

		renderMonthView();

		expect(await screen.findByText("rent, bus")).toBeInTheDocument();
		expect(await screen.findByText("Total 95275")).toBeInTheDocument();
		expect(request).toHaveBeenCalledTimes(2);
		expect(request).toHaveBeenCalledWith(expect.objectContaining({
			url: expect.stringMatching(/\/expenses\/$/),
			params: { month: "2026-09", page_size: 100 }
		}));
	});

	it("reloads for the chosen month", async () => {
		vi.useFakeTimers({ toFake: ["Date"] });
		vi.setSystemTime(new Date(2026, 8, 17));
		const request = vi.spyOn(axios, "request").mockImplementation(async config => apiResponses(config));
		renderMonthView();
		await screen.findByText("rent, bus");

		await userEvent.click(screen.getByRole("button", { name: "Previous" }));

		await screen.findByText("rent, bus");
		expect(request).toHaveBeenCalledWith(expect.objectContaining({ params: { month: "2026-08", page_size: 100 } }));
		expect(request).toHaveBeenCalledWith(expect.objectContaining({ params: { month: "2026-08" } }));
	});

	it("searches and filters the month's expenses", async () => {
		const request = vi.spyOn(axios, "request").mockImplementation(async config => apiResponses(config));
		render(
			<ExpenseDataProvider>
				<FilterButton />
				<MonthView />
			</ExpenseDataProvider>
		);
		await screen.findByText("rent, bus");
		request.mockClear();

		await userEvent.click(screen.getByRole("button", { name: "Transport named bus" }));

		await screen.findByText("rent, bus");
		expect(request).toHaveBeenCalledTimes(1);
		expect(request).toHaveBeenCalledWith(expect.objectContaining({
			params: expect.objectContaining({ name__icontains: "bus", category: "transport" })
		}));
	});

	it("appends the next page on request", async () => {
		vi.spyOn(axios, "request").mockImplementation(async config => apiResponses(config));
		renderMonthView();
		await screen.findByText("rent, bus");

		await userEvent.click(screen.getByRole("button", { name: "More" }));

		expect(await screen.findByText("rent, bus, tea")).toBeInTheDocument();
	});

	it("shows the failure and doesn't keep retrying", async () => {
		const request = vi.spyOn(axios, "request").mockRejectedValue(new Error("Network Error"));

		renderMonthView();

		expect(await screen.findByText("Failed")).toBeInTheDocument();
		await new Promise(resolve => setTimeout(resolve, 50));
		// One request each for the list and the summary, with no retries.
		expect(request).toHaveBeenCalledTimes(2);
	});
});
