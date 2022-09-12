import { useContext, useState } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { TiDelete, TiPencil } from "react-icons/ti";
import ModalContext from "../context/ModalContext";

interface ExpenseProps {
	key:string,
	id:string,
	name:string,
	cost:number
}

const ExpenseItem = (props:ExpenseProps): JSX.Element => {
	const [editButtonVisibility, setEditButtonVisibility] = useState(false);
	const { dispatch } = useContext(ExpenseDataContext);
	const modalContext = useContext(ModalContext);

	const editOnClickHandler = () => {
		setEditButtonVisibility(false);
		modalContext.expenseIdSetter(props.id);
		modalContext.expenseNameSetter(props.name);
		modalContext.expenseCostSetter(props.cost);
		modalContext.toggleModalVisibility();
	};

	const handleDeleteExpense = () => {
		dispatch({
			type: "DELETE_EXPENSE",
			payload: { "id": props.id }
		});
	};

	return (
		<li
			className="list-group-item d-flex justify-content-between">
			<div
				className="d-flex justify-content-between align-items-center flex-grow-1"
				style={{ "maxWidth": "90%" }}
				onMouseEnter={() => setEditButtonVisibility(true)}
				onMouseLeave={() => setEditButtonVisibility(false)}
				onClick={editOnClickHandler}
				onKeyDown={editOnClickHandler}
				role="button"
				tabIndex={0}>
				<div>
					{editButtonVisibility && <TiPencil style={{ "marginRight": "1rem" }} /> }
					{`${props.name}`}
				</div>
				<span className="badge rounded-pill bg-primary mr-3">
					{`£${props.cost}`}
				</span>
			</div>
			<TiDelete
				size="1.5em"
				onClick={handleDeleteExpense} />
		</li>
	);
};

export default ExpenseItem;
