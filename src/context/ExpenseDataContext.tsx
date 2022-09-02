import { createContext, ReactChild, ReactFragment, useEffect, useReducer, useState } from "react";
import { API_ROOT } from "../constants";
import useAxios from "../hooks/useAxios";
import { ExpenseType } from "../types/ExpenseType";

const ExpenseDataReducer = (state:InitialStateType, action: { type:string; payload:ExpenseType }) => {
	const payloadValidation = (payload:ExpenseType) => (
		typeof(payload.id) === "string" &&
		typeof(payload.name) === "string" &&
		typeof(payload.cost) === "number"
	);

	let existingExpense = false;
	switch (action.type){
	case "ADD_EXPENSE":
		if (payloadValidation(action.payload)){
			state.expenses?.forEach((expense, index) => {
				// Update existing expense
				if (expense.id === action.payload.id) {
					existingExpense = true;
					state.expenses[index] = action.payload;
				}
			});

			if (!existingExpense){
			// Add new expense
				state.expenses.push(action.payload);
			}

			return {
				...state,
				expenses: state.expenses
			};
		}

		/* no-fallthrough */
	case "DELETE_EXPENSE":
		return {
			...state,
			expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
		};
	default:
		return state;
	}
};

interface ContextType {
	state: InitialStateType;
	dispatch: React.Dispatch<any>;
}

interface InitialStateType {
	budget: number;
	expenses: ExpenseType[];
} 

export const ExpenseDataContext = createContext({} as ContextType);

export const ExpenseDataProvider = (props: { children: ReactChild | ReactFragment }) => {
	const blankState = {
		budget: 2000,
		expenses: [
		]
	};
	const [initialState, setInitialState] = useState(blankState);
	const { response, loading, error, operation } = useAxios();
	useEffect(() => {
		const fetchExpenses = () => {
			operation({
				method: "get",
				url: `${API_ROOT}/expenses/`,
				headers: {
					"Authorization": `JWT ${localStorage.getItem("access_token")}`
				}
			});
		};
		fetchExpenses();
	}, []);

	useEffect(() => {
		if (response !== null && response !== undefined){
			initialState.expenses = response?.data;
			setInitialState(response?.data);
		}
	}, [response, initialState]);

	const [state, dispatch] = useReducer(ExpenseDataReducer, initialState);

	return (
		<ExpenseDataContext.Provider value={{ state, dispatch }}>
			{props.children}
		</ExpenseDataContext.Provider>);
};
