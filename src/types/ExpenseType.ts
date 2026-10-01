export interface ExpenseType {
	id?: number;
	name: string;
	/** Whole pence. */
	cost: number;
	date: string;
}
