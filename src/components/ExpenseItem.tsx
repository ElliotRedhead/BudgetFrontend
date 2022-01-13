import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { TiDelete } from "react-icons/ti";

interface ExpenseProps {
	key:number,
	id:number,
	name:string,
	cost:number
}

const ExpenseItem = (props:ExpenseProps): JSX.Element => {
	const { state, dispatch } = useContext(AppContext);

	const handleDeleteExpense = () => {
		dispatch({
			type: "DELETE_EXPENSE",
			payload: props.id
		});
	};

	return (
		<li className="list-group-item d-flex justify-content-between align-items-center">
			{props.name}
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
