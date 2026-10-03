import { useCallback, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_ROOT } from "../constants";

const CONNECTION_ERROR = "A connection error occurred, please try again.";
const SESSION_EXPIRED_ERROR = "Your session has expired, please log in again.";

/**
 * Turn a failed request into a message for the user, preferring the API's own
 * explanation (e.g. "No active account found..." or a field's validation errors).
 * @param requestError Whatever the request threw
 * @returns A readable message
 */
export const describeRequestError = (requestError: unknown) => {
	if (!axios.isAxiosError(requestError) || !requestError.response || requestError.response.status >= 500){
		return CONNECTION_ERROR;
	}
	const data = requestError.response.data;
	if (typeof data?.detail === "string"){
		return data.detail;
	}
	// CSV imports report errors per row: { rows: { "3": { cost: ["..."] } } }.
	if (data?.rows && typeof data.rows === "object"){
		return Object.entries(data.rows as Record<string, Record<string, string[]>>)
			.map(([row, fieldErrors]) => `Row ${row}: ${Object.values(fieldErrors).flat().join(" ")}`)
			.join(" ");
	}
	if (data && typeof data === "object"){
		const messages = Object.values(data).flat().filter(message => typeof message === "string");
		if (messages.length){
			return messages.join(" ");
		}
	}
	return CONNECTION_ERROR;
};

const isExpiredTokenError = (requestError: unknown) => axios.isAxiosError(requestError) &&
	requestError.response?.data?.code === "token_not_valid" &&
	localStorage.getItem("refresh_token") !== null;

// Refresh tokens are single use, so requests that expire together must share
// one refresh rather than each spending the same token.
let refreshInFlight: Promise<string> | null = null;

const refreshAccessToken = () => {
	if (!refreshInFlight){
		refreshInFlight = axios.request({
			method: "post",
			url: `${API_ROOT}/user/refresh/`,
			data: { "refresh": localStorage.getItem("refresh_token") }
		}).then(refresh => {
			localStorage.setItem("access_token", refresh.data.access);
			localStorage.setItem("refresh_token", refresh.data.refresh);
			return refresh.data.access;
		}).finally(() => {
			refreshInFlight = null;
		});
	}
	return refreshInFlight;
};

const refreshAndRetry = async (params: AxiosRequestConfig) => {
	const accessToken = await refreshAccessToken();
	return axios.request({
		...params,
		headers: { ...params.headers, "Authorization": `JWT ${accessToken}` }
	});
};

const useAxios = () => {
	const [response, setResponse] = useState<AxiosResponse>();
	const [error, setError] = useState<string>();
	const [loading, setLoading] = useState(false);

	const operation = useCallback(async (params: AxiosRequestConfig): Promise<AxiosResponse | undefined> => {
		setLoading(true);
		setError(undefined);
		try {
			const result = await axios.request({ ...params });
			setResponse(result);
			return result;
		} catch (requestError){
			console.log(requestError);
			if (isExpiredTokenError(requestError)){
				try {
					const result = await refreshAndRetry(params);
					setResponse(result);
					return result;
				} catch (retryError){
					console.log(retryError);
					setError(SESSION_EXPIRED_ERROR);
				}
			} else {
				setError(describeRequestError(requestError));
			}
		} finally {
			setLoading(false);
		}
		return undefined;
	}, []);

	return { response, error, loading, operation };
};

export default useAxios;
