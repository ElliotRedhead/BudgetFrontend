import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LOGIN, REGISTER } from "../constants";
import AuthenticationForm from "./AuthenticationForm";

const renderForm = (authMode: string) => render(
	<MemoryRouter initialEntries={[`/${authMode}`]}>
		<Routes>
			<Route
				path={`/${authMode}`}
				element={<AuthenticationForm authMode={authMode} />} />
			<Route
				path="/expenses"
				element={<p>
					Expenses page
				</p>} />
		</Routes>
	</MemoryRouter>
);

describe("AuthenticationForm", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("only enables login once the email is valid", async () => {
		renderForm(LOGIN);
		const submit = screen.getByRole("button", { name: "login" });

		expect(screen.getByRole("heading", { name: "Log in to your account" })).toBeInTheDocument();
		expect(submit).toBeDisabled();
		await userEvent.type(screen.getByLabelText("Email address"), "user@example");
		expect(screen.getByText("Please enter a valid email.")).toBeInTheDocument();
		await userEvent.type(screen.getByLabelText("Email address"), ".com");
		await userEvent.type(screen.getByLabelText("Password"), "whatever");

		expect(submit).toBeEnabled();
	});

	it("checks password length and matching when registering", async () => {
		renderForm(REGISTER);
		await userEvent.type(screen.getByLabelText("Email address"), "new@example.com");
		await userEvent.type(screen.getByLabelText("Password"), "short");

		expect(screen.getByText("Password must be at least 8 characters.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "register" })).toBeDisabled();

		await userEvent.type(screen.getByLabelText("Password"), "-but-longer");
		await userEvent.type(screen.getByLabelText("Confirm password"), "different-password");

		expect(screen.getByText("The passwords must match.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "register" })).toBeDisabled();
	});

	it("stores the tokens and opens the expenses page after logging in", async () => {
		vi.spyOn(axios, "request").mockResolvedValue({ status: 200, data: { access: "access-token", refresh: "refresh-token" } });
		renderForm(LOGIN);

		await userEvent.type(screen.getByLabelText("Email address"), "user@example.com");
		await userEvent.type(screen.getByLabelText("Password"), "correct-password");
		await userEvent.click(screen.getByRole("button", { name: "login" }));

		expect(await screen.findByText("Expenses page")).toBeInTheDocument();
		expect(localStorage.getItem("access_token")).toBe("access-token");
		expect(localStorage.getItem("refresh_token")).toBe("refresh-token");
	});
});
