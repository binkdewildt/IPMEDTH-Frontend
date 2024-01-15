import React, { useEffect } from "react";
import { useLocalStorage } from "../../Hooks/useLocalStorage";
import { Link, useLocation } from "react-router-dom";

const HighScore: React.FC<{}> = () => {
	const { state } = useLocation();
	const [highscores, setHighscores] = useLocalStorage("highscores", []);

	//#region UseEffects
	// Voor het eenmalig opslaan van de highscores in de localStorage.
	// Wanneer dit in de game wordt gedaan is deze niet snel genoeg met opslaan
	// wat er voor zorgt dat niet alle scores zichtbaar zijn
	useEffect(() => {
		if (state !== null) setHighscores(state);
	}, [state, setHighscores]);
	//#endregion

	return (
		<div className="score-container">
			<h1 tabIndex={0} aria-label={"Scores"}>Scores</h1>
			<section className="highScoreList">
				<ol tabIndex={0} aria-label={"scorelijst"}>
					{(state ?? highscores ?? []).map((score: number, index: number) => {
						return <li tabIndex={0} key={index}> {score} </li>;
					})}
				</ol>
			</section>
			<Link className="button-highScore button-highScore--play" to={"/game"}>
				Speel
			</Link>
			<Link className="button-highScore button-highScore--prev" to={"/"}>
				Terug
			</Link>
		</div>
	);
};

export default HighScore;
