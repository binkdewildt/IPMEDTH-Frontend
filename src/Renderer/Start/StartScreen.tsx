import React from "react";
import { Link } from "react-router-dom";
import startButton from "../../img/start-button.png"

export default function StartScreen() {
	return (
		<section className="startScreen">
			<h1 className="title">SINTERKLAASJOURNAAL</h1>
			<button className="startButton" onClick={explanation}>
				<img className="startImage" src={startButton} alt="klik voor de uitleg"/>
			</button>
		</section>
	);
}

function explanation() {
	<section className="explanation">
		<Link className="link" to={"game"}> Start game </Link>
	</section>
}