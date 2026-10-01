export interface CategoryTotal {
	category: string;
	total: number;
}

/** GET /expenses/summary/: a month's spending against its budget, in pence. */
export interface MonthlySummary {
	month: string;
	budget: number | null;
	budget_month: string | null;
	total: number;
	remaining: number | null;
	by_category: CategoryTotal[];
}
