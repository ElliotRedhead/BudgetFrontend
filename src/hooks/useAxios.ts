import { useRef, useState } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse  } from "axios";
import { API_ROOT } from "../constants";

const useAxios = () => {
	const [response, setResponse] = useState<AxiosResponse>();
	const [error, setError] = useState<AxiosError|string>();
	const [loading, setLoading] = useState(false);
	const retryCount = useRef(0);

	const operation = async (params:AxiosRequestConfig) => {
		try {
			setLoading(true);
			const result = await axios.request({ ...params });
			setResponse(result);
		} catch (error){
			if (error instanceof AxiosError) {
				if (error.response?.data.code === "token_not_valid"){
					if (retryCount.current > 1){
						setError(error);
					} else {
						try {
							// TODO: Handle missing refresh token from local storage
							const refresh = await axios.request({
								method: "post",
								url: `${API_ROOT}/user/refresh/`,
								data: { "refresh": localStorage.getItem("refresh_token") }
							});
							localStorage.setItem("access_token", refresh?.data.access);
							localStorage.setItem("refresh_token", refresh?.data.refresh);
							params.headers = { "Authorization": `JWT ${refresh?.data.access}` };
							retryCount.current += 1;
							operation(params);
						} catch (error){
							if (axios.isAxiosError(error)){
								setError(error);
							} else {
								// TODO: Redirect to login on error, handy to log errors externally
								setError("Authentication error, please login");
							}
						}
					}
				}
			}
		} finally {
			setLoading(false);
		}
	};

	return { response, error, loading, operation };
};

export default useAxios;
