import { describe, expect, it } from "vitest";
import { formatPence } from "./money";
import { addMonths, monthLabel, startOfMonth, toMonthParam } from "./months";

describe("formatPence", () => {
	it.each([
		[0, "£0.00"],
		[275, "£2.75"],
		[123456, "£1,234.56"],
		[-500, "-£5.00"]
	])("formats %i as %s", (pence, pounds) => {
		expect(formatPence(pence)).toBe(pounds);
	});
});

describe("months", () => {
	const september = new Date(2026, 8, 1);

	it("finds the start of a date's month", () => {
		expect(startOfMonth(new Date(2026, 8, 17, 15, 30))).toEqual(september);
	});

	it("moves across year boundaries", () => {
		expect(addMonths(new Date(2026, 11, 1), 1)).toEqual(new Date(2027, 0, 1));
		expect(addMonths(new Date(2026, 0, 1), -1)).toEqual(new Date(2025, 11, 1));
	});

	it("formats months for the API and for people", () => {
		expect(toMonthParam(september)).toBe("2026-09");
		expect(monthLabel(september)).toBe("September 2026");
	});
});
