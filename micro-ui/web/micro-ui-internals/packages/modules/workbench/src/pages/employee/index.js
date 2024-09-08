import React, { useEffect } from "react";
import { Switch, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute, AppContainer, BreadCrumb } from "@egovernments/digit-ui-react-components";
import LocalisationSearch from "./LocalisationSearch";
import MDMSSearch from "./MDMSSearch";
import MDMSAdd from "./MDMSAdd";
import MDMSAddV2 from "./MDMSAddV2";
import MDMSAddV4 from "./MDMSAddV4";
import MDMSEdit from "./MDMSEdit";
import MDMSView from "./MDMSView";
import MDMSSearchv2 from "./MDMSSearchv2";
import MDMSManageMaster from "./MDMSManageMaster";
import LocalisationAdd from "./LocalisationAdd";
import WorkbenchHeader from "../../components/WorkbenchHeader";
import BoundaryHierarchyTypeAdd from "./BoundaryHierarchyTypeAdd";
import UploadBoundary from "./UploadBoundary";
import UploadBoundaryPure from "./BoundaryUploadPure";

const WorkbenchBreadCrumb = ({ location, defaultPath }) => {
  const { t } = useTranslation();
  const search = useLocation().search;
  const fromScreen = new URLSearchParams(search).get("from") || null;
  const pathVar = location.pathname.replace(defaultPath + "/", "").split("?")?.[0];
  const { masterName, moduleName, uniqueIdentifier, from, screen, action } = Digit.Hooks.useQueryParams();

  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("WORKBENCH_HOME"),
      show: true,
    },
    {
      path: `/${window.contextPath}/employee/workbench/manage-master-data`,
      content: t(`WBH_MANAGE_MASTER_DATA`),
      show: from ? false : pathVar.includes("mdms-") ? true : false,
      // query:`moduleName=${moduleName}&masterName=${masterName}`
    },
    {
      path: `/${window.contextPath}/employee/workbench/localisation-search`,
      content: t(`LOCALISATION_SEARCH`),
      show: from ? false : pathVar.includes("localisation-") ? true : false,
      isBack: pathVar.includes("localisation-search") ? true : false,
      // query:`moduleName=${moduleName}&masterName=${masterName}`
    },

    {
      path: pathVar !== "mdms-search-v2" ? `/${window.contextPath}/employee/workbench/mdms-search-v2` : null,
      query: from
        ? `moduleName=${moduleName}&masterName=${masterName}&from=${from}&screen=${screen}&action=${action}`
        : `moduleName=${moduleName}&masterName=${masterName}`,
      content: t(`${Digit.Utils.workbench.getMDMSLabel(pathVar, masterName, moduleName)}`),
      show: masterName && moduleName ? true : false,
      isBack: pathVar.includes("mdms-search-v2") ? true : false,
    },
    {
      path: `/${window.contextPath}/employee/workbench/mdms-view`,
      content: t(`MDMS_VIEW`),
      show: pathVar.includes("mdms-edit") ? true : false,
      query: from
        ? `moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}&from=${from}&screen=${screen}&action=${action}`
        : `moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}`,
    },
    {
      path: `/${window.contextPath}/employee/masters/response`,
      content: t(`${Digit.Utils.workbench.getMDMSLabel(pathVar, "", "")}`),
      show: Digit.Utils.workbench.getMDMSLabel(pathVar, "", "", ["mdms-search-v2", "localisation-search"]) ? true : false,
    },
  ];
  return <BreadCrumb className="workbench-bredcrumb" crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};

const App = ({ path }) => {
  const location = useLocation();
  const MDMSCreateSession = Digit.Hooks.useSessionStorage("MDMS_add", {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = MDMSCreateSession;

  const MDMSViewSession = Digit.Hooks.useSessionStorage("MDMS_view", {});
  const [sessionFormDataView, setSessionFormDataView, clearSessionFormDataView] = MDMSViewSession;
  const endPoint = location.pathname.replace(path + "/", "").split("?")?.[0];
  const isBoundaryPath = endPoint.includes("upload-boundary") || endPoint.includes("create-boundary-hierarchy-type");

  useEffect(() => {
    // Function to clear session storage for keys with specific prefixes
    const clearSessionStorageWithPrefix = (prefix) => {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(`Digit.${prefix}`)) {
          sessionStorage.removeItem(key);
        }
      });
    };
    const currentUrl = window.location.href;
    if (!currentUrl.includes("mdms-add-v2") && !currentUrl.includes("mdms-add-v4") && !currentUrl.includes("mdms-view")) {
      clearSessionStorageWithPrefix("MDMS_add");
    }
    if (!currentUrl.includes("mdms-view")) {
      clearSessionStorageWithPrefix("MDMS_view");
    }
    if (!currentUrl.includes("mdms-edit")) {
      clearSessionStorageWithPrefix("MDMS_edit");
    }
  }, [window.location.href]);

  useEffect(() => {
    if (!window.location.href.includes("mdms-add-v2") && sessionFormData && Object.keys(sessionFormData) != 0) {
      clearSessionFormData();
    }
    if (!window.location.href.includes("mdms-view") && sessionFormDataView) {
      clearSessionFormDataView();
    }
  }, [location]);

  return (
    <React.Fragment>
      <div className="wbh-header-container">
        <WorkbenchBreadCrumb location={location} defaultPath={path} />
        {!isBoundaryPath && <WorkbenchHeader />}
      </div>

      <Switch>
        <AppContainer className="workbench">
          <PrivateRoute path={`${path}/sample`} component={() => <div>Sample Screen loaded</div>} />
          <PrivateRoute path={`${path}/localisation-search`} component={() => <LocalisationSearch />} />
          <PrivateRoute path={`${path}/mdms-search`} component={() => <MDMSSearch />} />
          <PrivateRoute path={`${path}/mdms-add`} component={() => <MDMSAdd FormSession={MDMSCreateSession} parentRoute={path} />} />
          <PrivateRoute path={`${path}/mdms-add-v2`} component={() => <MDMSAddV2 parentRoute={path} />} />
          <PrivateRoute path={`${path}/mdms-add-v4`} component={() => <MDMSAddV4 parentRoute={path} />} />
          <PrivateRoute path={`${path}/mdms-view`} component={() => <MDMSView parentRoute={path} />} />
          <PrivateRoute path={`${path}/mdms-edit`} component={() => <MDMSEdit parentRoute={path} />} />
          <PrivateRoute path={`${path}/manage-master-data`} component={() => <MDMSManageMaster parentRoute={path} />} />
          <PrivateRoute path={`${path}/mdms-search-v2`} component={() => <MDMSSearchv2 parentRoute={path} />} />
          <PrivateRoute path={`${path}/localisation-add`} component={() => <LocalisationAdd parentRoute={path} />} />
          <PrivateRoute path={`${path}/create-boundary-hierarchy-type`} component={() => <BoundaryHierarchyTypeAdd />} />
          <PrivateRoute path={`${path}/upload-boundary`} component={() => <UploadBoundary />} />
          <PrivateRoute path={`${path}/upload-boundary-pure`} component={() => <UploadBoundaryPure />} />
        </AppContainer>
      </Switch>
    </React.Fragment>
  );
};

export default App;
