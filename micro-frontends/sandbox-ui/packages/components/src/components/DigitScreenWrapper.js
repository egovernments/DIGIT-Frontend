import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * Main Application Component
 * 
 * Renders the Sidebar and Topbar components along with the main content area.
 * 
 * @returns {JSX.Element} The rendered App component.
 * @author jagankumar-egov
 */
function DigitScreenWrapper({children}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <main className="pt-16 p-6">
         {children}
        </main>
      </div>
    </div>
  );
}

export default DigitScreenWrapper;
