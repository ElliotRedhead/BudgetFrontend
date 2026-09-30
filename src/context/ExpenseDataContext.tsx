import { createContext, ReactNode, useEffect, useMemo, useReducer } from "react";
import { API_ROOT } from "../constants";
import useAxios from "../hooks/useAxios";
import { ExpenseType } from "../types/ExpenseType";

interface ExpenseDataContextType {
	isLoading: boolean;
	isErrored: boolean;
	budget: number;
	expenses: ExpenseType[];
}

type ExpenseDataAction =
	| { type: "SET_EXPENSES"; payload: ExpenseType[] }
	| { type: "ADD_EXPENSE"; payload: ExpenseType }
	| { type: "DELETE_EXPENSE"; payload: { id?: string } }
	| { type: "LOAD_FAILED" };

const isValidExpense = (payload: ExpenseType) => (
	typeof (payload.id) === "number" || typeof (payload.id) === "string"
) &&
	typeof (payload.name) === "string" &&
	typeof (payload.cost) === "number" &&
	typeof (payload.date) === "string";

export const ExpenseDataReducer = (state: ExpenseDataContextType, action: ExpenseDataAction): ExpenseDataContextType => {
	switch (action.type){
	case "SET_EXPENSES":
		return { ...state, isLoading: false, isErrored: false, expenses: action.payload };
	case "ADD_EXPENSE": {
		if (!isValidExpense(action.payload)){
			return state;
		}
		const isExistingExpense = state.expenses.some(expense => expense.id === action.payload.id);
		return {
			...state,
			expenses: isExistingExpense ?
				state.expenses.map(expense => expense.id === action.payload.id ? action.payload : expense) :
				[...state.expenses, action.payload]
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
}

export const ExpenseDataContext = createContext({} as ContextType);

const initialState: ExpenseDataContextType = {
	isLoading: true,
	isErrored: false,
	budget: 2000,
	expenses: []
};

export const ExpenseDataProvider = (props: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(ExpenseDataReducer, initialState);
	const { response, error, operation } = useAxios();

	useEffect(() => {
		operation({
			method: "get",
			url: `${API_ROOT}/expenses/`,
			headers: {
				"Authorization": `JWT ${localStorage.getItem("access_token")}`
			}
		});
	// Load once when the page mounts.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (response){
			dispatch({ type: "SET_EXPENSES", payload: response.data });
		}
	}, [response]);

	useEffect(() => {
		if (error){
			dispatch({ type: "LOAD_FAILED" });
		}
	}, [error]);

	const contextValue = useMemo(() => ({ state, dispatch }), [state]);

	return (
		<ExpenseDataContext.Provider value={contextValue}>
			{props.children}
		</ExpenseDataContext.Provider>);
};
