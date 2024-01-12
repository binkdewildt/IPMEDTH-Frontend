import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowDown from "../../Assets/Arrows/arrow_down.png";
import arrowUp from "../../Assets/Arrows/arrow_up.png";
import arrowLeft from "../../Assets/Arrows/arrow_left.png";
import arrowRight from "../../Assets/Arrows/arrow_right.png";
import MazeGenerator from "../../Models/Maze/MazeGenerator";
import { Direction } from "../../Models/Maze/MazeModels";
import { useLocalStorage } from "../../Hooks/useLocalStorage";

export default function Game() {
	const [level, setLevel] = useState<number>(1);
	const [points, setPoints] = useState<number>(0);
	const [localPoints] = useLocalStorage<number[]>("highscores", []);

	const [generator] = useState(() => new MazeGenerator());

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const navigate = useNavigate();

	//#region UseEffects

	// Voor het doorsturen van de canvasRef wanneer die wordt gezet
	useEffect(() => {
		if (canvasRef.current != null) {
			generator.setCanvas(canvasRef.current);
			generator.Generate();
		}
	}, [canvasRef, generator]);

	// Voor eenmalig initalizeren
	useEffect(() => {
		generator.setPoints = setPoints;
		generator.setLevel = setLevel;
	}, [generator]);

	// Voor het navigeren naar het einde
	useEffect(() => {
		// Checken of het spel is beïndigd
		if (level > 5) {

			// Bereken de nieuwe highScores en geef deze mee aan de volgende view
			// Daar pas opslaan in de localStorage, hier namelijk niet snel genoeg met opslaan
			let newPoints = localPoints ?? [];
			newPoints.push(points);
			newPoints = newPoints.sort((a, b) => b - a).slice(0, 3);
			navigate("/end", { state: newPoints });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigate, level]);
	//#endregion

	return (
		<div className="game">
			<section className={"stage"}>
				<h1>level: {level}</h1>
				<h2>punten: {points}</h2>
			</section>
			
			<div className="mazeContainer" aria-hidden>
				<figure id="player"></figure>
				<canvas id={"mazeCanvas"} ref={canvasRef}></canvas>
			</div>
			<div className={"buttonContainer"}>
				<button
					className={"buttonLeft buttonGame"}
					aria-label={"Links"}
					tabIndex={4}
					// tabIndex={1}
					onClick={() => generator.move(Direction.left)}>
					<img
						className={"buttonLeftImg buttonImg"}
						aria-hidden
						src={arrowLeft}
						alt={"Arrow Left"}
						draggable={false}
					/>
				</button>
				<div className={"arrowUpDown"}>
					<button
						className={"buttonUp buttonGame"}
						aria-label={"Omhoog"}
						tabIndex={1}
						// tabIndex={2}
						onClick={() => generator.move(Direction.up)}>
						<img
							className={"buttonUpImg buttonImg"}
							aria-hidden
							src={arrowUp}
							alt={"Arrow Up"}
							draggable={false}
						/>
					</button>
					<button
						className={"buttonDown buttonGame"}
						aria-label={"Omlaag"}
						tabIndex={3}
						// tabIndex={4}
						onClick={() => generator.move(Direction.down)}>
						<img
							className={"buttonDownImg buttonImg"}
							aria-hidden
							src={arrowDown}
							alt={"Arrow Down"}
							draggable={false}
						/>
					</button>
				</div>
				<button
					className={"buttonRight buttonGame"}
					aria-label={"Rechts"}
					tabIndex={2}
					// tabIndex={3}
					onClick={() => generator.move(Direction.right)}>
					<img
						className={"buttonRightImg buttonImg"}
						aria-hidden
						src={arrowRight}
						alt={"Arrow Right"}
						draggable={false}
					/>
				</button>
			</div>
		</div>
	);
}
