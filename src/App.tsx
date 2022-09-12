import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link
} from "react-router-dom";
import Expenses from "./pages/Expenses";
import Authentication from "./pages/Authentication";
import { LOGIN, REGISTER } from "./constants";
import "./styles/bootstrap.scss";
import "./styles/bootstrap-icons.scss";
import "./styles/common.scss";
import jwtDecode from "jwt-decode";

import { Navigate, Outlet } from "react-router-dom";
interface DecodedToken {
	exp: number
}
const PrivateRoutes = () => {
	const accessToken = localStorage.getItem("access_token");
	if (accessToken){
		const decodedToken:DecodedToken = jwtDecode(accessToken);
		const currentDate = new Date();
		let tokenExpired = true;
		if (decodedToken.exp * 1000 < currentDate.getTime()) {
			tokenExpired = true;
		} else {
			tokenExpired = false;
		}
		return (
			tokenExpired ? <Navigate to="/login" /> : <Outlet />
		);
	}
	return <Navigate to="login" />;
};

const App = () => (
	<Router>
		<div>
			<nav>
				<ul>
					<li>
						<Link to="/expenses">
							Expenses
						</Link>
					</li>
					<li>
						<Link to="/login">
							Login
						</Link>
					</li>
					<li>
						<Link to="/register">
							Register
						</Link>
					</li>
				</ul>
			</nav>
			<Routes>
				<Route element={<PrivateRoutes />}>
					<Route
						path="/expenses"
						element={<Expenses />} />
				</Route>
				<Route
					path="/login"
					element={<Authentication authMode={LOGIN} />} />
				<Route
					path="/register"
					element={<Authentication authMode={REGISTER} />} />
			</Routes>
		</div>
	</Router>
);

export default App;
