import React, { useState } from "react";
import TopBar from "./TopBar";
import { useNavigate } from "react-router-dom";
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
  logoUrlWhite,
  showSidebar = true,
  showLanguageChange,
  linkData,
  islinkDataLoading,
}) => {
  const [isSidebarOpen, toggleSidebar] = useState(false);
  const navigate = useNavigate()
  const [showDialog, setShowDialog] = useState(false);
  const handleLogout = () => {
    toggleSidebar(false);
    setShowDialog(true);
  };

  const clearSSOLogoutMarkers = () => {
    localStorage.removeItem("sso-provider");
    localStorage.removeItem("sso-client-id");
    localStorage.removeItem("sso-tenant-id");
    localStorage.removeItem("sso-authority");
    localStorage.removeItem("sso-logout-url");
  };

  const getSSOPostLogoutRedirectUri = () => `${window.location.origin}/${window?.contextPath || ""}/employee`;

  const handleSSOLogout = async () => {
    const provider = localStorage.getItem("sso-provider");
    const normalizedProvider = provider?.toUpperCase();
    const logoutUrlFromConfig = localStorage.getItem("sso-logout-url");

    if (logoutUrlFromConfig) {
      const postLogoutRedirectUri = getSSOPostLogoutRedirectUri();
      clearSSOLogoutMarkers();

      try {
        await Digit.UserService.logout();
      } finally {
        try {
          const url = new URL(logoutUrlFromConfig);
          url.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
          window.location.href = url.toString();
        } catch (error) {
          window.location.href = `${logoutUrlFromConfig}?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
        }
      }

      return true;
    }

    if (normalizedProvider === "GOOGLE") {
      const postLogoutRedirectUri = getSSOPostLogoutRedirectUri();
      const token = localStorage.getItem("google_access_token");
      clearSSOLogoutMarkers();

      try {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.disableAutoSelect();
        }

        if (token) {
          await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`, {
            method: "POST",
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
          });
          localStorage.removeItem("google_access_token");
        }

        await Digit.UserService.logout();
      } catch (error) {
        console.error("Google logout error", error);
        await Digit.UserService.logout();
      } finally {
        window.location.href = postLogoutRedirectUri;
      }

      return true;
    }

    if (normalizedProvider === "MICROSOFT") {
      const tenantId = localStorage.getItem("sso-tenant-id");
      const authority = localStorage.getItem("sso-authority") || "https://login.microsoftonline.com";
      const postLogoutRedirectUri = getSSOPostLogoutRedirectUri();
      clearSSOLogoutMarkers();

      try {
        await Digit.UserService.logout();
      } finally {
        if (tenantId) {
          const baseLogoutUrl = `${authority.replace(/\/+$/, "")}/${tenantId}/oauth2/logout`;
          window.location.href = `${baseLogoutUrl}?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
        }
      }

      return true;
    }

    return false;
  };

  const handleOnSubmit = async () => {
    const handledBySSO = await handleSSOLogout();
    if (!handledBySSO) {
      Digit.UserService.logout();
    }
    setShowDialog(false);
  };
  const handleOnCancel = () => {
    setShowDialog(false);
  };

  const handleSidebar = () => {
    toggleSidebar(!isSidebarOpen);
  };
  const userProfile = () => {
    CITIZEN ? navigate(`/${window?.contextPath}/citizen/user/profile`) : navigate(`/${window?.contextPath}/employee/user/profile`);
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
        logoUrlWhite={logoUrlWhite}
        showLanguageChange={showLanguageChange}
      />
      {showDialog && <LogoutDialog onSelect={handleOnSubmit} onCancel={handleOnCancel} onDismiss={handleOnCancel}></LogoutDialog>}
      {!CITIZEN
        ? showSidebar && (
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
          )
        : CITIZEN
        ? showSidebar && isSidebarOpen && (
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
          )
        : null}
    </React.Fragment>
  );
};
export default TopBarSideBar;
