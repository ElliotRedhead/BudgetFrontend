import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { ExpenseType } from "../types/ExpenseType";

const Remaining = (): JSX.Element => {
	const { state } = useContext(AppContext);
	const totalExpenses = state.expenses.reduce((total:number, item:ExpenseType) => total + item.cost, 0);

	const alertType = totalExpenses > state.budget ? "alert-danger" : "alert-success";

	return (
		<div className={`alert ${alertType}`}>
			<span>
				{`Remaining: £${state.budget-totalExpenses}`}
			</span>
		</div>
	);
};

export default Remaining;
