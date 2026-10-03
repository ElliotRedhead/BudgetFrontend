import { createContext, ReactNode, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { API_ROOT } from "../constants";
import useAxios from "../hooks/useAxios";
import { ExpenseType } from "../types/ExpenseType";
import { PaginatedResponse } from "../types/PaginatedResponse";
import { MonthlySummary } from "../types/SummaryType";
import { authHeaders } from "../utilities/authHeaders";
import { startOfMonth, toMonthParam } from "../utilities/months";

// The API's largest page, so a typical month arrives in one request.
const PAGE_SIZE = 100;

export interface ExpenseFilters {
	search: string;
	category: string;
}

export interface ExpenseDataContextType {
	isLoading: boolean;
	isErrored: boolean;
	month: Date;
	filters: ExpenseFilters;
	expenses: ExpenseType[];
	nextPage: string | null;
	summary: MonthlySummary | null;
}

type ExpenseDataAction =
	| { type: "SET_MONTH"; payload: Date }
	| { type: "SET_FILTERS"; payload: ExpenseFilters }
	| { type: "SET_EXPENSES"; payload: PaginatedResponse<ExpenseType> }
	| { type: "APPEND_EXPENSES"; payload: PaginatedResponse<ExpenseType> }
	| { type: "SET_SUMMARY"; payload: MonthlySummary }
	| { type: "ADD_EXPENSE"; payload: ExpenseType }
	| { type: "DELETE_EXPENSE"; payload: { id?: number } }
	| { type: "LOAD_FAILED" };

const isValidExpense = (payload: ExpenseType) => typeof (payload.id) === "number" &&
	typeof (payload.name) === "string" &&
	typeof (payload.cost) === "number" &&
	typeof (payload.date) === "string";

export const ExpenseDataReducer = (state: ExpenseDataContextType, action: ExpenseDataAction): ExpenseDataContextType => {
	switch (action.type){
	case "SET_MONTH":
		return { ...state, month: action.payload, isLoading: true, summary: null };
	case "SET_FILTERS":
		return { ...state, filters: action.payload, isLoading: true };
	case "SET_EXPENSES":
		return {
			...state,
			isLoading: false,
			isErrored: false,
			expenses: action.payload.results,
			nextPage: action.payload.next
		};
	case "APPEND_EXPENSES":
		return {
			...state,
			expenses: [...state.expenses, ...action.payload.results],
			nextPage: action.payload.next
		};
	case "SET_SUMMARY":
		return { ...state, summary: action.payload };
	case "ADD_EXPENSE": {
		if (!isValidExpense(action.payload)){
			return state;
		}
		const isExistingExpense = state.expenses.some(expense => expense.id === action.payload.id);
		return {
			...state,
			expenses: isExistingExpense ?
				state.expenses.map(expense => expense.id === action.payload.id ? action.payload : expense) :
				[action.payload, ...state.expenses]
		};
	}
	case "DELETE_EXPENSE":
		return {
			...state,
			expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
		};
	case "LOAD_FAILED":
		return { ...state, isLoading: false, isErrored: true };
	default:
		return state;
	}
};

interface ContextType {
	state: ExpenseDataContextType;
	dispatch: React.Dispatch<ExpenseDataAction>;

	/** Reload the month's expenses and summary, e.g. after a change. */
	refresh: () => void;

	/** Fetch the next page of expenses, if there is one. */
	loadMore: () => void;
}

export const ExpenseDataContext = createContext({} as ContextType);

export const ExpenseDataProvider = (props: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(ExpenseDataReducer, {
		isLoading: true,
		isErrored: false,
		month: startOfMonth(new Date()),
		filters: { search: "", category: "" },
		expenses: [],
		nextPage: null,
		summary: null
	});
	const [reloadCount, setReloadCount] = useState(0);
	const expenseRequest = useAxios();
	const nextPageRequest = useAxios();
	const summaryRequest = useAxios();

	useEffect(() => {
		const month = toMonthParam(state.month);
		summaryRequest.operation({
			method: "get",
			url: `${API_ROOT}/expenses/summary/`,
			params: { month },
			headers: authHeaders()
		});
	// Reload when the month changes or a refresh is requested.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.month, reloadCount]);

	useEffect(() => {
		const { search, category } = state.filters;
		expenseRequest.operation({
			method: "get",
			url: `${API_ROOT}/expenses/`,
			params: {
				month: toMonthParam(state.month),
				page_size: PAGE_SIZE,
				...(search && { name__icontains: search }),
				...(category && { category })
			},
			headers: authHeaders()
		});
	// Reload when the month or filters change, or a refresh is requested.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.month, state.filters, reloadCount]);

	useEffect(() => {
		if (expenseRequest.response){
			dispatch({ type: "SET_EXPENSES", payload: expenseRequest.response.data });
		}
	}, [expenseRequest.response]);

	useEffect(() => {
		if (nextPageRequest.response){
			dispatch({ type: "APPEND_EXPENSES", payload: nextPageRequest.response.data });
		}
	}, [nextPageRequest.response]);

	useEffect(() => {
		if (summaryRequest.response){
			dispatch({ type: "SET_SUMMARY", payload: summaryRequest.response.data });
		}
	}, [summaryRequest.response]);

	useEffect(() => {
		if (expenseRequest.error){
			dispatch({ type: "LOAD_FAILED" });
		}
	}, [expenseRequest.error]);

	const refresh = useCallback(() => setReloadCount(count => count + 1), []);
	const { operation: requestNextPage } = nextPageRequest;
	const loadMore = useCallback(() => {
		if (state.nextPage){
			requestNextPage({ method: "get", url: state.nextPage, headers: authHeaders() });
		}
	}, [state.nextPage, requestNextPage]);

	const contextValue = useMemo(() => ({ state, dispatch, refresh, loadMore }), [state, refresh, loadMore]);

	return (
		<ExpenseDataContext.Provider value={contextValue}>
			{props.children}
		</ExpenseDataContext.Provider>);
};
