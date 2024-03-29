import React, { useState } from "react";
import startButton from "../../Assets/mediatrigger-button.png";
import skjBanner from "../../Assets/banner.gif";
import { Overlay } from "../Components/Overlays/ExplanationOverlay";

export default function StartScreen() {
	const [explanationOpen, setExplanationOpen] = useState<boolean>(false);

	return (
		<section className="startScreen fullScreen">
			{/*h1 tag voor schermlezer*/}
			<h1 className={"hidden-header"} aria-label={"Sinterklaasjournaal doolhof"}>Sinterklaasjournaal doolhof</h1>
			<img
				className="sinterklaasjournaalBanner"
				aria-hidden
				src={skjBanner}
				alt="Het bewegende logo van het Sinterklaasjournaal"
				height="307"
				width="642"></img>
			<button aria-label="Uitleg" className="startLink" onClick={() => setExplanationOpen(true)}>
				<img
					className="startImg"
					aria-hidden
					src={startButton}
					alt="Start de uitleg"
					height="354"
					width="354"
				></img>
			</button>
			<Overlay isOpen={explanationOpen} />

		</section>
	);
}
