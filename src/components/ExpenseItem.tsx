import { TiDelete } from "react-icons/ti";

interface expenseProps {
	key:number,
	id:number,
	name:string,
	cost:number
}

const ExpenseItem = (props:expenseProps): JSX.Element => (
	<li className="list-group-item d-flex justify-content-between align-items-center">
		{props.name}
		<div>
			<span className="badge rounded-pill bg-primary mr-3">
				{`£${props.cost}`}
			</span>
			<TiDelete size="1.5em" />
		</div>
	</li>
);

export default ExpenseItem;
