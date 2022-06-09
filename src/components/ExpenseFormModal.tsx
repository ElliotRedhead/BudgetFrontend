import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import ModalContext from "../context/ModalContext";
import { v4 as uuidv4 } from "uuid";

const ExpenseFormModal = ():JSX.Element => {
	const { dispatch } = useContext(ExpenseDataContext);
	const modalContext = useContext(ModalContext);
	const [name, setName] = useState(modalContext.expenseName);
	const [cost, setCost] = useState<number | null>(modalContext.expenseCost);
	const expenseId = modalContext.expenseId;

	useEffect(() => {
		setName(modalContext.expenseName);
		setCost(modalContext.expenseCost);
	}, [modalContext.modalVisibility]);

	const onSubmit = (event: SyntheticEvent) => {
		event.preventDefault();
		const expense = {
			id: expenseId || uuidv4(),
			name: name,
			cost: cost
		};

		dispatch({
			type: "ADD_EXPENSE",
			payload: expense
		});

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
										value={cost ? cost.toString() : 0}
										onChange={event => setCost(parseInt(event.target.value))} />
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
