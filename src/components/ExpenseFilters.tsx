import { useContext, useEffect, useState } from "react";
import { CATEGORIES } from "../constants";
import { ExpenseDataContext } from "../context/ExpenseDataContext";

// Wait for a pause in typing before searching, rather than on every key.
const SEARCH_DELAY_MS = 300;

const ExpenseFilters = (): JSX.Element => {
	const { state, dispatch } = useContext(ExpenseDataContext);
	const [search, setSearch] = useState(state.filters.search);
	const { category } = state.filters;

	useEffect(() => {
		if (search === state.filters.search){
			return undefined;
		}
		const timeout = setTimeout(() => {
			dispatch({ type: "SET_FILTERS", payload: { search, category } });
		}, SEARCH_DELAY_MS);
		return () => clearTimeout(timeout);
	}, [search, category, state.filters.search, dispatch]);

	return (
		<div
			className="row g-2 mb-3"
			role="search">
			<div className="col-sm-8">
				<label
					htmlFor="expense-search"
					className="visually-hidden">
					Search expenses
				</label>
				<input
					id="expense-search"
					type="search"
					className="form-control"
					placeholder="Search expenses"
					value={search}
					onChange={event => setSearch(event.target.value)} />
			</div>
			<div className="col-sm-4">
				<label
					htmlFor="category-filter"
					className="visually-hidden">
					Filter by category
				</label>
				<select
					id="category-filter"
					className="form-select"
					value={category}
					onChange={event => dispatch({
						type: "SET_FILTERS",
						payload: { search: state.filters.search, category: event.target.value }
					})}>
					<option value="">
						All categories
					</option>
					{CATEGORIES.map(option => (
						<option
							key={option.value}
							value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default ExpenseFilters;
