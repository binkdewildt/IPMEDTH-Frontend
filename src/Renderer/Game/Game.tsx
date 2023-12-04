import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import '../../SASS/Screens/game.scss';
import arrowDown from '../../Assets/Arrows/arrow_down.png';
import arrowUp from '../../Assets/Arrows/arrow_up.png';
import arrowLeft from '../../Assets/Arrows/arrow_left.png';
import arrowRight from '../../Assets/Arrows/arrow_right.png';
import MazeGeneration from "./Functions";


export default function Game() {

    const [level, setLevel] = useState(1)
    const canvasRef =useRef<HTMLCanvasElement | null>(null);
    const navigate = useNavigate();

    const updateLevel = (newValue:number) =>{
        console.log("newValue: ", newValue)
        setLevel(newValue);
    }

    useEffect(() => {
        if(level<=5){
            if (canvasRef.current != null) {
                let mazeCanvas = canvasRef.current
                let ctx = mazeCanvas.getContext('2d')
                // @ts-ignore
                MazeGeneration(ctx, mazeCanvas, level, updateLevel)
            }
            // run(canvasRef)
        }else{
            navigate('/end')
        }

    }, [canvasRef, level, navigate])

    return (
        <div className={"game"}>
            <section className={"stage"}>
                <p>level: {level}</p>
                {/*<image>hier komt de progressbar</image>*/}
            </section>
            <section className="mazeContainer">
                <canvas id={"mazeCanvas"} ref={canvasRef}>
                    hier komt het doolhof
                </canvas>
            </section>
            <section className={"buttonContainer"}>
                <button className={"buttonLeft"}>
                    <img className={"buttonLeftImg"} src={arrowLeft} alt={"Arrow Left"}/>
                </button>
                <section className={"arrowUpDown"}>
                    <button className={"buttonUp"}>
                        <img className={"buttonUpImg"} src={arrowUp} alt={"Arrow Up"}/>
                    </button>
                    <button className={"buttonDown"}>
                        <img className={"buttonDownImg"} src={arrowDown} alt={"Arrow Down"}/>
                    </button>
                </section>
                <button className={"buttonRight"}>
                    <img className={"buttonRightImg"} src={arrowRight} alt={"Arrow Right"}/>
                </button>
                {/*<button className={"load"} onClick={makeMaze}>*/}
                {/*    load*/}
                {/*</button>*/}
            </section>

        </div>
    );
}
