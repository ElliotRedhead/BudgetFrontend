import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import ExpenseItem from "./ExpenseItem";
import { LoadingSpinner } from "./LoadingSpinner";

const ExpenseList = (): JSX.Element => {
	const { state, loadMore } = useContext(ExpenseDataContext);

	if (state.isLoading){
		return <LoadingSpinner />;
	}
	if (state.isErrored){
		return (
			<div
				className="alert alert-danger"
				role="alert">
				Your expenses couldn&apos;t be loaded. Please try again.
			</div>
		);
	}
	if (!state.expenses.length){
		return (
			<p className="text-muted">
				No expenses this month yet.
			</p>
		);
	}
	return (
		<>
			<ul className="list-group">
				{state.expenses.map(expense => (
					<ExpenseItem
						key={expense.id}
						expense={expense} />
				))}
			</ul>
			{
				state.nextPage &&
				<button
					type="button"
					className="btn btn-link mt-2"
					onClick={loadMore}>
					Show more
				</button>
			}
		</>
	);
};

export default ExpenseList;
