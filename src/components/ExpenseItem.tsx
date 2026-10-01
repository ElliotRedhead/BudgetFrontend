import { useContext, useEffect, useState } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { TiDelete, TiPencil } from "react-icons/ti";
import ModalContext from "../context/ModalContext";
import useAxios from "../hooks/useAxios";
import { API_ROOT } from "../constants";
import { ExpenseType } from "../types/ExpenseType";
import { authHeaders } from "../utilities/authHeaders";
import { toDateTimeInputValue } from "../utilities/dateTimeInput";
import { formatPence } from "../utilities/money";

interface ExpenseProps {
	expense: ExpenseType
}

const ExpenseItem = ({ expense }: ExpenseProps): JSX.Element => {
	const [editButtonVisibility, setEditButtonVisibility] = useState(false);
	const { dispatch, refresh } = useContext(ExpenseDataContext);
	const modalContext = useContext(ModalContext);

	const { id, name, cost, date } = expense;
	const parsedDate = (new Date(date)).toLocaleDateString();

	const editOnClickHandler = () => {
		setEditButtonVisibility(false);
		modalContext.expenseIdSetter(id ?? null);
		modalContext.expenseNameSetter(name);
		modalContext.expenseCostSetter(cost);
		modalContext.expenseDateSetter(toDateTimeInputValue(date));
		modalContext.toggleModalVisibility();
	};

	const { response, operation } = useAxios();

	const handleDeleteExpense = () => {
		operation({
			method: "delete",
			url: `${API_ROOT}/expenses/${id}/`,
			headers: authHeaders()
		});
	};
	useEffect(() => {
		if (response && response.status === 204){
			dispatch({
				type: "DELETE_EXPENSE",
				payload: { id }
			});
			refresh();
		}
	}, [response, dispatch, refresh, id]);


	return (
		<li
			className="list-group-item d-flex justify-content-between">
			<div
				className="d-flex justify-content-between align-items-center flex-grow-1 mw-90"
				onMouseEnter={() => setEditButtonVisibility(true)}
				onMouseLeave={() => setEditButtonVisibility(false)}
				onClick={editOnClickHandler}
				onKeyDown={event => {
					if (event.key === "Enter"){
						editOnClickHandler();
					}
				}}
				role="button"
				tabIndex={0}>
				<div className="text-capitalize">
					{editButtonVisibility && <TiPencil className="me-3" /> }
					{`${name}`}
				</div>
				<div>
					{`${parsedDate}`}

				</div>
				<span className="badge rounded-pill bg-primary mr-3">
					{formatPence(cost)}
				</span>
			</div>
			<TiDelete
				size="1.5em"
				onClick={handleDeleteExpense}
				onKeyDown={event => {
					if (event.key === "Enter"){
						handleDeleteExpense();
					}
				}}
				aria-label={`Delete ${name}`}
				tabIndex={0}
				role="button" />
		</li>
	);
};

export default ExpenseItem;
