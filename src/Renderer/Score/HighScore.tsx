import React from "react";

const HighScore: React.FC<{}> = () => {
  return (
    <div className="grid-container">
      <h1>Scores</h1>
      <section>
        <ol>
          <li>test score 1</li>
          <li>test score 2</li>
          <li>test score 3</li>
        </ol>
      </section>
      <button className="play-button">Speel</button>
      <button className="prev-button">Terug</button>
    </div>
  );
};

export default HighScore;