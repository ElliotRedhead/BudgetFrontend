import { FormEvent, useEffect, useState } from "react";
import { API_ROOT, CATEGORIES, categoryLabel } from "../constants";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useAxios from "../hooks/useAxios";
import { RecurringExpenseType } from "../types/RecurringExpenseType";
import { authHeaders } from "../utilities/authHeaders";
import { formatPence } from "../utilities/money";

const RECURRING_URL = `${API_ROOT}/recurring-expenses/`;
const POUNDS_PATTERN = /^\d+(\.\d{2})?$/;

const RecurringExpenses = (): JSX.Element => {
	const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpenseType[]>();
	const [name, setName] = useState("");
	const [category, setCategory] = useState("other");
	const [cost, setCost] = useState("");
	const [dayOfMonth, setDayOfMonth] = useState("1");
	const [reloadCount, setReloadCount] = useState(0);
	const listRequest = useAxios();
	const changeRequest = useAxios();
	const { operation: requestList } = listRequest;
	const isFormValid = name.trim() !== "" && POUNDS_PATTERN.test(cost);

	const loadRecurringExpenses = () => setReloadCount(count => count + 1);

	useEffect(() => {
		let isCurrent = true;
		requestList({
			method: "get",
			url: RECURRING_URL,
			params: { page_size: 100 },
			headers: authHeaders()
		}).then(loaded => {
			if (loaded && isCurrent){
				setRecurringExpenses(loaded.data.results);
			}
		});
		return () => {
			isCurrent = false;
		};
	}, [requestList, reloadCount]);

	const addRecurringExpense = async (event: FormEvent) => {
		event.preventDefault();
		const created = await changeRequest.operation({
			method: "post",
			url: RECURRING_URL,
			data: {
				name,
				category,
				cost: Math.round(Number(cost) * 100),
				day_of_month: Number(dayOfMonth)
			},
			headers: authHeaders()
		});
		if (created){
			setName("");
			setCost("");
			loadRecurringExpenses();
		}
	};

	const setActive = async (recurringExpense: RecurringExpenseType, active: boolean) => {
		const updated = await changeRequest.operation({
			method: "patch",
			url: `${RECURRING_URL}${recurringExpense.id}/`,
			data: { active },
			headers: authHeaders()
		});
		if (updated){
			loadRecurringExpenses();
		}
	};

	const deleteRecurringExpense = async (recurringExpense: RecurringExpenseType) => {
		const deleted = await changeRequest.operation({
			method: "delete",
			url: `${RECURRING_URL}${recurringExpense.id}/`,
			headers: authHeaders()
		});
		if (deleted){
			loadRecurringExpenses();
		}
	};

	return (
		<div className="container">
			<h1 className="mt-3">
				Recurring expenses
			</h1>
			<p className="text-muted">
				Bills that repeat every month. Add them to a month from the Expenses page.
			</p>
			{
				(listRequest.error || changeRequest.error) &&
				<div
					className="alert alert-danger"
					role="alert">
					{listRequest.error ?? changeRequest.error}
				</div>
			}
			{
				!recurringExpenses ?
					<LoadingSpinner />
					:
					<ul className="list-group mb-4">
						{recurringExpenses.length === 0 &&
							<li className="list-group-item text-muted">
								No recurring expenses yet.
							</li>}
						{recurringExpenses.map(recurringExpense => (
							<li
								key={recurringExpense.id}
								className="list-group-item d-flex flex-wrap align-items-center gap-3">
								<div className="flex-grow-1">
									<div className="text-capitalize">
										{recurringExpense.name}
									</div>
									<div className="small text-muted">
										{`${categoryLabel(recurringExpense.category)}, day ${recurringExpense.day_of_month} of each month`}
									</div>
								</div>
								<span className="badge rounded-pill bg-primary">
									{formatPence(recurringExpense.cost)}
								</span>
								<div className="form-check form-switch mb-0">
									<input
										id={`active-${recurringExpense.id}`}
										className="form-check-input"
										type="checkbox"
										role="switch"
										aria-label={`${recurringExpense.name} active`}
										checked={recurringExpense.active}
										onChange={event => setActive(recurringExpense, event.target.checked)} />
									<label
										className="form-check-label"
										htmlFor={`active-${recurringExpense.id}`}>
										Active
									</label>
								</div>
								<button
									type="button"
									className="btn btn-outline-danger btn-sm"
									aria-label={`Delete ${recurringExpense.name}`}
									onClick={() => deleteRecurringExpense(recurringExpense)}>
									Delete
								</button>
							</li>
						))}
					</ul>
			}
			<h2 className="h4">
				Add a recurring expense
			</h2>
			<form
				className="row g-2 align-items-end mb-5"
				onSubmit={addRecurringExpense}>
				<div className="col-sm-4">
					<label
						htmlFor="recurring-name"
						className="form-label">
						Name
					</label>
					<input
						id="recurring-name"
						className="form-control"
						maxLength={30}
						value={name}
						onChange={event => setName(event.target.value)} />
				</div>
				<div className="col-sm-3">
					<label
						htmlFor="recurring-category"
						className="form-label">
						Category
					</label>
					<select
						id="recurring-category"
						className="form-select"
						value={category}
						onChange={event => setCategory(event.target.value)}>
						{CATEGORIES.map(option => (
							<option
								key={option.value}
								value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
				<div className="col-sm-2">
					<label
						htmlFor="recurring-cost"
						className="form-label">
						Cost (£)
					</label>
					<input
						id="recurring-cost"
						className="form-control"
						inputMode="decimal"
						value={cost}
						onChange={event => setCost(event.target.value)} />
				</div>
				<div className="col-sm-2">
					<label
						htmlFor="recurring-day"
						className="form-label">
						Day of month
					</label>
					<select
						id="recurring-day"
						className="form-select"
						value={dayOfMonth}
						onChange={event => setDayOfMonth(event.target.value)}>
						{Array.from({ length: 28 }, (_, index) => String(index + 1)).map(day => (
							<option
								key={day}
								value={day}>
								{day}
							</option>
						))}
					</select>
				</div>
				<div className="col-sm-1">
					<button
						type="submit"
						className="btn btn-primary w-100"
						disabled={!isFormValid || changeRequest.loading}>
						Add
					</button>
				</div>
			</form>
		</div>
	);
};

export default RecurringExpenses;
