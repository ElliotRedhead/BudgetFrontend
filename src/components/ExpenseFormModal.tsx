import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import ModalContext from "../context/ModalContext";
import { ExpenseType } from "../types/ExpenseType";
import Form from "react-bootstrap/Form";
import useAxios from "../hooks/useAxios";
import { API_ROOT } from "../constants";

const ExpenseFormModal = ():JSX.Element => {
	const { response, loading, error, operation } = useAxios();
	const { dispatch } = useContext(ExpenseDataContext);
	const modalContext = useContext(ModalContext);
	const [name, setName] = useState(modalContext.expenseName);
	const [cost, setCost] = useState(modalContext.expenseCost);
	const [date, setDate] = useState(modalContext.expenseDate);
	const expenseId = modalContext.expenseId;

	useEffect(() => {
		setName(modalContext.expenseName);
		setCost(modalContext.expenseCost);
		setDate(modalContext.expenseDate);
	}, [modalContext.modalVisibility]);


	const onSubmit = (event: SyntheticEvent) => {
		event.preventDefault();
		const expense:ExpenseType = {
			id: expenseId,
			name: name,
			cost: cost,
			date: date
		};

		let url = `${API_ROOT}/expenses/`;
		let method = "post";
		if (expenseId){
			url = `${API_ROOT}/expenses/${expense.id}/`;
			method = "patch";
		}
		operation({
			method: method,
			url: url,
			data: {
				"name": expense.name,
				"cost": expense.cost,
				"date": expense.date
			},
			headers: { "Authorization": `JWT ${localStorage.getItem("access_token")}` }
		});


		if (response && (response?.status === 201 || response?.status === 204)){
			dispatch({
				type: "ADD_EXPENSE",
				payload: expense
			});
		}

		modalContext.toggleModalVisibility();
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
										Cost
									</label>
									<input
										required={true}
										type="text"
										className="form-control"
										id="cost"
										value={cost && cost > 0 ? cost.toString() : ""}
										onChange={event => setCost(parseInt(event.target.value))} />
								</div>
								<div className="col-sm">
									<label htmlFor="date">
										Date
									</label>
									<Form.Control
										type="datetime-local"
										onChange={event => {
											setDate(new Date(event.target.value).toISOString().substring(0, 16));
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
