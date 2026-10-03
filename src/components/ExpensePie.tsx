import { useContext } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from "chart.js";
import { categoryLabel } from "../constants";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { colourGenerator } from "../utilities/colourGenerator";
import { colourAlphaOffset } from "../utilities/colourAlphaOffset";
import { formatPence } from "../utilities/money";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePie = () => {
	const { state } = useContext(ExpenseDataContext);
	const categoryTotals = state.summary?.by_category ?? [];
	if (!categoryTotals.length){
		return null;
	}
	const backgroundColours = categoryTotals.map((_, index) => colourGenerator(categoryTotals.length, index));
	const borderColours = backgroundColours.map(colourHex => (colourAlphaOffset(colourHex, 0.3)));

	const pieData = {
		labels: categoryTotals.map(categoryTotal => categoryLabel(categoryTotal.category)),
		datasets: [
			{
				data: categoryTotals.map(categoryTotal => categoryTotal.total),
				backgroundColor: backgroundColours,
				borderColor: borderColours,
				borderWidth: 2
			}
		]
	};
	const pieOptions = {
		plugins: {
			tooltip: {
				callbacks: {
					label: (item: TooltipItem<"pie">) => `${item.label}: ${formatPence(Number(item.raw))}`
				}
			}
		}
	};
	return (
		<figure className="mt-3">
			<figcaption className="h5">
				Spending by category
			</figcaption>
			<Pie
				id="expensesPie"
				aria-label="Pie chart of this month's spending by category"
				role="img"
				data={pieData}
				options={pieOptions} />
		</figure>
	);
};

export default ExpensePie;
