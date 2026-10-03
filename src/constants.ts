export const LOGIN = "login";
export const REGISTER = "register";
export const API_ROOT = import.meta.env.VITE_API_ROOT;

/** The API's expense categories, in display order. */
export const CATEGORIES = [
	{ value: "groceries", label: "Groceries" },
	{ value: "housing", label: "Housing" },
	{ value: "utilities", label: "Utilities" },
	{ value: "transport", label: "Transport" },
	{ value: "health", label: "Health" },
	{ value: "eating_out", label: "Eating out" },
	{ value: "leisure", label: "Leisure" },
	{ value: "shopping", label: "Shopping" },
	{ value: "other", label: "Other" }
];

export const categoryLabel = (value: string) => CATEGORIES.find(category => category.value === value)?.label ?? value;
