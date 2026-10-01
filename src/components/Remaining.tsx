import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { formatPence } from "../utilities/money";
import { LoadingSpinner } from "./LoadingSpinner";

const Remaining = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);
	const remaining = state.summary?.remaining ?? null;
	const alertType = remaining !== null && remaining < 0 ? "alert-danger" : "alert-success";

	return (
		<div className={`alert ${alertType} text-center`}>
			{
				!state.summary ?
					<LoadingSpinner />
					:
					<span>
						{remaining === null ? "Set a budget to see what's left" : `Remaining: ${formatPence(remaining)}`}
					</span>
			}
		</div>
	);
};

export default Remaining;
