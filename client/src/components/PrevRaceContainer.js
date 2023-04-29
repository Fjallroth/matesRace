import React from "react";

const PrevRaceContainer = ({ title }) => {
  return (
    <div className="header flex justify-between items-center w-full">
      <h1 className="text-xl font-bold text-purple-800">{title}</h1>
    </div>
  );
};

export default PrevRaceContainer;
