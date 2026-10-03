export interface ExpenseType {
	id?: number;
	name: string;

	/** Whole pence. */
	cost: number;
	category: string;
	date: string;
}
