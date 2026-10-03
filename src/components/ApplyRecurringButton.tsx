import { useContext, useState } from "react";
import { API_ROOT } from "../constants";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import useAxios from "../hooks/useAxios";
import { authHeaders } from "../utilities/authHeaders";
import { monthLabel, toMonthParam } from "../utilities/months";

const ApplyRecurringButton = (): JSX.Element => {
	const { state, refresh } = useContext(ExpenseDataContext);
	const { error, loading, operation } = useAxios();
	const [message, setMessage] = useState<string>();

	const applyRecurringExpenses = async () => {
		setMessage(undefined);
		const applied = await operation({
			method: "post",
			url: `${API_ROOT}/recurring-expenses/apply/`,
			params: { month: toMonthParam(state.month) },
			headers: authHeaders()
		});
		if (applied){
			const addedCount = applied.data.created.length;
			setMessage(addedCount ?
				`Added ${addedCount} recurring ${addedCount === 1 ? "expense" : "expenses"}.` :
				"This month's recurring expenses are already added.");
			if (addedCount){
				refresh();
			}
		}
	};

	return (
		<div className="mt-3">
			<button
				type="button"
				className="btn btn-outline-primary btn-sm"
				disabled={loading}
				onClick={applyRecurringExpenses}>
				{`Add recurring expenses for ${monthLabel(state.month)}`}
			</button>
			<div
				className="small mt-1"
				role="status">
				{message}
				{
					error &&
					<span className="text-danger">
						{error}
					</span>
				}
			</div>
		</div>
	);
};

export default ApplyRecurringButton;
