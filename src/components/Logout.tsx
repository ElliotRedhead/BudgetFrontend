import axios from "axios";
import { API_ROOT } from "../constants";

export const Logout = () => {
	const refreshToken = localStorage.getItem("refresh_token");
	localStorage.removeItem("access_token");
	localStorage.removeItem("refresh_token");
	if (refreshToken){
		// Revoke the refresh token server-side. Logging out locally doesn't wait
		// for this, and a failure only leaves a token that expires anyway.
		axios.request({
			method: "post",
			url: `${API_ROOT}/user/logout/`,
			data: { "refresh": refreshToken }
		}).catch(error => console.log(error));
	}
};
