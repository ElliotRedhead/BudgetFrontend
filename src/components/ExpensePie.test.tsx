import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { expenseDataContextValue, septemberSummary } from "../test/fixtures";
import ExpensePie from "./ExpensePie";

// jsdom has no canvas, so render the chart's data instead of drawing it.
vi.mock("react-chartjs-2", () => ({
	Pie: ({ data }: { data: { labels: string[]; datasets: { data: number[] }[] } }) => (
		<output data-testid="pie">
			{data.labels.map((label, index) => `${label}=${data.datasets[0].data[index]}`).join(", ")}
		</output>
	)
}));

describe("ExpensePie", () => {
	it("charts the month's total for each category", () => {
		render(
			<ExpenseDataContext.Provider value={expenseDataContextValue()}>
				<ExpensePie />
			</ExpenseDataContext.Provider>
		);

		expect(screen.getByTestId("pie")).toHaveTextContent("Housing=95000, Transport=275");
	});

	it("draws nothing for a month without spending", () => {
		const { container } = render(
			<ExpenseDataContext.Provider value={expenseDataContextValue({ summary: { ...septemberSummary, total: 0, by_category: [] } })}>
				<ExpensePie />
			</ExpenseDataContext.Provider>
		);

		expect(container).toBeEmptyDOMElement();
	});
});
