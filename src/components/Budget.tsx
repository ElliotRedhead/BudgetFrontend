import { FormEvent, useContext, useState } from "react";
import { API_ROOT } from "../constants";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import useAxios from "../hooks/useAxios";
import { authHeaders } from "../utilities/authHeaders";
import { formatPence } from "../utilities/money";
import { monthLabel, toMonthParam } from "../utilities/months";
import { LoadingSpinner } from "./LoadingSpinner";

const POUNDS_PATTERN = /^\d+(\.\d{2})?$/;

const Budget = (): JSX.Element => {
	const { state, refresh } = useContext(ExpenseDataContext);
	const { summary, month } = state;
	const [isEditing, setIsEditing] = useState(false);
	const [amount, setAmount] = useState("");
	const { error, loading, operation } = useAxios();
	const isCarriedOver = summary?.budget_month && summary.budget_month !== summary.month;
	const isAmountValid = POUNDS_PATTERN.test(amount);

	const startEditing = () => {
		setAmount(summary?.budget === null || !summary ? "" : (summary.budget / 100).toFixed(2));
		setIsEditing(true);
	};

	const saveBudget = async (event: FormEvent) => {
		event.preventDefault();
		const monthStart = `${toMonthParam(month)}-01`;
		const pence = Math.round(Number(amount) * 100);
		const existingBudgets = await operation({
			method: "get",
			url: `${API_ROOT}/budgets/`,
			params: { month: monthStart },
			headers: authHeaders()
		});
		if (!existingBudgets){
			return;
		}
		const existingBudget = existingBudgets.data.results[0];
		const saved = await operation({
			method: existingBudget ? "patch" : "post",
			url: existingBudget ? `${API_ROOT}/budgets/${existingBudget.id}/` : `${API_ROOT}/budgets/`,
			data: { month: monthStart, amount: pence },
			headers: authHeaders()
		});
		if (saved){
			setIsEditing(false);
			refresh();
		}
	};

	if (!summary){
		return (
			<div className="alert alert-secondary text-center">
				<LoadingSpinner />
			</div>
		);
	}

	if (isEditing){
		return (
			<form
				className="alert alert-secondary"
				onSubmit={saveBudget}>
				<label
					htmlFor="budget-input"
					className="form-label">
					{`Budget for ${monthLabel(month)} (£)`}
				</label>
				<input
					id="budget-input"
					className="form-control"
					inputMode="decimal"
					value={amount}
					onChange={event => setAmount(event.target.value)} />
				{
					error &&
					<div
						className="small text-danger mt-1"
						role="alert">
						{error}
					</div>
				}
				<div className="d-flex gap-2 mt-2">
					<button
						type="submit"
						className="btn btn-primary btn-sm"
						disabled={!isAmountValid || loading}>
						Save budget
					</button>
					<button
						type="button"
						className="btn btn-outline-secondary btn-sm"
						onClick={() => setIsEditing(false)}>
						Cancel
					</button>
				</div>
			</form>
		);
	}

	return (
		<div className="alert alert-secondary text-center">
			<span>
				{summary.budget === null ? "No budget set" : `Budget: ${formatPence(summary.budget)}`}
			</span>
			{
				isCarriedOver &&
				<div className="small text-muted">
					{`Carried over from ${monthLabel(new Date(`${summary.budget_month}T00:00`))}`}
				</div>
			}
			<button
				type="button"
				className="btn btn-link btn-sm d-block mx-auto"
				onClick={startEditing}>
				{summary.budget === null || isCarriedOver ? `Set budget for ${monthLabel(month)}` : "Edit budget"}
			</button>
		</div>
	);
};
export default Budget;
