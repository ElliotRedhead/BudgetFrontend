import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_ROOT, LOGIN, REGISTER } from "../constants";
import useAxios from "../hooks/useAxios";
import { validateEmail } from "../utilities/validateEmail";
import { validatePassword } from "../utilities/validatePassword";

interface AuthenticationProps {
	authMode: string
}

const AuthenticationForm = ({ authMode }:AuthenticationProps) => {
	const [email, setEmail] = useState<string>("");
	const [emailError, setEmailError] = useState<string|null>();
	const [password, setPassword] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string[]>([]);
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [confirmPasswordError, setConfirmPasswordError] = useState<string|null>();
	const [headingText, setHeadingText] = useState<string>();
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const { response, loading, error, operation } = useAxios();

	useEffect(() => {
		if (authMode === REGISTER){
			setHeadingText("Create a new account");
		} else {
			setHeadingText("Log in to your account");
		}
	}, [authMode]);

	useEffect(() => {
		if (email && validateEmail(email)) {
			setEmailError(null);
		} else {
			setEmailError("Please enter a valid email.");
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
		if (emailError || passwordError.length || confirmPasswordError){
			setSubmitDisabled(true);
		} else {
			setSubmitDisabled(false);
		}
	}, [emailError, passwordError, confirmPasswordError]
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
		if (response !== (null||undefined)){
			localStorage.setItem("access_token", response?.data.access);
			localStorage.setItem("refresh_token", response?.data.refresh);
			navigate("/");

		}
	}, [response, navigate]);

	return (
		<div className="d-flex flex-column justify-content-center align-items-center vh-100">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-11 col-lg-5 container-bkg pb-5 py-5 rounded shadow">
						<h2 className="pb-3 text-center">
							{headingText}
						</h2>
						{loading ? (
							<div
								className="spinner-border text-secondary"
								role="status">
								<span className="visually-hidden">
									Loading...
								</span>
							</div>
						)
							:
							(
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
													required={true}
													value={email}
													onChange={e => setEmail(e.target.value)}
													type="text"
													name="email"
													id="email-input"
													placeholder="Email" />
											</div>
											{
												(email && emailError) &&
												<div className="error">
													{emailError}
												</div>
											}
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
													required={true}
													value={password}
													onChange={e => setPassword(e.target.value)}
													type="password"
													name="password"
													id="password-input"
													placeholder="Password" />
											</div>
											{
												(password && passwordError) &&
												<div className="error">
													{passwordError}
												</div>
											}
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
														required={true}
														value={confirmPassword}
														onChange={e => setConfirmPassword(e.target.value)}
														type="password"
														name="confirmpassword"
														id="confirm-password-input"
														placeholder="Confirm Password" />
												</div>
												{
													(confirmPassword && confirmPasswordError) &&
													<div className="error">
														{confirmPasswordError}
													</div>
												}
											</div>
										}
										<button
											className="btn text-capitalize mt-1 mb-2 col-5"
											id="submit-button"
											type="submit"
											disabled={submitDisabled}>
											{ authMode }
										</button>
										{authMode === REGISTER ?
											<Link
												className="text-center"
												to={`/${LOGIN}`}>
												Already have an account? Login here
											</Link> :
											<Link
												className="text-center"
												to={`/${REGISTER}`}>
												Need to create an account? Register here
											</Link>}
									</div>
								</form>
							)}

					</div>
				</div>
			</div>
		</div>
		
	);
};


export default AuthenticationForm;
