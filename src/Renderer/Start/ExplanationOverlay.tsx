import React from "react";
import startImg from "../../Assets/startButtonPink.png"

export function Overlay( {isOpen, onClose}: {isOpen: boolean, onClose: any} ) {//todo: zoek uit wat onClose daadwerkelijk is
    //todo: resize-animation for startButton
    return (
        <>{
            isOpen && (
                <div className="explanationOverlay fullScreen">
                    <div className="overlayBackground"></div>
                    <h1 className="gameName">Doolhof (uitleg)</h1>
                    <button className="startLink" onClick={onClose}>
                        <img className="startImg" src={startImg} alt="Klik hier om het spel te starten"></img>
                    </button>
                </div>
            )
        }</>
    )
}