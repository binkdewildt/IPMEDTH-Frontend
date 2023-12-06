import React from "react";
import { useLocalStorage } from "../../Hooks/useLocalStorage";
import { Link } from "react-router-dom";

const HighScore: React.FC<{}> = () => {
  const [state, _] = useLocalStorage('test', 1000);
  return (
    <div className="grid-container">
      <h1>Scores</h1>
      <section>
        <ol>
          <li>{state}</li>
          <li>test score 2</li>
          <li>test score 3</li>
        </ol>
      </section>
      <Link className="button-highScore button-highScore--play" to={"/game"}> Speel </Link>
      <Link className="button-highScore button-highScore--prev" to={"/"}> Terug </Link>

      {/*play-button changes the value state*/}
      {/* <button onClick={() => setState(Math.floor(Math.random() * 10000))} className="play-button">Speel</button> */}
      {/* <button onClick={() => console.log("previous button pressed")} className="prev-button">Terug</button> */}
    </div>
  );
};

export default HighScore;