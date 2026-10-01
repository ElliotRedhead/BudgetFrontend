import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { addMonths, monthLabel } from "../utilities/months";

const MonthNavigator = (): JSX.Element => {
	const { state, dispatch } = useContext(ExpenseDataContext);
	const previousMonth = addMonths(state.month, -1);
	const nextMonth = addMonths(state.month, 1);

	return (
		<div className="d-flex align-items-center gap-3 mt-3">
			<button
				type="button"
				className="btn btn-outline-secondary"
				aria-label={`Show ${monthLabel(previousMonth)}`}
				onClick={() => dispatch({ type: "SET_MONTH", payload: previousMonth })}>
				<i
					className="bi bi-chevron-left"
					aria-hidden={true} />
			</button>
			<h2 className="h4 mb-0">
				{monthLabel(state.month)}
			</h2>
			<button
				type="button"
				className="btn btn-outline-secondary"
				aria-label={`Show ${monthLabel(nextMonth)}`}
				onClick={() => dispatch({ type: "SET_MONTH", payload: nextMonth })}>
				<i
					className="bi bi-chevron-right"
					aria-hidden={true} />
			</button>
		</div>
	);
};

export default MonthNavigator;
