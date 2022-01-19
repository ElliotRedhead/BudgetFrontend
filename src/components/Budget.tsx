import { useContext } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";

const Budget = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);
	return (
		<div className="alert alert-secondary">
			<span>
				{`Budget: £${state.budget}`}
			</span>
		</div>
	);
};
export default Budget;
