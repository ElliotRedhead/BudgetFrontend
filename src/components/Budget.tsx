import { useContext, useEffect } from "react";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { LoadingSpinner } from "./LoadingSpinner";

const Budget = (): JSX.Element => {
	const { state } = useContext(ExpenseDataContext);

	return (
		<div className="alert alert-secondary text-center">
			{
				state.isLoading ?
					<LoadingSpinner />
					:
					<span>
						{
							state.budget < 0 ?
								`Budget: - £${Math.abs(state.budget)}`
								:
								`Budget: £${state.budget}`
						}
					</span>
			}
		</div>
	);
};
export default Budget;
