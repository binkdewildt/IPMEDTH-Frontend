import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import StartScreen from "./Start/StartScreen";

function App() {
	return (
		<Router>
			<Routes>
				<Route index path="/" element={<StartScreen />} />
				<Route path="/game" element={<div style={{width: "100px", height: "100px", background: "red"}}></div>} />
				<Route path="/end" element={<div style={{width: "100px", height: "100px", background: "orange"}}></div>} />
			</Routes>
		</Router>
	);
}

export default App;
