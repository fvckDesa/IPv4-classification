import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ScopedCssBaseline />
		<App />
	</React.StrictMode>
);
