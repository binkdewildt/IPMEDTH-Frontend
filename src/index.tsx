import React from "react";
import ReactDOM from "react-dom/client";

import "./SASS/imports.scss";
import App from "./Renderer/App";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<App />);
