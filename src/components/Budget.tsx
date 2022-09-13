import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";

const Budget = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);
	const budgetTotal = state.budget;
	return (
		<div className="alert alert-secondary">
			<span>
				{
					budgetTotal < 0 ?
						`Budget: - £${Math.abs(budgetTotal)}`
						:
						`Budget: £${budgetTotal}`
				}
			</span>
		</div>
	);
};
export default Budget;
