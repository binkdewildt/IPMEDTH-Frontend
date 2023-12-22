import React from "react";

import piet from "../../Assets/Player/piet.webp";
import pietMovingHorizontal from "../../Assets/Player/pietMovingHorizontal.gif";
import pietMovingForward from "../../Assets/Player/pietMovingForward.gif";

import schoen from "../../Assets/schoenTransparant.webp";
import present1 from "../../Assets/Cadeaus/cadeau.png";
import present2 from "../../Assets/Cadeaus/cadeau2.png";
import present3 from "../../Assets/Cadeaus/cadeau.webp";

import error from "../../Assets/sounds/error.mp3";
import finish from "../../Assets/sounds/finish.mp3";
import footsteps from "../../Assets/sounds/footsteps.mp3";
import footsteps2 from "../../Assets/sounds/footsteps_2.mp3";
import ignition from "../../Assets/sounds/ignition.mp3";
import pickup from "../../Assets/sounds/pickup.mp3";

// Functie die wordt gebruikt om alvast wat images en audio's in te laden
// Dit zodat deze niet geladen hoeven te worden tijdens het spel,
// en deze dus direct beschikbaar zijn.
// Voorbeelden hiervan zijn de movingImages & de presents & de finish schoen
export default function CacheBuster() {
	return (
		<div style={{ display: "none" }} aria-hidden="true">
			<img src={piet} alt="Cache buster for Piet" />
			<img
				src={pietMovingHorizontal}
				alt="Cache buster for Piet moving Horizontal"
			/>
			<img src={pietMovingForward} alt="Cache buster for Piet moving Forward" />

			<img src={schoen} alt="Cache buster for Schoen" />
			<img src={present1} alt="Cache buster for Present1" />
			<img src={present2} alt="Cache buster for Present2" />
			<img src={present3} alt="Cache buster for Present3" />

			<audio><source src={error} type="audio/mp3" /></audio>
			<audio><source src={finish} type="audio/mp3" /></audio>
			<audio><source src={footsteps} type="audio/mp3" /></audio>
			<audio><source src={footsteps2} type="audio/mp3" /></audio>
			<audio><source src={ignition} type="audio/mp3" /></audio>
			<audio><source src={pickup} type="audio/mp3" /></audio>
		</div>
	);
}
