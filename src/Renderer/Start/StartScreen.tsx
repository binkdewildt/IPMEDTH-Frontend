import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Overlay } from "../Components/Overlays/ExplanationOverlay";
import startButton from "../../Assets/mediatrigger-button.png";
import skjBanner from "../../Assets/banner.gif";

export default function StartScreen() {
	const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false);

	//todo: resize-animation startImg
	//todo: verplaats uitlegOverlay naar spel

	return (
		<section className="startScreen fullScreen">
			<h1>
				<img
					className="sinterklaasjournaalBanner"
					src={skjBanner}
					alt="Het bewegende logo van het Sinterklaasjournaal"
					height="307"
					width="642"></img>
			</h1>
			<Link className="startLink" to={"game"}>
				<img
					className="startImg"
					src={startButton}
					alt="Klik hier om de uitleg te starten"
					height="354"
					width="354"></img>
			</Link>

			<Overlay
				isOpen={isExplanationOpen}
				onClose={() => setIsExplanationOpen(!isExplanationOpen)}
			/>
		</section>
	);
}
