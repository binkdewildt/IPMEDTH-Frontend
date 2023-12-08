import React from "react";
//import { useState } from 'react';
import { Link } from "react-router-dom";
import startButton from "../../Assets/mediatrigger-button.png";
import skjBanner from "../../Assets/banner.gif";

export default function StartScreen() {
	//todo: resize-animation startImg
	return (
		<section className="startScreen">
			<img className="sinterklaasjournaalBanner" src={skjBanner} alt="Het bewegende logo van het Sinterklaasjournaal" height="307" width="642"></img>
			<Link className="gameLink" to={"game"}> 
				<img className="startImg" src={startButton} alt="Klik hier om de uitleg te starten" height="354" width="354"></img>
			</Link>
		</section>
	);
}
