/** A monthly repeating expense, e.g. rent. Cost is in whole pence. */
export interface RecurringExpenseType {
	id: number;
	name: string;
	category: string;
	cost: number;
	day_of_month: number;
	active: boolean;
}
