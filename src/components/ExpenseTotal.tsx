
import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { ExpenseType } from "../types/ExpenseType";
import { LoadingSpinner } from "./LoadingSpinner";

const ExpenseTotal = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);
	const expensesTotal = (state.expenses?.reduce((total:number, item:ExpenseType) => total + Number(item.cost), 0))/100;


	return (
		<div className="alert alert-primary text-center">
			{
				state.isLoading ?
					<LoadingSpinner />
					:
					<span>
						{
							expensesTotal < 0 ?
								`Spent so far: - £${Math.abs(expensesTotal)}`
								:
								`Spent so far: £${expensesTotal}`
						}
					</span>
			}
		</div>
	);
};

export default ExpenseTotal;
