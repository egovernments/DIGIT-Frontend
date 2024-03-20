import React, { useEffect } from "react";
import { Switch, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute, AppContainer, BreadCrumb } from "@egovernments/digit-ui-react-components";
import WorkflowCompTest from "./WorkflowCompTest";
// import SampleComp from "./SampleComp";
const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const search = useLocation().search;
  const fromScreen = new URLSearchParams(search).get("from") || null;
  const crumbs = [
    {
        path: `/${window?.contextPath}/employee`,
        content: t("WORKS_MUKTA"),
        show: true,
    },
    {
      path: `/${window.contextPath}/employee/project/create-project`,
      content: fromScreen ? `${t(fromScreen)} / ${t("WORKS_PROJECT")}` : t("WORKS_PROJECT"),
      show: location.pathname.includes("/project/create-project") ? true : false,
      isBack: fromScreen && true,
    },
    {
      path: `/${window.contextPath}/employee/project/search-project`,
      content: fromScreen ? `${t(fromScreen)} / ${t("WORKS_SEARCH_PROJECTS")}` : t("WORKS_SEARCH_PROJECTS"),
      show: location.pathname.includes("/project/search-project") ? true : false,
      isBack: fromScreen && true,
    },
    {
      // path: `/${window.contextPath}/employee/project/project-details`,
      content: fromScreen ? `${t(fromScreen)} / ${t("WORKS_PROJECT_DETAILS")}` : t("WORKS_PROJECT_DETAILS"),
      show: location.pathname.includes("/project/project-details") ? true : false,
      isBack: fromScreen && true,
    },
    {
      path: `/${window.contextPath}/employee/project/inbox`,
      content: fromScreen ? `${t(fromScreen)} / ${t("WORKS_PROJECT")}` : t("WORKS_PROJECT"),
      show: location.pathname.includes("/project/inbox") ? true : false,
      isBack: fromScreen && true,
    }
  ];
  return <BreadCrumb crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};

const App = ({ path }) => {
  const CreateProjectComponent = Digit?.ComponentRegistryService?.getComponent("CreateProject");
  const ProjectDetailsComponent = Digit?.ComponentRegistryService?.getComponent("ProjectDetails");
  const ProjectSearchComponent = Digit?.ComponentRegistryService?.getComponent("ProjectWMSSearch");
  const ProjectSearchAndInboxComponent = Digit?.ComponentRegistryService?.getComponent("ProjectSearchAndInbox");
  const CreateProjectResponseComponent = Digit?.ComponentRegistryService?.getComponent("CreateProjectResponse");
  const projectSession = Digit.Hooks.useSessionStorage("NEW_PROJECT_CREATE", {});
  const [sessionFormData, clearSessionFormData] = projectSession;
  const location = useLocation();

  const EstimateSession = Digit.Hooks.useSessionStorage("NEW_ESTIMATE_CREATE", {});
  const [sessionFormDataEst, clearSessionFormDataEst] = EstimateSession;

  //remove session form data if user navigates away from the project create screen
  useEffect(()=>{
      if (!window.location.href.includes("create-project") && sessionFormData && Object.keys(sessionFormData) != 0) {
        clearSessionFormData();
      }
  },[location]);

  //remove session form data if user navigates away from the estimate create screen
  useEffect(()=>{
    if (!window.location.href.includes("create-estimate") && sessionFormDataEst && Object.keys(sessionFormDataEst) != 0) {
      clearSessionFormDataEst();
    }
  },[location]);

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <PrivateRoute path={`${path}/create-project`} component={() => <CreateProjectComponent parentRoute={path}/>} />
        <PrivateRoute path={`${path}/project-details`} component={() => <ProjectDetailsComponent parentRoute={path}/>} />
        <PrivateRoute path={`${path}/search-project`} component={() => <ProjectSearchComponent parentRoute={path}/>} />
        <PrivateRoute path={`${path}/inbox`} component={() => <ProjectSearchAndInboxComponent parentRoute={path}/>} />
        <PrivateRoute path={`${path}/create-project-response`} component={() => <CreateProjectResponseComponent parentRoute={path}/>} />
        <PrivateRoute path={`${path}/workflow`} component={() => <WorkflowCompTest parentRoute={path} />} />
        {/* <PrivateRoute path={`${path}/sample`} component={() => <SampleComp parentRoute={path} />} /> */}
      </AppContainer>
    </Switch>
  );
};

export default App;
