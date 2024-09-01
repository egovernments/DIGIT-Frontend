import React, { useState } from "react";
import TopBar from "./TopBar";
import { useHistory } from "react-router-dom";
import SideBar from "./SideBar";
import LogoutDialog from "../Dialog/LogoutDialog";
const TopBarSideBar = ({
  t,
  stateInfo,
  userDetails,
  CITIZEN,
  cityDetails,
  mobileView,
  handleUserDropdownSelection,
  logoUrl,
  showSidebar = true,
  showLanguageChange,
  linkData,
  islinkDataLoading,
}) => {
  const [isSidebarOpen, toggleSidebar] = useState(false);
  const history = useHistory();
  const [showDialog, setShowDialog] = useState(false);
  const handleLogout = () => {
    toggleSidebar(false);
    setShowDialog(true);
  };
  const handleOnSubmit = () => {
    Digit.UserService.logout();
    setShowDialog(false);
  }
  const handleOnCancel = () => {
    setShowDialog(false);
  }

  const handleSidebar = () => {
    toggleSidebar(!isSidebarOpen);
  }
  const userProfile = () => {
    history.push(`/${window?.contextPath}/employee/user/profile`);
  };
  const userOptions = [
    { name: t("EDIT_PROFILE"), icon: "Edit", func: userProfile },
    { name: t("CORE_COMMON_LOGOUT"), icon: "Logout", func: handleLogout },
  ];
  return (
    <React.Fragment>
      <TopBar
        t={t}
        stateInfo={stateInfo}
        toggleSidebar={handleSidebar}
        isSidebarOpen={isSidebarOpen}
        handleLogout={handleLogout}
        userDetails={userDetails}
        CITIZEN={CITIZEN}
        cityDetails={cityDetails}
        mobileView={mobileView}
        userOptions={userOptions}
        handleUserDropdownSelection={handleUserDropdownSelection}
        logoUrl={logoUrl}
        showLanguageChange={showLanguageChange}
      />
      {showDialog && (
        <LogoutDialog onSelect={handleOnSubmit} onCancel={handleOnCancel} onDismiss={handleOnCancel}></LogoutDialog>
      )}
      {showSidebar && (
        <SideBar
          t={t}
          CITIZEN={CITIZEN}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={handleSidebar}
          handleLogout={handleLogout}
          mobileView={mobileView}
          userDetails={userDetails}
          linkData={linkData}
          userProfile={userProfile}
          islinkDataLoading={islinkDataLoading}
        />
      )}
    </React.Fragment>
  );
};
export default TopBarSideBar;