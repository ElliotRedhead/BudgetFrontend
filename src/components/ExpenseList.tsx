import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ExpenseItem from "./ExpenseItem";

const ExpenseList = (): JSX.Element => {
	const { state } = useContext(AppContext); 

	return (
		<ul className="list-group">
			{state.expenses.map(expense => (
				<ExpenseItem
					key={expense.id}
					id={expense.id}
					name={expense.name}
					cost={expense.cost} />	
			))}
		</ul>
	);
};

export default ExpenseList;
