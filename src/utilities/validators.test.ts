import { describe, expect, it } from "vitest";
import { validateCost } from "./validateCost";
import { validateEmail } from "./validateEmail";
import { validatePassword } from "./validatePassword";

describe("validateCost", () => {
	it.each(["0", "12", "12.34", "-5.00"])("accepts %s", cost => {
		expect(validateCost(cost)).toBe(true);
	});

	it.each(["", "12.3", "12.345", "£12", "abc"])("rejects %j", cost => {
		expect(validateCost(cost)).toBe(false);
	});
});

describe("validateEmail", () => {
	it("accepts a normal address", () => {
		expect(validateEmail("user@example.com")).toBe(true);
	});

	it.each(["user", "user@", "@example.com", "user@example"])("rejects %s", email => {
		expect(validateEmail(email)).toBe(false);
	});
});

describe("validatePassword", () => {
	it("accepts a password of 8 characters, the backend's minimum", () => {
		expect(validatePassword("abcdefgh").success).toBe(true);
	});

	it("rejects a shorter password with a reason", () => {
		const result = validatePassword("abcdefg");
		expect(result.success).toBe(false);
		expect(result.reason).toEqual(["Password must be at least 8 characters."]);
	});
});
