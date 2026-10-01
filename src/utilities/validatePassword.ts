interface validationReturnType {
	success: boolean,
	reason?: string[]
}

const validatePassword = (password: string, config = { min: 8 }): validationReturnType => {
	let success = false;
	const reason = [];

	if (password.length < config.min) {
		success = false;
		reason.push(`Password must be at least ${config.min} characters.`);
	} else {
		success = true;
	}
	return { success, reason };
};

export { validatePassword };
