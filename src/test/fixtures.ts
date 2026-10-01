import { vi } from "vitest";
import { ExpenseDataContextType } from "../context/ExpenseDataContext";
import { ModalContextType } from "../types/ModalContextType";

export const septemberExpenses = [
	{ id: 1, name: "rent", cost: 95000, date: "2026-09-01T12:00:00Z" },
	{ id: 2, name: "bus", cost: 275, date: "2026-09-02T08:00:00Z" }
];

export const septemberSummary = {
	month: "2026-09-01",
	budget: 200000,
	budget_month: "2026-09-01",
	total: 95275,
	remaining: 104725,
	by_category: [{ category: "housing", total: 95000 }, { category: "transport", total: 275 }]
};

export const loadedState = (overrides: Partial<ExpenseDataContextType> = {}): ExpenseDataContextType => ({
	isLoading: false,
	isErrored: false,
	month: new Date(2026, 8, 1),
	expenses: septemberExpenses,
	nextPage: null,
	summary: septemberSummary,
	...overrides
});

export const expenseDataContextValue = (overrides: Partial<ExpenseDataContextType> = {}) => ({
	state: loadedState(overrides),
	dispatch: vi.fn(),
	refresh: vi.fn(),
	loadMore: vi.fn()
});

export const modalContextValue = (overrides: Partial<ModalContextType> = {}): ModalContextType => ({
	resetContext: vi.fn(),
	modalVisibility: false,
	toggleModalVisibility: vi.fn(),
	expenseId: null,
	expenseIdSetter: vi.fn(),
	expenseName: "",
	expenseNameSetter: vi.fn(),
	expenseCost: 0,
	expenseCostSetter: vi.fn(),
	expenseDate: "",
	expenseDateSetter: vi.fn(),
	...overrides
});
