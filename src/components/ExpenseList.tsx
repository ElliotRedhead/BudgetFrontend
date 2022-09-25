import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import ExpenseItem from "./ExpenseItem";
import { LoadingSpinner } from "./LoadingSpinner";

const ExpenseList = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);
	return (
		<ul className="list-group">
			{
				state.isLoading ?
					<LoadingSpinner />
					:
					<>
						{
							state.expenses?.map(expense => {
								if (expense.id) {
									return (
										<ExpenseItem
											key={expense.id}
											id={expense.id}
											name={expense.name}
											cost={Number(expense.cost)}
											date={expense.date.substring(0, 16)} />
									);
								} else {
									return; 
								}
							})
						}
					</>
			}
		</ul>
	);
};

export default ExpenseList;
