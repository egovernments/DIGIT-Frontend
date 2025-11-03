import React from "react";
import { CitizenSideBar } from "./CitizenSideBar";
import EmployeeSideBar from "./EmployeeSideBar";

const SideBar = ({ t, CITIZEN, isSidebarOpen, toggleSidebar, handleLogout, mobileView, userDetails, modules, linkData, islinkDataLoading,userProfile}) => {
  if (CITIZEN)
    return (
      <CitizenSideBar
        isOpen={isSidebarOpen}
        isMobile={true}
        toggleSidebar={toggleSidebar}
        onLogout={handleLogout}
        linkData={linkData}
        islinkDataLoading={islinkDataLoading}
        userProfile={userProfile}
        isEmployee={false}
      />
    );
    else {
      return !isSidebarOpen && userDetails?.access_token ? (
        <div className="digit-employeeSidebar">
          <EmployeeSideBar {...{ mobileView, userDetails, modules }} />
        </div>
      ) : (
        <div className="digit-citizenSidebar">
          <CitizenSideBar
            isOpen={isSidebarOpen}
            isMobile={true}
            toggleSidebar={toggleSidebar}
            onLogout={handleLogout}
            isEmployee={true}
            userProfile={userProfile}
          />
        </div>
      );
    }
};

export default SideBar;
