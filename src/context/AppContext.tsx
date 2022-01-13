import { createContext, ReactChild, ReactFragment, useReducer } from "react";
import { ExpenseType } from "../types/ExpenseType";

const AppReducer = (state:InitialStateType, action: { type:string; payload:any }) => {
	switch (action.type){
	case "ADD_EXPENSE":
		return {
			...state,
			expenses: [...state.expenses, action.payload]
		};
	case "DELETE_EXPENSE":
		return {
			...state,
			expenses: state.expenses.filter(expense => expense.id !== action.payload)
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
			id: 123123,
			name: "Shopping",
			cost: 50
		},
		{
			id: 123124,
			name: "Holiday",
			cost: 300
		},
		{
			id: 123125,
			name: "Transportation",
			cost: 70
		},
		{
			id: 123126,
			name: "Fuel",
			cost: 40
		},
		{
			id: 123127,
			name: "Utilities",
			cost: 110
		}
	]
};

export const AppContext = createContext({} as ContextType);


export const AppProvider = (props: { children: ReactChild | ReactFragment }) => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{props.children}
		</AppContext.Provider>);
};
