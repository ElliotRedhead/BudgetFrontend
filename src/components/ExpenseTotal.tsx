import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { formatPence } from "../utilities/money";
import { LoadingSpinner } from "./LoadingSpinner";

const ExpenseTotal = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);

	return (
		<div className="alert alert-primary text-center">
			{
				!state.summary ?
					<LoadingSpinner />
					:
					<span>
						{`Spent: ${formatPence(state.summary.total)}`}
					</span>
			}
		</div>
	);
};

export default ExpenseTotal;
