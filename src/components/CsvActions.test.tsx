import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ExpenseDataContext } from "../context/ExpenseDataContext";
import { expenseDataContextValue } from "../test/fixtures";
import CsvActions from "./CsvActions";

const renderCsvActions = () => {
	const contextValue = expenseDataContextValue();
	render(
		<ExpenseDataContext.Provider value={contextValue}>
			<CsvActions />
		</ExpenseDataContext.Provider>
	);
	return contextValue;
};

const csvFile = () => new File(["date,name,category,cost\n2026-09-14,Coffee,eating_out,3.20\n"], "expenses.csv", { type: "text/csv" });

describe("CsvActions", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("downloads the month's expenses as a CSV file", async () => {
		const request = vi.spyOn(axios, "request").mockResolvedValue({ status: 200, data: new Blob(["date,name,category,cost\n"]) });
		const createObjectURL = vi.fn(() => "blob:expenses");
		const revokeObjectURL = vi.fn();
		vi.stubGlobal("URL", { ...URL, createObjectURL, revokeObjectURL });
		const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
		renderCsvActions();

		await userEvent.click(screen.getByRole("button", { name: "Export this month as CSV" }));

		expect(request).toHaveBeenCalledWith(expect.objectContaining({
			url: expect.stringMatching(/\/expenses\/export\/$/),
			params: { month: "2026-09" },
			responseType: "blob"
		}));
		expect(click).toHaveBeenCalled();
		expect(revokeObjectURL).toHaveBeenCalledWith("blob:expenses");
		vi.unstubAllGlobals();
	});

	it("uploads a CSV, reports how many were imported and reloads", async () => {
		const request = vi.spyOn(axios, "request").mockResolvedValue({ status: 201, data: { created: 1 } });
		const contextValue = renderCsvActions();

		await userEvent.upload(screen.getByLabelText("CSV file to import"), csvFile());

		expect(await screen.findByText("Imported 1 expense.")).toBeInTheDocument();
		const upload = request.mock.calls[0][0].data as FormData;
		expect((upload.get("file") as File).name).toBe("expenses.csv");
		expect(contextValue.refresh).toHaveBeenCalled();
	});

	it("explains which rows were rejected", async () => {
		vi.spyOn(axios, "request").mockRejectedValue(new AxiosError("Bad Request", "ERR_BAD_REQUEST", undefined, undefined, {
			status: 400,
			statusText: "Bad Request",
			headers: {},
			config: { headers: new AxiosHeaders() },
			data: { rows: { 2: { cost: ["Enter an amount like 12.34."] } } }
		} as AxiosResponse));
		const contextValue = renderCsvActions();

		await userEvent.upload(screen.getByLabelText("CSV file to import"), csvFile());

		expect(await screen.findByText("Row 2: Enter an amount like 12.34.")).toBeInTheDocument();
		expect(contextValue.refresh).not.toHaveBeenCalled();
	});
});
