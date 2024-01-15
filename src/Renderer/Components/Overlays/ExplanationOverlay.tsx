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

	//todo: introduce navigation

export function Overlay({ isOpen, onClose } : { isOpen: boolean, onClose: () => void }) {
	const [navigation, setNavigation] = useState(false);
	return (
		<>
			{isOpen && (
				<div className="overlay">
					<div className="overlayBackground"></div>

					<h1 className="gameName">Doolhof</h1>

					{
						<Explanation
							navigation={navigation}
							onDone={() => {
								setNavigation(true);
							}}
						></Explanation>
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

function Explanation({ navigation, onDone} : { navigation: boolean, onDone: () => void}) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [positionAssetsContainer, setPositionAssetsContainer] = useState("assetsContainer_right");


	return (
		<>
			<div className="subjectContainer">
				<div className="subjectBorder"></div>
			</div>
			<div className="blinkBorder"></div>
			<div className={`assetsContainer ${positionAssetsContainer}`}>
				<Asset
					isActive={activeIndex===0}
					textDiewertje={presentDiewertje}
					sound={presentSound}
					imgAlt="cadeautje"
					imgSrc={present}
					onShow={() => {
						setPositionAssetsContainer(shiftAsset(activeIndex));
						setActiveIndex(1);
					}}
				></Asset>
				<Asset
					isActive={activeIndex===1}
					textDiewertje={shoeDiewertje}
					sound={shoeSound}
					imgAlt="schoen"
					imgSrc={shoe}
					onShow={() => {
						setPositionAssetsContainer(shiftAsset(activeIndex));
						setActiveIndex(2);
					}}
				></Asset>
				<Asset
					isActive={activeIndex===2}
					textDiewertje={lightDiewertje}
					sound={lightSound}
					imgAlt="lamp"
					imgSrc={light}
					onShow={() => {
						setActiveIndex(3);
						endAssets();
						onDone();
					}}
				></Asset>
			</div>
		</>
	);
}

function Asset({ isActive, textDiewertje, sound, imgSrc, imgAlt, onShow}: AssetProps) {
	const assetStyles = useMemo(
		() => setAssetStyles(),
		[]
	);
	const [assetStyle, setAssetStyle] = useState(assetStyles.small);
	const soundRef = useRef<HTMLAudioElement | null>(null);
	const diewertjeRef = useRef<HTMLAudioElement | null>(null);
	const bigBorder = "calc(15vh + 2px)";

	useEffect(() => {
		if(isActive) {

			const timer1 = setTimeout(() => {
				setAssetStyle(assetStyles.big);
				blinkSubjectBorder("");
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
	}, [isActive, assetStyles, textDiewertje, onShow])

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


function setAssetStyles() {
	const bigAssetStyle = {
		transform: "scale(2)"
	};
	const smallAssetStyle = {
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
	isActive: boolean;
	textDiewertje: string;
	sound: any;
	imgSrc: any;
	imgAlt: string
	onShow: () => void;
}