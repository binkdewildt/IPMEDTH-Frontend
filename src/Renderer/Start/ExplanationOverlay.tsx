import React from "react";
import startImg from "../../Assets/startButtonPink.png";

export function Overlay({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void; // Is een functie type
}) {
	//todo: resize-animation for startButton
	return (
		<>
			{isOpen && (
				<div className="overlay fullScreen">
					<div className="overlayBackground"></div>
					<h1 className="gameName">Doolhof (uitleg)</h1>
					<button className="startLink" onClick={onClose}>
						<img
							className="startImg"
							src={startImg}
							alt="Klik hier om het spel te starten"></img>
					</button>
				</div>
			)}
		</>
	);
}
