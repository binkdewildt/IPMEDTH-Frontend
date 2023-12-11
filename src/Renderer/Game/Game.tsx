import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import '../../SASS/Screens/game.scss';
import arrowDown from '../../Assets/Arrows/arrow_down.png';
import arrowUp from '../../Assets/Arrows/arrow_up.png';
import arrowLeft from '../../Assets/Arrows/arrow_left.png';
import arrowRight from '../../Assets/Arrows/arrow_right.png';
import MazeGeneration from "../../Models/Maze/MazeGenerator";


export default function Game() {

    const [level, setLevel] = useState(1)
    const canvasRef =useRef<HTMLCanvasElement | null>(null);
    const containerRef =useRef<HTMLElement | null>(null);
    const navigate = useNavigate();

    const updateLevel = (newValue:number) =>{
        console.log("newValue: ", newValue)
        setLevel(newValue);
    }

    useEffect(() => {
        if(level<=5){
            if (canvasRef.current != null && containerRef.current != null) {
                let mazeCanvas = canvasRef.current
                let ctx = mazeCanvas.getContext('2d')
                // @ts-ignore
                MazeGeneration(ctx, mazeCanvas, level, updateLevel, containerRef.current)
            }
            // run(canvasRef)
        }else{
            navigate('/end')
        }

    }, [containerRef.current, level, navigate])

    return (
        <div className={"game"}>
            <section className={"stage"}>
                <h1>level: {level}</h1>
                {/*<image>hier komt de progressbar</image>*/}
            </section>
            <section className="mazeContainer" ref={containerRef}>
                <canvas id={"mazeCanvas"} ref={canvasRef}>
                    {/*hier komt het doolhof*/}
                </canvas>
            </section>
            <section className={"buttonContainer"}>
                <button className={"buttonLeft"}>
                    <img className={"buttonLeftImg buttonImg"} src={arrowLeft} alt={"Arrow Left"} draggable={false}/>
                </button>
                <section className={"arrowUpDown"}>
                    <button className={"buttonUp"}>
                        <img className={"buttonUpImg buttonImg"} src={arrowUp} alt={"Arrow Up"} draggable={false}/>
                    </button>
                    <button className={"buttonDown"}>
                        <img className={"buttonDownImg buttonImg"} src={arrowDown} alt={"Arrow Down"} draggable={false}/>
                    </button>
                </section>
                <button className={"buttonRight"}>
                    <img className={"buttonRightImg buttonImg"} src={arrowRight} alt={"Arrow Right"} draggable={false}/>
                </button>
                {/*<button className={"load"} onClick={makeMaze}>*/}
                {/*    load*/}
                {/*</button>*/}
            </section>

        </div>
    );
}
