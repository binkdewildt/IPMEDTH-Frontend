import React from "react";
import { Link } from "react-router-dom";
import startButton from "../../Assets/mediatrigger-button.png";
import skjBanner from "../../Assets/banner.gif";

	//todo: resize-animation startImg
	//todo: verplaats uitlegOverlay naar spel

export default function StartScreen() {

	return (
		<section className="startScreen fullScreen">
			<h1>
				<img
					className="sinterklaasjournaalBanner"
					src={skjBanner}
					alt="Het bewegende logo van het Sinterklaasjournaal"
					height="307"
					width="642"
				></img>
			</h1>
			<Link className="startLink" to={"game"}>
				<img
					className="startImg"
					src={startButton}
					alt="Klik hier om de uitleg te starten"
					height="354"
					width="354"
				></img>
			</Link>

		</section>
	);
}
