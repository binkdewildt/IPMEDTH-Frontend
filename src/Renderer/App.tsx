import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import StartScreen from "./Start/StartScreen";
import HighScore from "./Score/HighScore";
import Game from "./Game/Game";
import CacheBuster from "./Components/CacheBuster";

export default function App() {
	useEffect(() => {
		// Watch the 'B' button to be pressed to blur the body
		document.addEventListener("keydown", (e: KeyboardEvent) => {
			if (e.key === "b")
				document.getElementById("root")?.classList.toggle("blur");
		});
	}, []);

	return (
		<Router>
			<CacheBuster />
			<Routes>
				<Route index path="/" element={<StartScreen />} />
				<Route path="/game" element={<Game />} />
				<Route path="/end" element={<HighScore />} />
			</Routes>
		</Router>
	);
}
