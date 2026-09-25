import React from "react";

const ProgressBar = ({ bgcolor, total, completed }) => {
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const fillerStyle = {
    backgroundColor: bgcolor,
    width: `${progress}%`,
  };

  const textStyle = {
    color: bgcolor,
  };

  return (
    <div className="digit-parentDiv-progress">
      <div className="digit-containerDiv-progress">
        <div className={"digit-progress-fill"} style={fillerStyle}></div>
      </div>
      <div className={"digit-progress-text"} style={textStyle}>
        {completed}/{total} days
      </div>
    </div>
  );
};

export default ProgressBar;
