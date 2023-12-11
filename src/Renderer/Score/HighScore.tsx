import React from "react";
import { useLocalStorage } from "../../Hooks/useLocalStorage";

const HighScore: React.FC<{}> = () => {
  const [state, setState] = useLocalStorage('test', 1000);
  return (
    <div className="grid-container score-container">
      <h1>Scores</h1>
      <section>
        <ol>
          <li>{state}</li>
          <li>test score 2</li>
          <li>test score 3</li>
        </ol>
      </section>
      <button onClick={() => setState(Math.floor(Math.random() * 10000))} className="play-button">Speel</button>  {/*now button change the value state*/}
      <button onClick={() => console.log("previous button pressed")} className="prev-button">Terug</button>
    </div>
  );
};

export default HighScore;