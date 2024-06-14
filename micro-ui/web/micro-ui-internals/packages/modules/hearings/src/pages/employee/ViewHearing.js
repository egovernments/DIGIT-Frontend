// import React from 'react';
// import { useHistory } from 'react-router-dom';

// const ViewHearing = () => {
//   const history = useHistory();

//   const handleNavigate = (path) => {
//     const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
//     history.push(`/${contextPath}${path}`);
//   };

//   return (
//     <div className="button-container">
//       <button className="redirect-button" onClick={() => handleNavigate('/employee/sample/update-organization')}>
//         View Hearing 1
//       </button>
//       <button className="redirect-button" onClick={() => handleNavigate('/employee/sample/update-organization-2')}>
//         View Hearing 2
//       </button>
//       <button className="redirect-button" onClick={() => handleNavigate('/employee/sample/update-organization-3')}>
//         View Hearing 3
//       </button>
//       <button className="redirect-button" onClick={() => handleNavigate('/employee/sample/update-organization-4')}>
//         View Hearing 4
//       </button>
//       <button className="redirect-button" onClick={() => handleNavigate('/employee/sample/update-organization-5')}>
//         View Hearing 5
//       </button>
//     </div>
//   );
// };

// export default ViewHearing;

import { PopUp } from '@egovernments/digit-ui-components';
import React from 'react';
import { useHistory } from 'react-router-dom';

const ViewHearing = () => {
  const history = useHistory();

  const handleNavigate = () => {
    const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
    history.push(`/${contextPath}/employee/hearings/hearing-popup`);
  };

  return (
    <button className="redirect-button" onClick={handleNavigate}>
      Admissions hearing popup
    </button>
  );
};

export default ViewHearing;




