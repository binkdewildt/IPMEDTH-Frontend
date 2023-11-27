import React from "react";
import "../SASS/imports.scss";

const HighScore: React.FC<{}> = () => {
  return (
    <p>
      <h1>Scores</h1>
      <button>Speel</button>
      <button>Terug</button>
    </p>
  );
};

export default HighScore;