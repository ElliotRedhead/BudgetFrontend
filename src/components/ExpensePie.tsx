import { useContext } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { colourGenerator } from "../utilities/colourGenerator";
import { colourAlphaOffset } from "../utilities/colourAlphaOffset";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePie = () => {
	const { state: expensesData } = useContext(ExpenseDataContext);
	const labels = expensesData.expenses?.map(expense => expense.name);
	const costs = expensesData.expenses?.map(expense => expense.cost);
	const backgroundColours = expensesData.expenses?.map((_, index) => colourGenerator(expensesData.expenses.length, index));
	const borderColours = backgroundColours?.map(colourHex => (colourAlphaOffset(colourHex, 0.3)));
	
	const pieData = {
		labels: labels,
		datasets: [
			{
				data: costs,
				backgroundColor: backgroundColours,
				borderColor: borderColours,
				borderWidth: 2
			}
		]
	};
	return (
		<div
			className="h-100vh d-flex flex-column justify-content-center align-content-center">
			<Pie 
				id="expensesPie"
				data={pieData} />
		</div>
	);
};

export default ExpensePie;
