import React from 'react';
import { useHistory } from 'react-router-dom';

const HomeViewHearing = () => {
  const history = useHistory();

  const handleNavigate = () => {
    const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
    history.push(`/${contextPath}/employee/hearings/view-hearing`);
  };

  return (
    <button className="redirect-button" onClick={handleNavigate}>
      View Hearing
    </button>
  );
};

export default HomeViewHearing;
