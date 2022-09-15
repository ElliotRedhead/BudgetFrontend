import { useState, useContext, useMemo } from "react";

import Budget from "../components/Budget";
import ExpensePie from "../components/ExpensePie";
import Remaining from "../components/Remaining";
import ExpenseTotal from "../components/ExpenseTotal";
import ExpenseList from "../components/ExpenseList";
import ExpenseFormModal from "../components/ExpenseFormModal";
import { ExpenseDataProvider } from "../context/ExpenseDataContext";
import ModalContext from "../context/ModalContext";

const Expenses = (): JSX.Element => {
	const modalContext = useContext(ModalContext);
	const resetContext = () => {

		setExpenseId("");
		setExpenseName("");
		setExpenseCost(0);
		setExpenseDate((new Date).toISOString().substring(0, 16));
	};

	const [modalVisibility, setModalVisibility] = useState(false);
	const toggleModalVisibility = () => {
		setModalVisibility(!modalVisibility);
	};
	const [expenseId, setExpenseId] = useState(modalContext.expenseId);
	const [expenseName, setExpenseName] = useState(modalContext.expenseName);
	const [expenseCost, setExpenseCost] = useState(modalContext.expenseCost);
	const [expenseDate, setExpenseDate] = useState(modalContext.expenseDate);
	const expenseIdSetter = (id: string) => {
		setExpenseId(id);
	};
	const expenseNameSetter = (name: string) => {
		setExpenseName(name);
	};
	const expenseCostSetter = (cost: number) => {
		setExpenseCost(cost);
	};
	const expenseDateSetter = (date: string) => {
		setExpenseDate(date);
	};

	const ModalContextProviderValues = useMemo(() => {
		const ModalContextProviderValues = {
			resetContext,
			modalVisibility,
			toggleModalVisibility,
			expenseId,
			expenseIdSetter,
			expenseName,
			expenseNameSetter,
			expenseCost,
			expenseCostSetter,
			expenseDate,
			expenseDateSetter
		};
		return ModalContextProviderValues;
	}, [modalVisibility, expenseId, expenseName, expenseCost, expenseDate, expenseDateSetter]);

	return (
		<ExpenseDataProvider>
			<ModalContext.Provider value={ModalContextProviderValues}>
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
				<div className="container">
					<button
						type="button"
						className="btn btn-primary mt-2"
						data-bs-dismiss="modal"
						aria-label="Open"
						onClick={() => {
							modalContext.resetContext();
							toggleModalVisibility();
						}}>
						Add new expense
					</button>
				</div>
				<div className="vh-100">
					{/* <ExpensePie /> */}
				</div>
			</ModalContext.Provider>
		</ExpenseDataProvider>
	);
};

export default Expenses;
