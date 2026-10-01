import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import ModalContext from "../context/ModalContext";
import Form from "react-bootstrap/Form";
import useAxios from "../hooks/useAxios";
import { API_ROOT } from "../constants";
import { validateCost } from "../utilities/validateCost";
import { fromDateTimeInputValue } from "../utilities/dateTimeInput";
import { authHeaders } from "../utilities/authHeaders";

const ExpenseFormModal = ():JSX.Element => {
	const { response, operation } = useAxios();
	const { dispatch, refresh } = useContext(ExpenseDataContext);
	const modalContext = useContext(ModalContext);
	const [name, setName] = useState(modalContext.expenseName);
	const [unvalidatedCost, setUnvalidatedCost] = useState<string>("0.00");
	const [date, setDate] = useState(modalContext.expenseDate);
	const expenseId = modalContext.expenseId;
	const [formEnabled, setFormEnabled] = useState(true);

	useEffect(() => {
		setName(modalContext.expenseName);
		setDate(modalContext.expenseDate);
		setUnvalidatedCost(String((modalContext.expenseCost/100).toFixed(2)));
	}, [modalContext.modalVisibility]);

	useEffect(() => {
		if (response && (response?.status === 200 || response?.status === 201)){
			dispatch({
				type: "ADD_EXPENSE",
				payload: response.data
			});
			refresh();
		}
	}, [response, dispatch, refresh]);

	useEffect(() => {
		if (unvalidatedCost !== undefined){
			if (validateCost(unvalidatedCost)){
				setFormEnabled(true);
			} else {
				setFormEnabled(false);
			}
		}
	}, [unvalidatedCost]);


	const onSubmit = (event: SyntheticEvent) => {
		event.preventDefault();
		if (formEnabled){
			operation({
				method: expenseId ? "patch" : "post",
				url: expenseId ? `${API_ROOT}/expenses/${expenseId}/` : `${API_ROOT}/expenses/`,
				data: {
					"name": name,
					"cost": Math.round(Number(unvalidatedCost)*100),
					"date": fromDateTimeInputValue(date)
				},
				headers: authHeaders()
			});

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
									<label htmlFor="Cost">
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
										type="datetime-local"
										onChange={event => {
											setDate(event.target.value);
										}} 
										value={date} />
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-sm" />
							</div>
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
