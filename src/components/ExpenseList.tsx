import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import ExpenseItem from "./ExpenseItem";

const ExpenseList = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext); 

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
