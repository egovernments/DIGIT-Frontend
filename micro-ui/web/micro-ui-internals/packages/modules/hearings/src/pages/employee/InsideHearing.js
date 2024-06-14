import React from 'react';
import { useHistory } from 'react-router-dom';

const InsideHearing = () => {
  const history = useHistory();

  const handleNavigate = () => {
    const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
    history.push(`/${contextPath}/employee/hearings/inside-hearing`);
  };

  return (
    <button className="redirect-button" onClick={handleNavigate}>
      Inside hearing main
    </button>
  );
};

export default InsideHearing;