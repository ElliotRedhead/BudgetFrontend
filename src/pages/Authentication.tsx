import { useEffect, useState } from "react";
import { validateEmail } from "../utilities/validateEmail";
import { validatePassword } from "../utilities/validatePassword";
import { LOGIN, REGISTER, API_ROOT } from "../constants";
import useAxios from "../hooks/useAxios";

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
		if (response !== null){
			localStorage.setItem("access_token", response.access);
			localStorage.setItem("refresh_token", response.refresh);
		}
	}, [response]);

	return (
		<div>
			<form onSubmit={formSubmit}>
				<h3>
					{ authMode }
				</h3>
				<input
					value={email}
					onChange={e => setEmail(e.target.value)}
					type="text"
					name="email"
					placeholder="Email" />
				<div className="error">
					{emailError}
				</div>

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
				<button type="submit">
					Submit
				</button>
			</form>
		</div>
	);
};

export default Authentication;
