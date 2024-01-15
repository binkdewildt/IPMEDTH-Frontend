import React, { useState, useEffect, useMemo, useRef } from 'react';
import startImg from "../../../Assets/startButtonPink.png";
import present from "../../../Assets/Cadeaus/cadeau.png";
import presentSound from "../../../Assets/sounds/pickup.mp3";
import presentDiewertje from "../../../Assets/sounds/breng_de_cadeautjes.mp3";
import shoe from "../../../Assets/schoen.png";
import shoeSound from "../../../Assets/sounds/finish.mp3";
import shoeDiewertje from "../../../Assets/sounds/naar_de_schoen.mp3";
import light from "../../../Assets/light.png";
import lightSound from "../../../Assets/sounds/ignition.mp3";
import lightDiewertje from "../../../Assets/sounds/met_de_lamp_kan_piet_verder_zien.mp3";
import exampleMaze from "../../../Assets/example_maze.png";
import pietStanding from "../../../Assets/Player/piet.webp";
import pietDown from "../../../Assets/Player/pietMovingForward.gif";
import pietHorizontal from "../../../Assets/Player/pietMovingHorizontal.gif";
import pietLeft from "../../../Assets/Player/pietMovingLeft.gif";
import wallSound from "../../../Assets/sounds/error.mp3";
import stepSound from "../../../Assets/sounds/footsteps.mp3";
import buttons from "../../../Assets/buttonsPicture.png";
import cursor from "../../../Assets/cursorImage.png";

const isPhoneScreen = window.innerWidth < window.innerHeight;


export function Overlay({ isOpen, onClose } : { isOpen: boolean, onClose: () => void }) {
	return (
		<>
			{isOpen && (
				<div className="overlay">
					<div className="overlayBackground"></div>

					<h1 className="gameName">Doolhof</h1>

					{
						<Explanation></Explanation>
					}
					
					<button className="startLink" onClick={onClose}>
						<img
							className="startImg"
							src={startImg}
							alt="Klik hier om het spel te starten"
						></img>
					</button>
				</div>
			)}
		</>
	);
}

function Explanation() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [positionAssetsContainer, setPositionAssetsContainer] = useState("assetsContainer_right");
	const [maze, setMaze] = useState(false);

	return (
		<>
			{ maze === true ? 
			<>
				<MazeButtons></MazeButtons>
			</>
			: <></>}
			<div className="subjectContainer">
				<div className="subjectBorder"></div>
				{ maze === true ? 
				<>
					<MazeExample></MazeExample>
				</> 
				: <></> }
			</div>
			<div className="blinkBorder"></div>
			<div className={`assetsContainer ${positionAssetsContainer}`}>
				<Asset
					umpteenth={0}
					isActive={activeIndex===0}
					textDiewertje={presentDiewertje}
					sound={presentSound}
					imgAlt="cadeautje"
					imgSrc={present}
					onShow={() => {
						if (!isPhoneScreen) setPositionAssetsContainer(shiftAsset(activeIndex));
						setActiveIndex(1);
					}}
				></Asset>
				<Asset
					umpteenth={1}
					isActive={activeIndex===1}
					textDiewertje={shoeDiewertje}
					sound={shoeSound}
					imgAlt="schoen"
					imgSrc={shoe}
					onShow={() => {
						if (!isPhoneScreen) setPositionAssetsContainer(shiftAsset(activeIndex));
						setActiveIndex(2);
					}}
				></Asset>
				<Asset
					umpteenth={2}
					isActive={activeIndex===2}
					textDiewertje={lightDiewertje}
					sound={lightSound}
					imgAlt="lamp"
					imgSrc={light}
					onShow={() => {
						setActiveIndex(3);
						if (!isPhoneScreen) endAssets();
						setMaze(true);
					}}
				></Asset>
			</div>
		</>
	);
}

function MazeButtons() {
	return (
		<>
			<img className="buttons" src={buttons} alt="Afbeelding van vier knoppen die in het spel gebruikt worden."></img>
			<img className="cursor" src={cursor} alt="cursor"></img>
		</>
	);
}

function MazeExample() {
	const errorSoundRef = useRef<HTMLAudioElement | null>(null);
	const stepSoundRef = useRef<HTMLAudioElement | null>(null);
	const [mazeExampleStyle, setMazeExampleStyle] = useState( moveMaze(1,2)	);
	const [pietState, setPietState] = useState(`${pietStanding}`)
	useEffect(() => {
		blinkSubjectBorder("0px");
		setMazeExampleStyle(moveMaze(1,2));
		moveCursor("");
		const timer0 = setTimeout(() => {
			setPietState(`${pietHorizontal}`);
			moveCursor("right");
		}, 400);
		const timer1 = setTimeout(() => {
			setMazeExampleStyle(moveMaze(1.4, 2));
			if(errorSoundRef.current !== null) {
				errorSoundRef.current.play();
			}
		}, 600)
		const timer2 = setTimeout(() => {
			moveCursor("");
			setPietState(`${pietLeft}`)
		}, 1100);
		const timer3 = setTimeout(() => {
			setMazeExampleStyle(moveMaze(1, 2));
			setPietState(`${pietStanding}`);
		}, 1700)

		const timer4 = setTimeout(() => {
			moveCursor("down");
			setPietState(`${pietDown}`);
		}, 2500)
		const timer5 = setTimeout(() => {
			setMazeExampleStyle(moveMaze(1, 2.5));
		}, 3100)
		const timer6 = setTimeout(() => {
			setMazeExampleStyle(moveMaze(1, 3));
			setPietState(`${pietStanding}`);
			moveCursor("");
		}, 3500)
		return () => {
			clearTimeout(timer0);
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
			clearTimeout(timer4);
			clearTimeout(timer5);
			clearTimeout(timer6);
		}
	}, [])

	return (
		<>
			<img className="mazeExample" style={mazeExampleStyle} alt="doolhof" src={exampleMaze}></img>
			<img className="piet" alt="roetveegpiet" src={pietState}></img>
			<audio ref={errorSoundRef}>
				<source src={wallSound} type="audio/mpeg"></source>
				Your browser does not support the audio element.
			</audio>
			<audio ref={stepSoundRef}>
				<source src={stepSound} type="audio/mpeg"></source>
				Your browser does not support the audio element.
			</audio>
		</>
	);
}

function Asset({ umpteenth, isActive, textDiewertje, sound, imgSrc, imgAlt, onShow }: AssetProps) {
	const assetStyles = useMemo(
		() => setAssetStyles(umpteenth),
		[umpteenth]
	);
	const [assetStyle, setAssetStyle] = useState(assetStyles.small);
	const soundRef = useRef<HTMLAudioElement | null>(null);
	const diewertjeRef = useRef<HTMLAudioElement | null>(null);
	var bigBorder: string;
	if (isPhoneScreen) {
		bigBorder = "calc(10vh + 2px)";
	} else {
		bigBorder = "calc(15vh + 2px)";
	}

	useEffect(() => {
		if(isActive) {

			const timer1 = setTimeout(() => {
				setAssetStyle(assetStyles.big);
				blinkSubjectBorder("0px");
				if(soundRef.current !== null) {
					soundRef.current.play();
				}
				if(diewertjeRef.current !== null) {
					diewertjeRef.current.play();
				}
			}, 400)

			const timer2 = setTimeout(() => {
				blinkSubjectBorder(bigBorder);
			}, 2500);

			const timer3 = setTimeout(() => {
				setAssetStyle(assetStyles.small);
				onShow();
			}, 3000);

			return () => {
				clearTimeout(timer1);
				clearTimeout(timer2);
				clearTimeout(timer3);
			}
		}
	}, [isActive, bigBorder, assetStyles, textDiewertje, onShow])

	return (
		<>
			<audio className="diewertje" ref={diewertjeRef}>
				<source src={textDiewertje} type="audio/mpeg"></source>
				Your browser does not support the audio element.
			</audio>
			<audio className="sound" ref={soundRef}>
				<source src={sound} type="audio/mpeg"></source>
				Your browser does not support the audio element.
			</audio>
			<img 
				className="asset"
				style={assetStyle}
				src={imgSrc}
				alt={imgAlt}
			></img>
		</>
	);
}


function moveCursor(position: string) {
	const cursor = document.getElementsByClassName("cursor")[0] as HTMLImageElement;
	console.log("cursor beweegt");
	if (isPhoneScreen) {
		switch (position) {
			case "right":
				cursor.style.left = "60vw";
				cursor.style.top = "calc(58vh + 15vw)";
				break;
			case "down": 
				cursor.style.left = "45vw";
				cursor.style.top = "calc(58vh + 20vw)";
				break;
			default:
				cursor.style.left = "30vw";
				cursor.style.top = "calc(58vh + 2vw)";
		}
	} else {
		switch (position) {
			case "right":
				cursor.style.left = "82vw";
				cursor.style.top = "calc(38vh + 5vw)";
				break;
			case "down": 
				cursor.style.left = "75vw";
				cursor.style.top = "calc(38vh + 10vw)";
				break;
			default:
				cursor.style.left = "70vw";
				cursor.style.top = "calc(38vh + 1vw)";
		}
	}
}

function moveMaze(coordinateX: number, coordinateY: number) {
	const left = isPhoneScreen ? 11 - 78.5 * coordinateX : 24 - 52.5 * coordinateX;
	const top = isPhoneScreen ? 11 - 78.5 * coordinateY : 24 - 52.5 * coordinateY;
	const circleLeft = coordinateX * 20 + 10;
	const circleTop = coordinateY * 20 + 10;

	return ({
		left: `calc( ${left}%)`,
		top: `calc( ${top}%)`,
		clipPath: isPhoneScreen 
			? `circle(calc(20vh / 2) at ${circleLeft}% ${circleTop}%)`
			: `circle(calc(30vh / 2) at ${circleLeft}% ${circleTop}%)`
	})

}


function setAssetStyles(index: number) {

	const bigAssetStyle = {
		top: isPhoneScreen ? `calc(0.20 * ${window.innerHeight}px)` : "0px",
		left: isPhoneScreen ? `calc(50% - 10vw)` : "0px",
		transform: isPhoneScreen ? "scale(calc(4/3))" : "scale(2)"
	};
	const smallAssetStyle = {
		left: isPhoneScreen 
			? `calc( 0.1 * ${window.innerWidth}px + ${index} * 0.28 * ${window.innerWidth}px)` 
			: "0px",
		transform: "scale(1)"
	};
	return {big: bigAssetStyle, small: smallAssetStyle};
}

function shiftAsset (activeIndex: number) {
	console.log("nu aan het shiften");
	const classname = calculatePositionAssetsContainer(activeIndex + 1);
	return classname;
}

function endAssets () {
	const container = document.getElementsByClassName("assetsContainer")[0] as HTMLDivElement;
	container.style.display = "inline-grid";
	console.log("opgeruimd staat netjes");
}

function blinkSubjectBorder(borderWidth: string) {
	const border = document.getElementsByClassName("blinkBorder")[0] as HTMLDivElement;
	if (border) {
		border.style.borderWidth = borderWidth;
		console.log("border.style.borderWidth: " + border.style.borderWidth);
	} else {
		console.log("huh waar ben ik");
	}
}

function calculatePositionAssetsContainer(activeIndex: number) {
	let text = "assetsContainer";
	switch(activeIndex) {
		case 0:
			text += "_right";
			break;
		case 1:
			text += "_middle";
			break;
		case 2:
			text += "_left";
			break;
	}
	return text;
}


interface AssetProps {
	umpteenth: number;
	isActive: boolean;
	textDiewertje: string;
	sound: any;
	imgSrc: any;
	imgAlt: string
	onShow: () => void;
}