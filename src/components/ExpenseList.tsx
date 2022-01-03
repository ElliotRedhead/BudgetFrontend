import ExpenseItem from "./ExpenseItem";

const ExpenseList = (): JSX.Element => {
	const expenses = [
		{
			id: 123123,
			name: "Shopping",
			cost: 50
		},
		{
			id: 123124,
			name: "Holiday",
			cost: 300
		},
		{
			id: 123125,
			name: "Transportation",
			cost: 70
		},
		{
			id: 123126,
			name: "Fuel",
			cost: 40
		},
		{
			id: 123127,
			name: "Utilities",
			cost: 110
		}
	];

	return (
		<ul className="list-group">
			{expenses.map(expense => (
				<ExpenseItem
					key={expense.id}
					id={expense.id}
					name={expense.name}
					cost={expense.cost} />	
			))}
		</ul>
	);
};

export default ExpenseList;
