import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { formatPence } from "../utilities/money";
import { monthLabel } from "../utilities/months";
import { LoadingSpinner } from "./LoadingSpinner";

const Budget = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);
	const { summary } = state;
	const isCarriedOver = summary?.budget_month && summary.budget_month !== summary.month;

	return (
		<div className="alert alert-secondary text-center">
			{
				!summary ?
					<LoadingSpinner />
					:
					<>
						<span>
							{summary.budget === null ? "No budget set" : `Budget: ${formatPence(summary.budget)}`}
						</span>
						{
							isCarriedOver &&
							<div className="small text-muted">
								{`Carried over from ${monthLabel(new Date(`${summary.budget_month}T00:00`))}`}
							</div>
						}
					</>
			}
		</div>
	);
};
export default Budget;
