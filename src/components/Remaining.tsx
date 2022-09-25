import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { ExpenseType } from "../types/ExpenseType";
import { LoadingSpinner } from "./LoadingSpinner";

const Remaining = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);
	const expensesTotal = (state.expenses?.reduce((total:number, item:ExpenseType) => total + Number(item.cost), 0))/100;

	const alertType = expensesTotal > state.budget ? "alert-danger" : "alert-success";
	const remainingBudget = state.budget - expensesTotal;

	return (
		<div className={`alert ${alertType} text-center`}>
			{
				state.isLoading ?
					<LoadingSpinner />
					:
					<span>
						{
							remainingBudget < 0 ?
								`Remaining: - £${Math.abs(remainingBudget)}`
								:
								`Remaining: £${remainingBudget}`
						}
					</span>
			}
		</div>
	);
};

export default Remaining;
