import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { ExpenseType } from "../types/ExpenseType";

const ExpenseTotal = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);
	const totalExpenses = state.expenses.reduce((total:number, item:ExpenseType) => total + item.cost, 0);

	return (
		<div className="alert alert-primary">
			<span>
				{`Spent so far: £${totalExpenses}`}
			</span>
		</div>
	);
};

export default ExpenseTotal;
