import React from "react";
import { CitizenSideBar } from "./CitizenSideBar";
import EmployeeSideBar from "./EmployeeSideBar";

const SideBar = ({ t, CITIZEN, isSidebarOpen, toggleSidebar, handleLogout, mobileView, userDetails, modules, linkData, islinkDataLoading }) => {
  if (CITIZEN)
    return (
      <CitizenSideBar
        isOpen={isSidebarOpen}
        isMobile={true}
        toggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        linkData={linkData}
        islinkDataLoading={islinkDataLoading}
      />
    );
  else {
    return (!isSidebarOpen && userDetails?.access_token) ? (
      <div className="digit-employeeSidebar">
        <EmployeeSideBar {...{ mobileView, userDetails, modules }} />
      </div>
    ) : (
      <div className="digit-citizenSidebar">
        <CitizenSideBar isOpen={isSidebarOpen} isMobile={true} toggleSidebar={toggleSidebar} onLogout={handleLogout} isEmployee={true} />
      </div>
    );
  }
};

export default SideBar;
