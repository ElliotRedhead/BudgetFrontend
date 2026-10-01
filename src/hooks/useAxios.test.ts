import { act, renderHook } from "@testing-library/react";
import axios, { AxiosError, AxiosHeaders, AxiosResponse } from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import useAxios, { describeRequestError } from "./useAxios";

const apiError = (status: number, data: unknown) => new AxiosError(
	`Request failed with status code ${status}`,
	"ERR_BAD_REQUEST",
	undefined,
	undefined,
	{
		status,
		statusText: "",
		headers: {},
		config: { headers: new AxiosHeaders() },
		data
	} as AxiosResponse
);

const expiredTokenError = () => apiError(401, { code: "token_not_valid" });

describe("describeRequestError", () => {
	it("uses the API's detail message", () => {
		const loginError = apiError(401, { detail: "No active account found with the given credentials" });

		expect(describeRequestError(loginError)).toBe("No active account found with the given credentials");
	});

	it("joins field validation messages", () => {
		const registerError = apiError(400, {
			email: ["user with this email address already exists."],
			password: ["This password is too common."]
		});

		expect(describeRequestError(registerError)).toBe(
			"user with this email address already exists. This password is too common."
		);
	});

	it("falls back to a connection message for server and network errors", () => {
		expect(describeRequestError(apiError(500, "<html>"))).toBe("A connection error occurred, please try again.");
		expect(describeRequestError(new Error("Network Error"))).toBe("A connection error occurred, please try again.");
	});
});

describe("useAxios", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("refreshes an expired token, retries, and reports no error", async () => {
		localStorage.setItem("refresh_token", "old-refresh");
		const request = vi.spyOn(axios, "request")
			.mockRejectedValueOnce(expiredTokenError())
			.mockResolvedValueOnce({ status: 200, data: { access: "new-access", refresh: "new-refresh" } })
			.mockResolvedValueOnce({ status: 200, data: ["retried"] });
		const { result } = renderHook(() => useAxios());

		await act(() => result.current.operation({ method: "get", url: "/expenses/" }));

		expect(result.current.response?.data).toEqual(["retried"]);
		expect(result.current.error).toBeUndefined();
		expect(result.current.loading).toBe(false);
		expect(localStorage.getItem("access_token")).toBe("new-access");
		expect(localStorage.getItem("refresh_token")).toBe("new-refresh");
		expect(request).toHaveBeenLastCalledWith(expect.objectContaining({
			url: "/expenses/",
			headers: expect.objectContaining({ Authorization: "JWT new-access" })
		}));
	});

	it("asks the user to log in again when the refresh fails", async () => {
		localStorage.setItem("refresh_token", "revoked-refresh");
		vi.spyOn(axios, "request")
			.mockRejectedValueOnce(expiredTokenError())
			.mockRejectedValueOnce(new Error("Token is blacklisted"));
		const { result } = renderHook(() => useAxios());

		await act(() => result.current.operation({ method: "get", url: "/expenses/" }));

		expect(result.current.error).toBe("Your session has expired, please log in again.");
		expect(result.current.response).toBeUndefined();
	});

	it("clears a previous error when a later request succeeds", async () => {
		vi.spyOn(axios, "request")
			.mockRejectedValueOnce(new Error("Network Error"))
			.mockResolvedValueOnce({ status: 200, data: [] });
		const { result } = renderHook(() => useAxios());

		await act(() => result.current.operation({ method: "get", url: "/expenses/" }));
		expect(result.current.error).toBe("A connection error occurred, please try again.");

		await act(() => result.current.operation({ method: "get", url: "/expenses/" }));
		expect(result.current.error).toBeUndefined();
	});
});
