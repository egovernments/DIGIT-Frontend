import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@egovernments/digit-ui-react-components";

const OverlayDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownItems = [
    { label: 'View Case', path: '/employee/hearings/view-case' },
    { label: 'Reschedule hearing', path: '/employee/hearings/reschedule-hearing' },
    { label: 'View transcript', path: '/employee/hearings/view-transcript' },
    { label: 'View witness deposition', path: '/employee/hearings/view-witness-deposition' },
    { label: 'View pending task', path: '/employee/hearings/view-pending-task' },
  ];
//[TODO: Dropdown values need to be referred from MDMS data]
  const handleNavigate = (path) => {
    const contextPath = window?.contextPath || ''; // Adjust as per your context path logic
    window.location.href = `/${contextPath}${path}`;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
 // [TODO: Inline css to be moved to css file , Component need to be referred from @egovernments/digit-ui-components]
  return (
    <div style={{ position: 'relative' }}>
      {/* Three dots or any other trigger */}
      <div
        style={{
          top: '0',
          right: '0',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          listStyle: 'none',
          padding: '5px',
          cursor: 'pointer',
          zIndex: '1000',
          width: '20px',
          textAlign: 'center',
        }}
        onClick={toggleDropdown}
      >
        {/* You can use any icon or three dots image here */}
        <span>...</span>
      </div>

      {isDropdownOpen && (
        <ul style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', border: '1px solid #ccc', listStyle: 'none', padding: 0, margin: 0, width: '200px' }}>
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
  );
};

export default OverlayDropdown;
