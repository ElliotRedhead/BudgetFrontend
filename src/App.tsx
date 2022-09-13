import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
	Outlet
} from "react-router-dom";
import Expenses from "./pages/Expenses";
import Authentication from "./pages/Authentication";
import { LOGIN, REGISTER } from "./constants";
import jwtDecode from "jwt-decode";
import { DecodedToken } from "./types/DecodedTokenType";

import "./styles/bootstrap.scss";
import "./styles/bootstrap-icons.scss";
import "./styles/common.scss";

const PrivateRoutes = () => {
	const refreshToken = localStorage.getItem("refresh_token");
	if (refreshToken){
		const decodedToken:DecodedToken = jwtDecode(refreshToken);
		const currentDate = new Date();
		if (currentDate.getTime() > decodedToken.exp * 1000) {
			localStorage.removeItem("refresh_token");
			localStorage.removeItem("access_token");
			return <Navigate to="/login" />;
		} else {
			return <Outlet />;
		}
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
