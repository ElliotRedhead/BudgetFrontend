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

const App = () => (
	<Router>
		<div>
			{/* <nav>
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
			</nav> */}
			<Routes>
				<Route
					path="/expenses"
					element={<Expenses />} />
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
