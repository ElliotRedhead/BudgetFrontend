import { useEffect, useState } from "react";
import { validateEmail } from "../utilities/validateEmail";
import { validatePassword } from "../utilities/validatePassword";
import { LOGIN, REGISTER, API_ROOT } from "../constants";
import useAxios from "../hooks/useAxios";
import "../styles/authentication.scss";

interface AuthenticationProps {
	authMode: string
}

const Authentication = ({ authMode }:AuthenticationProps) => {
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState([""]);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const { response, loading, error, operation } = useAxios();

	useEffect(() => {
		if (!email) {
			setEmailError("");
		} else {
			if (validateEmail(email)) {
				setEmailError("");
			} else {
				setEmailError("Please enter a valid email.");
			}
		}
		if (!password) {
			setPasswordError([]);
		} else {
			const passwordValidation = validatePassword(password);
			if (passwordValidation.success) {
				setPasswordError([]);
			} else {
				if (passwordValidation.reason){
					setPasswordError(passwordValidation.reason);
				}
			}
		}
	}, [email, password]);

	useEffect(() => {
		if (authMode === REGISTER && (!confirmPassword || !password)) {
			setConfirmPasswordError("");
		} else {
			if (password !== confirmPassword) {
				setConfirmPasswordError("The passwords must match.");
			} else {
				setConfirmPasswordError("");
			}
		}
	}, [authMode, password, confirmPassword]);

	const formSubmit = async (event:any) => {
		event.preventDefault();
		if (authMode === REGISTER){
			operation({
				method: "post",
				url: `${API_ROOT}/user/register/`,
				data: {
					"email": email,
					"password": password 
				},
				headers: {}
			});
		} else if (authMode === LOGIN){
			operation({
				method: "post",
				url: `${API_ROOT}/user/login/`,
				data: {
					"email": email,
					"password": password 
				},
				headers: {}
			});
		}
	};

	useEffect(() => {
		if (response !== null && response !== undefined){
			localStorage.setItem("access_token", response?.data.access);
			localStorage.setItem("refresh_token", response?.data.refresh);
		}
	});

	return (
		<div className="d-flex justify-content-center align-items-center vh-100">
			<div className="container container-bkg p-5 rounded shadow">
				<form onSubmit={formSubmit}>
					<span className="bi bi-person-circle" />
					<input
						className="br-5 px-3 py-2"
						value={email}
						onChange={e => setEmail(e.target.value)}
						type="text"
						name="email"
						placeholder="Email" />
					<div className="error">
						{emailError}
					</div>
					<span className="bi bi-key" />
					<input
						value={password}
						onChange={e => setPassword(e.target.value)}
						type="password"
						name="password"
						placeholder="Password" />
					<div className="error">
						{passwordError}
					</div>
					{authMode === REGISTER &&
					<>
						<input
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
							type="password"
							name="confirmpassword"
							placeholder="Confirm Password" />
						<div className="error">
							{confirmPasswordError}
						</div>
					</>}
					<button
						className="titlecase"
						id="submit-button"
						type="submit">
						{ authMode }
					</button>
				</form>
			</div>
		</div>
	);
};

export default Authentication;
