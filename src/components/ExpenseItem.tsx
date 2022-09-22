import { useContext, useEffect, useState } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { TiDelete, TiPencil } from "react-icons/ti";
import ModalContext from "../context/ModalContext";
import useAxios from "../hooks/useAxios";
import { API_ROOT } from "../constants";

interface ExpenseProps {
	key:string,
	id:string,
	name:string,
	cost:number,
	date:string
}

const ExpenseItem = (props:ExpenseProps): JSX.Element => {
	const [editButtonVisibility, setEditButtonVisibility] = useState(false);
	const { dispatch } = useContext(ExpenseDataContext);
	const modalContext = useContext(ModalContext);

	const { id, name, cost, date } = props;
	const parsedDate = (new Date(date)).toLocaleDateString();

	const editOnClickHandler = () => {
		setEditButtonVisibility(false);
		modalContext.expenseIdSetter(id);
		modalContext.expenseNameSetter(name);
		modalContext.expenseCostSetter(cost);
		modalContext.expenseDateSetter(date);
		modalContext.toggleModalVisibility();
	};
	
	const { response, loading, error, operation } = useAxios();

	const handleDeleteExpense = () => {
		operation({
			method: "delete",
			url: `${API_ROOT}/expenses/${id}`,
			headers: {
				"Authorization": `JWT ${localStorage.getItem("access_token")}`
			}
		});
	
	};
	useEffect(() => {
		if (response && response.status === 204){
			dispatch({
				type: "DELETE_EXPENSE",
				payload: { "id": id }
			});
		}
	});


	return (
		<li
			className="list-group-item d-flex justify-content-between">
			<div
				className="d-flex justify-content-between align-items-center flex-grow-1"
				style={{ "maxWidth": "90%" }}
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
					{editButtonVisibility && <TiPencil style={{ "marginRight": "1rem" }} /> }
					{`${name}`}
				</div>
				<div>
					{`${parsedDate}`}

				</div>
				<span className="badge rounded-pill bg-primary mr-3">
					{
						cost < 0 ?
							`-£${Math.abs(cost)}`
							:
							`£${cost}`
					}
				</span>
			</div>
			<TiDelete
				size="1.5em"
				onClick={handleDeleteExpense}
				tabIndex={0}
				role="button" />
		</li>
	);
};

export default ExpenseItem;
