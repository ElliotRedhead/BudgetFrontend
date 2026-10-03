import { useState, useContext, useMemo } from "react";

import Budget from "../components/Budget";
import ExpensePie from "../components/ExpensePie";
import Remaining from "../components/Remaining";
import ExpenseTotal from "../components/ExpenseTotal";
import ExpenseList from "../components/ExpenseList";
import ExpenseFormModal from "../components/ExpenseFormModal";
import MonthNavigator from "../components/MonthNavigator";
import ExpenseFilters from "../components/ExpenseFilters";
import CsvActions from "../components/CsvActions";
import ApplyRecurringButton from "../components/ApplyRecurringButton";
import { ExpenseDataProvider } from "../context/ExpenseDataContext";
import ModalContext from "../context/ModalContext";
import { toDateTimeInputValue } from "../utilities/dateTimeInput";

const Expenses = (): JSX.Element => {
	const modalContext = useContext(ModalContext);
	const resetContext = () => {

		setExpenseId(null);
		setExpenseName("");
		setExpenseCost(0);
		setExpenseCategory("other");
		setExpenseDate(toDateTimeInputValue(new Date().toISOString()));
	};

	const [modalVisibility, setModalVisibility] = useState(false);
	const toggleModalVisibility = () => {
		setModalVisibility(!modalVisibility);
	};
	const [expenseId, setExpenseId] = useState(modalContext.expenseId);
	const [expenseName, setExpenseName] = useState(modalContext.expenseName);
	const [expenseCost, setExpenseCost] = useState(modalContext.expenseCost);
	const [expenseCategory, setExpenseCategory] = useState(modalContext.expenseCategory);
	const [expenseDate, setExpenseDate] = useState(modalContext.expenseDate);
	const expenseIdSetter = (id: number | null) => {
		setExpenseId(id);
	};
	const expenseNameSetter = (name: string) => {
		setExpenseName(name);
	};
	const expenseCostSetter = (cost: number) => {
		setExpenseCost(cost);
	};
	const expenseCategorySetter = (category: string) => {
		setExpenseCategory(category);
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
			expenseCategory,
			expenseCategorySetter,
			expenseDate,
			expenseDateSetter
		};
		return ModalContextProviderValues;
	}, [modalVisibility, expenseId, expenseName, expenseCost, expenseCategory, expenseDate, expenseDateSetter]);

	return (
		<ExpenseDataProvider>
			<ModalContext.Provider value={ModalContextProviderValues}>
				<ExpenseFormModal />
				<div className="container">
					<h1 className="mt-3">
						Budget Planner
					</h1>
					<MonthNavigator />
					<div className="row mt-3">
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
					<ExpenseFilters />
					<div className="row mt-3">
						<div className="col-lg-8">
							<ExpenseList />
						</div>
						<div className="col-lg-4">
							<ExpensePie />
						</div>
					</div>
				</div>
				<div className="container">
					<button
						type="button"
						className="btn btn-primary mt-2"
						onClick={() => {
							resetContext();
							toggleModalVisibility();
						}}>
						Add new expense
					</button>
					<ApplyRecurringButton />
					<CsvActions />
				</div>
			</ModalContext.Provider>
		</ExpenseDataProvider>
	);
};

export default Expenses;
