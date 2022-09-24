import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

const container = document.getElementById("root");
if (container){
	const root = createRoot(container);
	root.render(
		<React.StrictMode>
			<Router>
				<App />
			</Router>
		</React.StrictMode>
	);
}
