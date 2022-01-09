import { SyntheticEvent, useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { v4 as uuidv4 } from "uuid";

const AddExpenseForm = ():JSX.Element => {
	const { dispatch } = useContext(AppContext);
	const [name, setName] = useState("");
	const [cost, setCost] = useState("");

	const onSubmit = (event: SyntheticEvent) => {
		event.preventDefault();
		const expense = {
			id: uuidv4(),
			name: name,
			cost: parseInt(cost)
		};

		dispatch({
			type: "ADD_EXPENSE",
			payload: expense
		});
	};

	return (
		<form onSubmit={onSubmit}>
			<div className="row">
				<div className="col-sm">
					<label htmlFor="name">
						Name
					</label>
					<input
						required={true}
						type="text"
						className="form-control"
						id="name"
						value={name}
						onChange={event => setName(event.target.value)} />
				</div>
				<div className="col-sm">
					<label htmlFor="Cost">
						Cost
					</label>
					<input
						required={true}
						type="text"
						className="form-control"
						id="cost"
						value={cost}
						onChange={event => setCost(event.target.value)} />
				</div>
			</div>
			<div className="row mt-3">
				<div className="col-sm">
					<button
						type="submit"
						className="btn btn-primary">
						Save
					</button>
				</div>
			</div>
		</form>
	);
};

export default AddExpenseForm;
