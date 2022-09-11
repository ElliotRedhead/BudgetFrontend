import { Navigate } from "react-router";
import AuthenticationForm from "../components/AuthenticationForm";
import "../styles/authentication.scss";

interface AuthenticationProps {
	authMode: string
}

const Authentication = ({ authMode }:AuthenticationProps) => {
	const accessToken = localStorage.getItem("access_token");
	const refreshToken = localStorage.getItem("refresh_token");

	if (accessToken && refreshToken){
		return (
			<Navigate to="/" />
		);
	}
	return (
		<AuthenticationForm
			authMode={authMode} />
	);
};


export default Authentication;
