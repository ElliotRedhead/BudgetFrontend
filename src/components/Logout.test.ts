import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Logout } from "./Logout";

describe("Logout", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("clears the tokens and revokes the refresh token on the server", () => {
		const request = vi.spyOn(axios, "request").mockResolvedValue({ status: 200 });
		localStorage.setItem("access_token", "access");
		localStorage.setItem("refresh_token", "refresh");

		Logout();

		expect(localStorage.getItem("access_token")).toBeNull();
		expect(localStorage.getItem("refresh_token")).toBeNull();
		expect(request).toHaveBeenCalledWith(expect.objectContaining({
			method: "post",
			url: expect.stringMatching(/\/user\/logout\/$/),
			data: { refresh: "refresh" }
		}));
	});

	it("doesn't call the server when already logged out", () => {
		const request = vi.spyOn(axios, "request");

		Logout();

		expect(request).not.toHaveBeenCalled();
	});
});
