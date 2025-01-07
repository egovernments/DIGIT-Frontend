import React from 'react';

const ProgressBar = ({ amount, total }) => {
  const percentage = Math.min((amount / total) * 100, 100);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={{ width: `${percentage}%` }}>
        <span className="progress-bar-text">{`${percentage.toFixed(1)}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
