
import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { ExpenseType } from "../types/ExpenseType";

const ExpenseTotal = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);
	const expensesTotal = state.expenses?.reduce((total:number, item:ExpenseType) => total + item.cost, 0);


	return (
		<div className="alert alert-primary">
			<span>
				{
					expensesTotal < 0 ?
						`Spent so far: - £${Math.abs(expensesTotal)}`
						:
						`Spent so far: £${expensesTotal}`
				}
			</span>
		</div>
	);
};

export default ExpenseTotal;
