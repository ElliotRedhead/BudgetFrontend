/**
 * Format an instant for a datetime-local input, which shows local time.
 * @param isoTimestamp An ISO 8601 timestamp, e.g. from the API
 * @returns The local date and time as "YYYY-MM-DDTHH:mm"
 */
export const toDateTimeInputValue = (isoTimestamp: string) => {
	const instant = new Date(isoTimestamp);
	const localInstant = new Date(instant.getTime() - instant.getTimezoneOffset() * 60000);
	return localInstant.toISOString().substring(0, 16);
};

/**
 * Convert a datetime-local input's value back to an instant for the API.
 * @param inputValue Local date and time as "YYYY-MM-DDTHH:mm"
 * @returns An ISO 8601 timestamp in UTC
 */
export const fromDateTimeInputValue = (inputValue: string) => new Date(inputValue).toISOString();
