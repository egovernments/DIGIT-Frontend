import { Loader } from "@digit-ui/digit-ui-react-components";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import AttendenceMgmtCard from "./components/AttendenceMgmtCard";
import CitizenApp from "./pages/citizen";
import { default as EmployeeApp } from "./pages/employee";
import mobileInbox from "./components/markAttendenceInbox/mobileInbox";
import ViewRegister from "./pages/citizen/viewRegister/ViewRegister";
import ViewProjects from "./components/ViewProjectsInbox.js/ViewProjects";
import Inbox from "./pages/employee/Inbox";
import AttendenceInboxFilter from "./components/inbox/InboxFilter";
import AttendenceInboxSearch from "./components/inbox/InboxSearch";
import ViewAttendance from "./pages/employee/viewAttendance/ViewAttendances";

export const AttendenceMgmtModule = ({ stateCode, userType, tenants }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const moduleCode = ["AttendenceMgmt","common-masters","workflow",tenantId];
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  if (isLoading) {
      return <Loader />;
  }
  if (userType === "employee") {
      return <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />;
  }
  return <CitizenApp path={path} stateCode={stateCode} />;
};

const componentsToRegister = {
    AttendenceMgmtCard,
    AttendenceMgmtModule,
    AttendenceMgmtInbox: Inbox,
    ViewAttendance,
    ViewRegister,
    ViewProjects,
    AttendenceInboxFilter,
    AttendenceInboxSearch
};

export const initAttendenceMgmtComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};