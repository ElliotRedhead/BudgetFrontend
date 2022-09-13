import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { ExpenseType } from "../types/ExpenseType";

const Remaining = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);
	const expensesTotal = state.expenses?.reduce((total:number, item:ExpenseType) => total + item.cost, 0);

	const alertType = expensesTotal > state.budget ? "alert-danger" : "alert-success";
	const remainingBudget = state.budget - expensesTotal;

	return (
		<div className={`alert ${alertType}`}>
			<span>
				{
					remainingBudget < 0 ?
						`Remaining: - £${Math.abs(remainingBudget)}`
						:
						`Remaining: £${remainingBudget}`
				}
			</span>
		</div>
	);
};

export default Remaining;
