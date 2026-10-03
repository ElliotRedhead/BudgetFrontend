import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosRequestConfig } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { septemberExpenses, septemberSummary } from "../test/fixtures";
import Expenses from "./Expenses";

const apiResponses = async (config: AxiosRequestConfig) => {
	if (config.url?.endsWith("/expenses/summary/")){
		return { status: 200, data: septemberSummary };
	}
	if (config.method === "patch"){
		return { status: 200, data: { ...septemberExpenses[0], ...config.data } };
	}
	return { status: 200, data: { count: 2, next: null, previous: null, results: septemberExpenses } };
};

describe("Expenses page", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("opens an empty form for a new expense after editing one", async () => {
		vi.spyOn(axios, "request").mockImplementation(apiResponses);
		render(<Expenses />);

		await userEvent.click(await screen.findByText("rent"));
		expect(screen.getByLabelText("Name")).toHaveValue("rent");
		await userEvent.click(screen.getByRole("button", { name: "Save expense" }));
		await userEvent.click(screen.getByRole("button", { name: "Add new expense" }));

		await waitFor(() => expect(screen.getByLabelText("Name")).toHaveValue(""));
		expect(screen.getByLabelText("Cost (£)")).toHaveValue("0.00");
		expect(screen.getByLabelText("Category")).toHaveValue("other");
	});
});
