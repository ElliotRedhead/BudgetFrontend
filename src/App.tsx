import { useState, useContext, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.scss";

import Budget from "./components/Budget";
import Remaining from "./components/Remaining";
import ExpenseTotal from "./components/ExpenseTotal";
import ExpenseList from "./components/ExpenseList";
import ExpenseFormModal from "./components/ExpenseFormModal";
import { ExpenseDataProvider } from "./context/ExpenseDataContext";
import ModalContext from "./context/ModalContext";

const App = (): JSX.Element => {
	const modalContext = useContext(ModalContext);
	const [modalVisibility, setModalVisibility] = useState(false);
	const toggleModalVisibility = () => {
		setModalVisibility(!modalVisibility);
	};
	const [expenseId, setExpenseId] = useState(modalContext.expenseId);
	const [expenseName, setExpenseName] = useState(modalContext.expenseName);
	const [expenseCost, setExpenseCost] = useState(modalContext.expenseCost);
	const expenseIdSetter = (id:string) => {
		setExpenseId(id);
	};
	const expenseNameSetter = (name:string) => {
		setExpenseName(name);
	};
	const expenseCostSetter = (cost:number) => {
		setExpenseCost(cost);
	};

	const ModalContextProviderValues = useMemo(() => {
		const ModalContextProviderValues = {
			modalVisibility,
			toggleModalVisibility,
			expenseId,
			expenseIdSetter,
			expenseName,
			expenseNameSetter,
			expenseCost,
			expenseCostSetter
		};
		return ModalContextProviderValues;
	}, [modalVisibility, expenseId, expenseName, expenseCost]);


	return (
		<ExpenseDataProvider>
			<ModalContext.Provider value={ ModalContextProviderValues }>
				<ExpenseFormModal />
				<div className="container">
					<h1 className="mt-3">
						Budget Planner
					</h1>
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
					<h3 className="mt-3">
						Expenses
					</h3>
					<div className="row mt-3">
						<div className="col-sm">
							<ExpenseList />
						</div>
					</div>
				</div>
			</ModalContext.Provider>
		</ExpenseDataProvider>
	);
};


export default App;
