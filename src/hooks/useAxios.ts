import { useState } from "react";
import axios, { AxiosRequestHeaders } from "axios";

type Methods = "head" | "options" | "put" | "post" | "patch" | "delete" | "get";

interface axiosParams {
	url: string,
	method: Methods,
	data: object,
	headers: AxiosRequestHeaders,
}

interface authResponse {
	access: string,
	refresh: string
}

type APIResponse = authResponse

const useAxios = () => {
	const [response, setResponse] = useState<APIResponse|null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	const operation = async (params:axiosParams) => {
		try {
			setLoading(true);
			const result = await axios.request({ ...params });
			setResponse(result.data);
		} catch (error){
			setError(String(error));
		} finally {
			setLoading(false);
		}
	};


	return { response, error, loading, operation };
};

export default useAxios;
