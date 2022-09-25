import { createContext, ReactChild, ReactFragment, useEffect, useReducer, useState } from "react";
import { API_ROOT } from "../constants";
import useAxios from "../hooks/useAxios";
import { ExpenseType } from "../types/ExpenseType";

const ExpenseDataReducer = (state:ExpenseDataContextType, action: { type:string; payload:ExpenseType }) => {
	const payloadValidation = (payload:ExpenseType) => (
		typeof(payload.id) === "number" &&
		typeof(payload.name) === "string" &&
		typeof(payload.cost) === "number" &&
		typeof(payload.date) === "string"
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


interface ExpenseDataContextType {
	isLoading: boolean;
	isErrored: boolean;
	budget: number;
	expenses: ExpenseType[];
} 
interface ContextType {
	state: ExpenseDataContextType;
	dispatch: React.Dispatch<any>;
}

export const ExpenseDataContext = createContext({} as ContextType);

export const ExpenseDataProvider = (props: { children: ReactChild | ReactFragment }) => {
	const blankState = {
		isLoading: true,
		isErrored: false,
		budget: 2000,
		expenses: [
		]
	};
	const [expenseData, setExpenseData] = useState(blankState);
	const { response, loading, error, operation } = useAxios();
	useEffect(() => {
		if (loading === true){
			expenseData.isLoading = true;
			setExpenseData(expenseData);
		} else {
			if (response?.status !== 200){
				operation({
					method: "get",
					url: `${API_ROOT}/expenses/`,
					headers: {
						"Authorization": `JWT ${localStorage.getItem("access_token")}`
					}
				});
			}
		}
	}, [loading]);

	useEffect(() => {

	}, [error]);

	useEffect(() => {
		if (response !== null && response !== undefined){
			expenseData.expenses = response?.data;
			expenseData.isLoading = false;
			expenseData.isErrored = false;
			setExpenseData(expenseData);
		}
	}, [response, expenseData]);

	const [state, dispatch] = useReducer(ExpenseDataReducer, expenseData);

	return (
		<ExpenseDataContext.Provider value={{ state, dispatch }}>
			{props.children}
		</ExpenseDataContext.Provider>);
};
