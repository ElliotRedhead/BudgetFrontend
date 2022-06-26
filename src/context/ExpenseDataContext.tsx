import { createContext, ReactChild, ReactFragment, useReducer } from "react";
import { ExpenseType } from "../types/ExpenseType";

const ExpenseDataReducer = (state:InitialStateType, action: { type:string; payload:ExpenseType }) => {
	let existingExpense = false;
	switch (action.type){
	case "ADD_EXPENSE":
		state.expenses.forEach((expense, index) => {
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

const initialState = {
	budget: 2000,
	expenses: [
		{
			id: "ecb52fa2-1b85-4eca-93b4-a6f9e97c75b0",
			name: "Shopping",
			cost: 50
		},
		{
			id: "9d3916f3-fa18-414a-9b51-e4814255aeb3",
			name: "Holiday",
			cost: 300
		},
		{
			id: "d5cbef88-f972-4bbc-94ff-ab59bff1a9aa",
			name: "Transportation",
			cost: 70
		},
		{
			id: "c123bc53-97b9-4e9f-a088-b3557fbe8b85",
			name: "Fuel",
			cost: 40
		},
		{
			id: "0a5e3c88-7fe9-447f-8b4b-27f10d2a98cc",
			name: "Utilities",
			cost: 110
		}
	]
};

export const ExpenseDataContext = createContext({} as ContextType);


export const ExpenseDataProvider = (props: { children: ReactChild | ReactFragment }) => {
	const [state, dispatch] = useReducer(ExpenseDataReducer, initialState);

	return (
		<ExpenseDataContext.Provider value={{ state, dispatch }}>
			{props.children}
		</ExpenseDataContext.Provider>);
};
