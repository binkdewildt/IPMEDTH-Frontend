import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
	return (
		<Router basename="IPMEDTH-Frontend">
			<Routes>
				<Route index path="/" element={<div style={{width: "100px", height: "100px", background: "green"}}></div>} />
				<Route path="/game" element={<div style={{width: "100px", height: "100px", background: "red"}}></div>} />
				<Route path="/end" element={<div style={{width: "100px", height: "100px", background: "orange"}}></div>} />
			</Routes>
		</Router>
	);
}

export default App;
