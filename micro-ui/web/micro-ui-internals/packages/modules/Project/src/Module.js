import { CitizenInfoLabel, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import ProjectCard from "./components/ProjectCard";
import SelectGeoLocation from "./components/SelectGeoLocation";
import SubProjectDetailsTable from "./components/SubProjectDetailsTable";
import ViewFinancialDetails from "./pageComponents/ViewFinancialDetails";
import ViewSubProjectsDetails from "./pageComponents/ViewSubProjectsDetails";
import { default as EmployeeApp } from "./pages/employee";
import CreateProjectResponse from "./pages/employee/CreateProject/CreateProjectResponse";
import CreateProject from "./pages/employee/CreateProject/index";
import ProjectDetails from "./pages/employee/ProjectDetails";
import ProjectSearch from "./pages/employee/ProjectSearch";
import ProjectSearchAndInbox from "./pages/employee/ProjectSearchAndInbox";
import ProjectWMSSearch from "./pages/employee/ProjectWMSSearch";
import SampleComp from "./SampleComp";
import CreateProjectForm from "./pages/employee/CreateProject/CreateProjectForm";
import ViewProject from "./pageComponents/ViewProject";


export const ProjectModule = ({ stateCode, userType, tenants }) => {
  
  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const moduleCode = ["Project","common-masters",tenantId];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  if (isLoading) {
    return <Loader />;
  }
  return <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />;
};

const componentsToRegister = {
    ProjectModule,
    ProjectsCard :ProjectCard,
    CreateProject,
    ProjectDetails,
    ViewFinancialDetails,
    ProjectSearch,
    ProjectSearchAndInbox,
    SubProjectDetailsTable,
    CreateProjectResponse,
    CreateProjectForm,
    ViewSubProjectsDetails,
    CitizenInfoLabel,
    SelectGeoLocation,
    ProjectWMSSearch,
    ViewProject,
    GenericViewTestComp:SampleComp
};

export const initProjectComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
