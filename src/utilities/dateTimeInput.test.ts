import { describe, expect, it } from "vitest";
import { fromDateTimeInputValue, toDateTimeInputValue } from "./dateTimeInput";

// vite.config.ts runs tests in Europe/London, so these cover GMT and BST.
describe("datetime-local conversion", () => {
	it("shows a summer instant in BST", () => {
		expect(toDateTimeInputValue("2026-07-01T11:30:00Z")).toBe("2026-07-01T12:30");
	});

	it("shows a winter instant in GMT", () => {
		expect(toDateTimeInputValue("2026-01-15T09:00:00Z")).toBe("2026-01-15T09:00");
	});

	it("round-trips without shifting the time", () => {
		const savedTimestamp = "2026-07-01T11:30:00.000Z";

		expect(fromDateTimeInputValue(toDateTimeInputValue(savedTimestamp))).toBe(savedTimestamp);
	});
});
