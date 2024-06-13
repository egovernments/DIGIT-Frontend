import React from 'react';
import { useHistory } from 'react-router-dom';

const ViewWitnessDeposition = () => {
  const history = useHistory();

  const handleNavigate = () => {
    const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
    history.push(`/${contextPath}/employee/hearings/hearing-popup`);
  };

  return (
    <button className="redirect-button" onClick={handleNavigate}>
      no flow after this
    </button>
  );
};

export default ViewWitnessDeposition;