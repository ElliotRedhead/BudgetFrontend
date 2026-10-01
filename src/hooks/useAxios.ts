import { useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_ROOT } from "../constants";

const CONNECTION_ERROR = "A connection error occurred, please try again.";
const SESSION_EXPIRED_ERROR = "Your session has expired, please log in again.";

const isExpiredTokenError = (requestError: unknown) => axios.isAxiosError(requestError) &&
	requestError.response?.data?.code === "token_not_valid" &&
	localStorage.getItem("refresh_token") !== null;

const useAxios = () => {
	const [response, setResponse] = useState<AxiosResponse>();
	const [error, setError] = useState<string>();
	const [loading, setLoading] = useState(false);

	const refreshAndRetry = async (params: AxiosRequestConfig) => {
		const refresh = await axios.request({
			method: "post",
			url: `${API_ROOT}/user/refresh/`,
			data: { "refresh": localStorage.getItem("refresh_token") }
		});
		localStorage.setItem("access_token", refresh.data.access);
		localStorage.setItem("refresh_token", refresh.data.refresh);
		return axios.request({
			...params,
			headers: { ...params.headers, "Authorization": `JWT ${refresh.data.access}` }
		});
	};

	const operation = async (params: AxiosRequestConfig) => {
		setLoading(true);
		setError(undefined);
		try {
			setResponse(await axios.request({ ...params }));
		} catch (requestError){
			console.log(requestError);
			if (isExpiredTokenError(requestError)){
				try {
					setResponse(await refreshAndRetry(params));
				} catch (retryError){
					console.log(retryError);
					setError(SESSION_EXPIRED_ERROR);
				}
			} else {
				setError(CONNECTION_ERROR);
			}
		} finally {
			setLoading(false);
		}
	};

	return { response, error, loading, operation };
};

export default useAxios;
