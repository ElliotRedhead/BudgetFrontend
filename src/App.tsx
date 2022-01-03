import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Budget from "./components/Budget";
import Remaining from "./components/Remaining";
import ExpenseTotal from "./components/ExpenseTotal";

const App = (): JSX.Element => {
	return (
		<div className="container">
			<h1 className="mt-3">Budget Planner</h1>
			<div className="row">
				<div className="col-sm">
					<Budget />
				</div>
				<div className="col-sm">
					<Remaining />
				</div>
				<div className="col-sm">
					<ExpenseTotal />
				</div>
			</div>
		</div>
	);
};

export default App;
