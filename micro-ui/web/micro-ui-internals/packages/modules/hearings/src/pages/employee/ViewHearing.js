


// import { PopUp } from '@egovernments/digit-ui-components';
// import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
// import { InboxSearchComposer } from "@egovernments/digit-ui-react-components";
// import { Header} from "@egovernments/digit-ui-react-components";
// import { useTranslation } from "react-i18next";
// import ViewHearingConfig from '../../configs/ViewHearingConfig';

// const ViewHearing = () => {
//   const history = useHistory();
//   const { t } = useTranslation();
//     const config = ViewHearingConfig();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const handleNavigate = (path) => {
//     const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
//     history.push(`/${contextPath}${path}`);
//   };

//   const dropdownItems = [
//     { label: 'View Case', path: '/employee/hearings/view-case' },
//     { label: 'Reschedule hearing', path: '/employee/hearings/reschedule-hearing' },
//     { label: 'View transcript', path: '/employee/hearings/view-transcript' },
//     { label: 'View witness deposition', path: '/employee/hearings/view-witness-deposition' },
//     { label: 'View pending task', path: '/employee/hearings/view-pending-task' },
//   ];

//   return (
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//       <button
//         style={{ marginBottom: '10px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none' }}
//         onClick={() => handleNavigate('/employee/hearings/inside-hearing')}
//       >
//         Inside Hearing
//       </button>
//       <div style={{ position: 'relative' }}>
//         <button
//           style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none' }}
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//         >
//           START
//         </button>
//         {isDropdownOpen && (
//           <ul style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', border: '1px solid #ccc', listStyle: 'none', padding: 0, margin: 0, width: '200px' }}>
//             {dropdownItems.map((item) => (
//               <li
//                 key={item.path}
//                 style={{ padding: '10px', cursor: 'pointer' }}
//                 onClick={() => {
//                   handleNavigate(item.path);
//                   setIsDropdownOpen(false);
//                 }}
//               >
//                 {item.label}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
    
//   );
// };

// // export default ViewHearing;

import {
  Header,
  InboxSearchComposer
} from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchconfig } from "../../configs/hearingsSearchConfig";
import { useHistory } from 'react-router-dom';

const defaultSearchValues = {
  individualName: "",
  mobileNumber: "",
  IndividualID: ""
};



const ViewHearing = () => {

  const { t } = useTranslation();
  const history = useHistory();
  const [defaultValues, setDefaultValues] = useState(defaultSearchValues); // State to hold default values for search fields
  const indConfigs = searchconfig();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
    history.push(`/${contextPath}${path}`);
  };

  const dropdownItems = [
    { label: 'View Case', path: '/employee/hearings/view-case' },
    { label: 'Reschedule hearing', path: '/employee/hearings/reschedule-hearing' },
    { label: 'View transcript', path: '/employee/hearings/view-transcript' },
    { label: 'View witness deposition', path: '/employee/hearings/view-witness-deposition' },
    { label: 'View pending task', path: '/employee/hearings/view-pending-task' },
  ];

  useEffect(() => {
    // Set default values when component mounts
    setDefaultValues(defaultSearchValues);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    <button
      style={{ marginBottom: '10px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none' }}
      onClick={() => handleNavigate('/employee/hearings/inside-hearing')}
    >
      Inside Hearing
    </button>
    <div style={{ position: 'relative' }}>
      <button
        style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none' }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        START
      </button>
      {isDropdownOpen && (
        <ul style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', border: '1px solid #ccc', listStyle: 'none', padding: 0, margin: 0, width: '200px' }}>
          {dropdownItems.map((item) => (
            <li
              key={item.path}
              style={{ padding: '10px', cursor: 'pointer' }}
              onClick={() => {
                handleNavigate(item.path);
                setIsDropdownOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
    <React.Fragment>
      <Header >{t(indConfigs?.label)}</Header> 
      <div className="inbox-search-wrapper">
        {/* Pass defaultValues as props to InboxSearchComposer */}
        <InboxSearchComposer configs={indConfigs} defaultValues={defaultValues}></InboxSearchComposer>
      </div>
    </React.Fragment>
  </div>
  
    
  );
};
export default ViewHearing;

