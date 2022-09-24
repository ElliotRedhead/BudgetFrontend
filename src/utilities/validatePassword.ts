interface validationReturnType {
	success: boolean,
	reason?: string[]
}

const validatePassword = (password: string, config = { min: 6 }): validationReturnType => {
	let success = false;
	const reason = [];

	if (password.length < config.min) {
		success = false;
		reason.push(`Password must be greater than ${config.min} characters.`);
	} else {
		success = true;
	}
	return { success, reason };
};

export { validatePassword };
