import { useContext, useState } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { TiDelete, TiPencil } from "react-icons/ti";
import ModalContext from "../context/ModalContext";

interface ExpenseProps {
	key:number,
	id:number,
	name:string,
	cost:number
}



const ExpenseItem = (props:ExpenseProps): JSX.Element => {
	const [editButtonVisibility, setEditButtonVisibility] = useState(false);
	const { dispatch } = useContext(ExpenseDataContext);
	const modalContext = useContext(ModalContext);

	const editOnClickHandler = () => {
		setEditButtonVisibility(false);
		modalContext.toggleModalVisibility();
		console.log(modalContext);
	};

	const handleDeleteExpense = () => {
		dispatch({
			type: "DELETE_EXPENSE",
			payload: props.id
		});
	};

	return (
		<li
			className="list-group-item d-flex justify-content-between align-items-center"
			onMouseEnter={() => setEditButtonVisibility(true)}
			onMouseLeave={() => setEditButtonVisibility(false)}
			onClick={editOnClickHandler}>
			<div>
				{editButtonVisibility && <TiPencil style={{ "marginRight": "1rem" }} /> }
				{`${props.name}`}
			</div>
			<div>
				<span className="badge rounded-pill bg-primary mr-3">
					{`£${props.cost}`}
				</span>
				<TiDelete
					size="1.5em"
					onClick={handleDeleteExpense} />
			</div>
		</li>
	);
};

export default ExpenseItem;
