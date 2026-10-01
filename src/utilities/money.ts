const poundsFormat = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

/**
 * Format an amount in pence as pounds, e.g. 123456 as "£1,234.56".
 * @param pence Whole pence, which may be negative
 * @returns The formatted amount
 */
export const formatPence = (pence: number) => poundsFormat.format(pence / 100);
