


import { PopUp } from '@egovernments/digit-ui-components';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const HearingPopup = () => {
  const history = useHistory();
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

  return (
    <PopUp type="default">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <button
        style={{ marginBottom: '10px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none' }}
        onClick={() => handleNavigate('/employee/hearings/inside-hearings')}
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
    </div>
    </PopUp>
  );
};

export default HearingPopup;

