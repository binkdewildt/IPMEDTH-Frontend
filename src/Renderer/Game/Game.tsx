import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
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
        }else{
            navigate('/end')
        }

    }, [canvasRef, containerRef, level, navigate])

    //todo: get the real stuff for cropping and moving

    /* move and resize crop
    */


    return (
        <div className="game">
            <section className={"stage"}>
                <h1>level: {level}</h1>
            </section>
            <section className="mazeContainer" ref={containerRef}>
                <canvas id={"mazeCanvas"} ref={canvasRef}>
                </canvas>
            </section>
            <section className={"buttonContainer"}>
                <button className={"buttonLeft buttonGame"} tabIndex={4}>
                    <img className={"buttonLeftImg buttonImg"} src={arrowLeft} alt={"Arrow Left"} draggable={false}/>
                </button>
                <section className={"arrowUpDown"}>
                    <button className={"buttonUp buttonGame"} tabIndex={1}>
                        <img className={"buttonUpImg buttonImg"} src={arrowUp} alt={"Arrow Up"} draggable={false}/>
                    </button>
                    <button className={"buttonDown buttonGame"} tabIndex={3}>
                        <img className={"buttonDownImg buttonImg"} src={arrowDown} alt={"Arrow Down"} draggable={false}/>
                    </button>
                </section>
                <button className={"buttonRight buttonGame"} tabIndex={2}>
                    <img className={"buttonRightImg buttonImg"} src={arrowRight} alt={"Arrow Right"} draggable={false}/>
                </button>
            </section>

        </div>
    );
}
