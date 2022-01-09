import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Budget = (): JSX.Element => {
	const { state } = useContext(AppContext);
	return (
		<div className="alert alert-secondary">
			<span>
				{`Budget: £${state.budget}`}
			</span>
		</div>
	);
};
export default Budget;
