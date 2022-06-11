import { useContext } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ExpenseDataContext } from "../context/ExpenseDataContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePie = () => {
	const { state: expensesData } = useContext(ExpenseDataContext);
	const labels = expensesData.expenses.map(expense => expense.name);
	const costs = expensesData.expenses.map(expense => expense.cost);
	
	const pieData = {
		labels: labels,
		datasets: [
			{
				label: "Cost",
				data: costs,
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(255, 159, 64, 0.2)"
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)"
				],
				borderWidth: 2
			}
		]
	};
	return (
		<div
			className="h-100 d-flex flex-column justify-content-center align-content-center"
			style={{ "height": "100vh" }}>
			<Pie 
				id="expensesPie"
				data={pieData} />
		</div>
	);
};

export default ExpensePie;
