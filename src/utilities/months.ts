/**
 * The first day of the month containing a date, at local midnight.
 * @param date Any date in the month
 * @returns The first of that month
 */
export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

/**
 * Move a month forwards or backwards.
 * @param month The first day of a month
 * @param offset Months to move, negative for earlier
 * @returns The first day of the resulting month
 */
export const addMonths = (month: Date, offset: number) => new Date(month.getFullYear(), month.getMonth() + offset, 1);

/**
 * Format a month the way the API expects it.
 * @param month Any date in the month
 * @returns The month as "YYYY-MM"
 */
export const toMonthParam = (month: Date) => `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;

/**
 * Name a month for display.
 * @param month Any date in the month
 * @returns e.g. "September 2026"
 */
export const monthLabel = (month: Date) => month.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
