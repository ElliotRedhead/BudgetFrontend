const validateCost = (cost: string|number) => {
	const re = /^-?\d+(\.\d{2})?$/;
	return re.test(String(cost));
};

export { validateCost };
