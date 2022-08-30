interface validationReturnType {
	success: boolean,
	reason?: string[]
}

const validatePassword = (password: string, config = { min: 6, max: 10 }): validationReturnType => {
	let success = false;
	const reason = [];

	if (password.length < config.min) {
		success = false;
		reason.push(`Password must be greater than ${config.min} characters.`);
	} else if (password.length > config.max) {
		reason.push(`Password must be less than ${config.max} characters.`);
	} else {
		success = true;
	}
	return { success, reason };
};

export { validatePassword };
