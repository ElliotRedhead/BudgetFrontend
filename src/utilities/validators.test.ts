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
	it("accepts a password at the minimum length", () => {
		expect(validatePassword("123456").success).toBe(true);
	});

	it("rejects a shorter password with a reason", () => {
		const result = validatePassword("12345");
		expect(result.success).toBe(false);
		expect(result.reason).toHaveLength(1);
	});
});
