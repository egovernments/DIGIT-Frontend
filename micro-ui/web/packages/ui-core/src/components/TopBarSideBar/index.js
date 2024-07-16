import React, { useState } from "react";
import { EditPencilIcon, LogoutIcon } from "@digit-ui/digit-ui-react-components";
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
  const userProfile = () => {
    history.push(`/${window?.contextPath}/employee/user/profile`);
  };
  const userOptions = [
    { name: t("EDIT_PROFILE"), icon: <EditPencilIcon className="icon" />, func: userProfile },
    { name: t("CORE_COMMON_LOGOUT"), icon: <LogoutIcon className="icon" />, func: handleLogout },
  ];
  return (
    <React.Fragment>
     
    </React.Fragment>
  );
};
export default TopBarSideBar;