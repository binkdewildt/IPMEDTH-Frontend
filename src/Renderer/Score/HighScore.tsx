import React from "react";

const HighScore: React.FC<{}> = () => {
  return (
    <p>
      <h1>Scores</h1>
      <section>
        <ol>
          <li>test1</li>
          <li>test2</li>
          <li>test3</li>
        </ol>
      </section>
      <button className="play">Speel</button>
      <button className="prev">Terug</button>
      {/* <div className="button-container">
        <button>Speel</button>
        <button>Terug</button>
      </div> */}
    </p>
  );
};

export default HighScore;