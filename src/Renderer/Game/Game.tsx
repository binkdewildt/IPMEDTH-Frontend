import React, {useEffect, useRef, useState} from "react";
import '../../SASS/Screens/game.scss';
import arrowDown from '../../Assets/Arrows/arrow_down.png';
import arrowUp from '../../Assets/Arrows/arrow_up.png';
import arrowLeft from '../../Assets/Arrows/arrow_left.png';
import arrowRight from '../../Assets/Arrows/arrow_right.png';
import MazeGeneration from "./Functions";


export default function Game() {

    const [level, setLevel] = useState(1)
    const canvasRef = useRef(null);

    const updateLevel = (newValue:number) =>{
        console.log("newValue: ", newValue)
        setLevel(newValue);
    }
    const run = async (canvas: any) => {
        if (canvas.current != null) {
            let mazeCanvas = canvas.current
            let ctx = mazeCanvas.getContext('2d')
            // @ts-ignore
            MazeGeneration(ctx, mazeCanvas, level, updateLevel)
        }
    }

    useEffect(() => {
        if(level<=5){
            run(canvasRef)
        }

    }, [canvasRef, level])

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
            {/*<section className={"buttonContainer"}>*/}
            {/*    <button className={"buttonLeft"}>*/}
            {/*        <img src={arrowLeft} alt={"Arrow Left"}/>*/}
            {/*    </button>*/}
            {/*    <section className={"arrowUpDown"}>*/}
            {/*        <button className={"buttonUp"}>*/}
            {/*            <img src={arrowUp} alt={"Arrow Up"}/>*/}
            {/*        </button>*/}
            {/*        <button className={"buttonDown"}>*/}
            {/*            <img src={arrowDown} alt={"Arrow Down"}/>*/}
            {/*        </button>*/}
            {/*    </section>*/}
            {/*    <button className={"buttonRight"}>*/}
            {/*        <img src={arrowRight} alt={"Arrow Right"}/>*/}
            {/*    </button>*/}
            {/*    /!*<button className={"load"} onClick={makeMaze}>*!/*/}
            {/*    /!*    load*!/*/}
            {/*    /!*</button>*!/*/}
            {/*</section>*/}

        </div>
    );
}
