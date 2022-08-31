import { useState } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse  } from "axios";

const useAxios = () => {
	const [response, setResponse] = useState<AxiosResponse>();
	const [error, setError] = useState<AxiosError>();
	const [loading, setLoading] = useState(true);

	const operation = async (params:AxiosRequestConfig) => {
		try {
			setLoading(true);
			const result = await axios.request({ ...params });
			setResponse(result);
		} catch (error){
			if (error instanceof AxiosError) {
				setError(error);
			}
		} finally {
			setLoading(false);
		}
	};

	return { response, error, loading, operation };
};

export default useAxios;
