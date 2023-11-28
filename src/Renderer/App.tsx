import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import StartScreen from "./Start/StartScreen";
import HighScore from "./Score/HighScore";
import Game from "./Game/Game";

function App() {
	return (
		<Router>
			<Routes>
				<Route index path="/" element={<StartScreen />} />
				<Route path="/game" element={<Game />} />
				<Route path="/end" element={<HighScore />} />
			</Routes>
		</Router>
	);
}

export default App;
