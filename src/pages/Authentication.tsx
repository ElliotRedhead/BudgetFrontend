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
	const [headingText, setHeadingText] = useState("");
	const [submitDisabled, setSubmitDisabled] = useState(true);

	useEffect(() => {
		if (authMode === REGISTER){
			setHeadingText("Create a new account");
		} else {
			setHeadingText("Log in to your account");
		}
	}, [authMode]);

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
		console.table({
			"emailError": Boolean(emailError),
			"passwordError": Boolean(passwordError)
		});
		if (emailError || passwordError.length || confirmPasswordError){
			setSubmitDisabled(true);
		} else {
			setSubmitDisabled(false);
		}
	}, [emailError, passwordError]
	);

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
		<div className="d-flex flex-column justify-content-center align-items-center vh-100">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-11 col-lg-5 container-bkg pb-5 py-5 rounded shadow">
						<h2 className="pb-3 text-center">
							{headingText}
						</h2>
						<form
							className="d-flex justify-content-center"
							onSubmit={formSubmit}>
							<div className="row justify-content-center">
								<div className="form-group col-12 col-md-8 mb-2">
									<label
										htmlFor="email-input"
										className="col-12">
										Email address
									</label>
									<div className="input-group my-1">
										<span className="input-group-text bi bi-person-circle" />
										<input
											className="form-control"
											value={email}
											onChange={e => setEmail(e.target.value)}
											type="text"
											name="email"
											id="email-input"
											placeholder="Email" />
									</div>
									<div className="error">
										{emailError}
									</div>
								</div>
								<div className="form-group col-12 col-md-8 mb-2">
									<label
										htmlFor="password-input"
										className="col-12">
										Password
									</label>
									<div className="input-group my-1">
										<span className="input-group-text bi bi-key" />
										<input
											className="form-control"
											value={password}
											onChange={e => setPassword(e.target.value)}
											type="password"
											name="password"
											id="password-input"
											placeholder="Password" />
									</div>
									<div className="error">
										{passwordError}
									</div>
								</div>
								{
									authMode === REGISTER &&
									<div className="form-group col-12 col-md-8 mb-2">
										<label
											htmlFor="confirm-password-input"
											className="col-12">
											Confirm password
										</label>
										<div className="input-group my-1">
											<span className="input-group-text bi bi-key" />
											<input
												className="form-control"
												value={confirmPassword}
												onChange={e => setConfirmPassword(e.target.value)}
												type="password"
												name="confirmpassword"
												id="confirm-password-input"
												placeholder="Confirm Password" />
										</div>
										<div className="error">
											{confirmPasswordError}
										</div>
									</div>
								}
								<button
									className="btn text-capitalize mt-1 col-6"
									id="submit-button"
									type="submit"
									disabled={submitDisabled}>
									{ authMode }
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Authentication;
