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
				<p>points: {points}</p>
			</section>
			<section className="mazeContainer">
				<canvas id={"mazeCanvas"} ref={canvasRef}></canvas>
			</section>
			<section className={"buttonContainer"}>
				<button
					className={"buttonLeft buttonGame"}
					tabIndex={4}
					onClick={() => generator.move(Direction.left)}>
					<img
						className={"buttonLeftImg buttonImg"}
						src={arrowLeft}
						alt={"Arrow Left"}
						draggable={false}
					/>
				</button>
				<section className={"arrowUpDown"}>
					<button
						className={"buttonUp buttonGame"}
						tabIndex={1}
						onClick={() => generator.move(Direction.up)}>
						<img
							className={"buttonUpImg buttonImg"}
							src={arrowUp}
							alt={"Arrow Up"}
							draggable={false}
						/>
					</button>
					<button
						className={"buttonDown buttonGame"}
						tabIndex={3}
						onClick={() => generator.move(Direction.down)}>
						<img
							className={"buttonDownImg buttonImg"}
							src={arrowDown}
							alt={"Arrow Down"}
							draggable={false}
						/>
					</button>
				</section>
				<button
					className={"buttonRight buttonGame"}
					tabIndex={2}
					onClick={() => generator.move(Direction.right)}>
					<img
						className={"buttonRightImg buttonImg"}
						src={arrowRight}
						alt={"Arrow Right"}
						draggable={false}
					/>
				</button>
			</section>
		</div>
	);
}
