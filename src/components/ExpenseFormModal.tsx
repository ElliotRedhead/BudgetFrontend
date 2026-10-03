import { SyntheticEvent, useContext, useState } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import ModalContext from "../context/ModalContext";
import Form from "react-bootstrap/Form";
import useAxios from "../hooks/useAxios";
import { API_ROOT, CATEGORIES } from "../constants";
import { validateCost } from "../utilities/validateCost";
import { fromDateTimeInputValue } from "../utilities/dateTimeInput";
import { authHeaders } from "../utilities/authHeaders";

const ExpenseFormModal = ():JSX.Element => {
	const { error, loading, operation } = useAxios();
	const { dispatch, refresh } = useContext(ExpenseDataContext);
	const modalContext = useContext(ModalContext);
	// The page remounts this form each time it opens, so these start from the
	// expense being edited (or blank values for a new one).
	const [name, setName] = useState(modalContext.expenseName);
	const [unvalidatedCost, setUnvalidatedCost] = useState((modalContext.expenseCost / 100).toFixed(2));
	const [category, setCategory] = useState(modalContext.expenseCategory);
	const [date, setDate] = useState(modalContext.expenseDate);
	const expenseId = modalContext.expenseId;
	const formEnabled = validateCost(unvalidatedCost) && !loading;

	const onSubmit = async (event: SyntheticEvent) => {
		event.preventDefault();
		if (!formEnabled){
			return;
		}
		const saved = await operation({
			method: expenseId ? "patch" : "post",
			url: expenseId ? `${API_ROOT}/expenses/${expenseId}/` : `${API_ROOT}/expenses/`,
			data: {
				"name": name,
				"category": category,
				"cost": Math.round(Number(unvalidatedCost)*100),
				"date": fromDateTimeInputValue(date)
			},
			headers: authHeaders()
		});
		if (saved){
			dispatch({ type: "ADD_EXPENSE", payload: saved.data });
			refresh();
			modalContext.toggleModalVisibility();
		}
	};

	return (
		<div
			className={`modal ${modalContext.modalVisibility && "d-flex"}`}
			tabIndex={-1}>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">
							Expense Details
						</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
							onClick={() => {
								modalContext.toggleModalVisibility();
								modalContext.resetContext();
							}} />
					</div>
					<div className="modal-body">
						<form onSubmit={onSubmit}>
							<div className="row">
								<div className="col-sm">
									<label htmlFor="name">
										Name
									</label>
									<input
										required={true}
										type="text"
										className="form-control"
										id="name"
										value={name}
										onChange={event => setName(event.target.value)} />
								</div>
								<div className="col-sm">
									<label htmlFor="cost">
										Cost (£)
									</label>
									<input
										required={true}
										type="text"
										className="form-control"
										id="cost"
										value={unvalidatedCost}
										onChange={event => {
											setUnvalidatedCost(event.target.value);
										}} />
								</div>
								<div className="col-sm">
									<label htmlFor="date">
										Date
									</label>
									<Form.Control
										id="date"
										type="datetime-local"
										onChange={event => {
											setDate(event.target.value);
										}} 
										value={date} />
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-sm">
									<label htmlFor="category">
										Category
									</label>
									<select
										id="category"
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
							</div>
							{
								error &&
								<div
									className="alert alert-danger mt-3 mb-0"
									role="alert">
									{error}
								</div>
							}
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									data-bs-dismiss="modal"
									onClick={() => {
										modalContext.toggleModalVisibility();
										modalContext.resetContext();
									}}>
									Close
								</button>
								<input
									type="submit"
									disabled={!formEnabled}
									className="btn btn-primary"
									value="Save expense" />
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExpenseFormModal;
