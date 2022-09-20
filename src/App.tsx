import { Container, Nav, Navbar, NavItem } from "react-bootstrap"; 
import {
	BrowserRouter as Router,
	Link,
	Navigate,
	Outlet,
	Route,
	Routes
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

const App = () => {
	const refreshToken = localStorage.getItem("refresh_token");

	return (
		<Router>
			<>
				<Navbar
					bg="light"
					variant="light"
					expand="lg">
					<Container>
						<Navbar.Toggle aria-controls="navigation-bar" />
						<Navbar.Collapse id="navigation-bar">
							<Nav className="me-auto">
								{refreshToken ? 
									<>
										<NavItem>
											<Link
												className="nav-link"
												to="/expenses">
												Expenses
											</Link>
										</NavItem>
									</>
									:
									<>
										<NavItem>
											<Link 
												className="nav-link"
												to="/register">
												Register
											</Link>
										</NavItem>
										<NavItem>
											<Link
												className="nav-link"
												to="/login">
												Login
											</Link>
										</NavItem>
									</>}
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>
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
			</>
		</Router>
	);
};

export default App;
