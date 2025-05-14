import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute, AppContainer } from "@egovernments/digit-ui-react-components";
import { BreadCrumb } from "@egovernments/digit-ui-components";
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
      internalLink: `/${window?.contextPath}/employee`,
      content: t("WORKBENCH_HOME"),
      show: true,
    },
    {
      internalLink: `/${window.contextPath}/employee/workbench/manage-master-data`,
      content: t(`WBH_MANAGE_MASTER_DATA`),
      show: from ? false : pathVar.includes("mdms-") ? true : false,
      // query:`moduleName=${moduleName}&masterName=${masterName}`
    },
    {
      internalLink: `/${window.contextPath}/employee/workbench/localisation-search`,
      content: t(`LOCALISATION_SEARCH`),
      show: from ? false : pathVar.includes("localisation-") ? true : false,
      isBack: pathVar.includes("localisation-search") ? true : false,
      // query:`moduleName=${moduleName}&masterName=${masterName}`
    },

    {
      internalLink: pathVar !== "mdms-search-v2" ? `/${window.contextPath}/employee/workbench/mdms-search-v2` : null,
      query: from
        ? `moduleName=${moduleName}&masterName=${masterName}&from=${from}`
        : `moduleName=${moduleName}&masterName=${masterName}`,
      content: t(`${Digit.Utils.workbench.getMDMSLabel(pathVar, masterName, moduleName)}`),
      show: masterName && moduleName ? true : false,
      isBack: pathVar.includes("mdms-search-v2") ? true : false,
    },
    {
      internalLink: `/${window.contextPath}/employee/workbench/mdms-view`,
      content: t(`MDMS_VIEW`),
      show: pathVar.includes("mdms-edit") ? true : false,
      query: from
        ? `moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}&from=${from}`
        : `moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}`,
    },
    {
      internalLink: `/${window.contextPath}/employee/masters/response`,
      content: t(`${Digit.Utils.workbench.getMDMSLabel(pathVar, "", "")}`),
      show: Digit.Utils.workbench.getMDMSLabel(pathVar, "", "", ["mdms-search-v2", "localisation-search"]) ? true : false,
    },
  ];
  return <BreadCrumb crumbs={crumbs} />;
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

        <AppContainer className="workbench">
      <Routes>
          <Route path={`${path}/sample`} element={<div>Sample Screen loaded</div>} />
          <Route path={`${path}/localisation-search`} element={<LocalisationSearch />} />
          <Route path={`${path}/mdms-search`} element={<MDMSSearch />} />
          <Route path={`${path}/mdms-add`} element={<MDMSAdd FormSession={MDMSCreateSession} parentRoute={path} />} />
          <Route path={`${path}/mdms-add-v2`} element={<MDMSAddV2 parentRoute={path} />} />
          <Route path={`${path}/mdms-add-v4`} element={<MDMSAddV4 parentRoute={path} />} />
          <Route path={`${path}/mdms-view`} element={<MDMSView parentRoute={path} />} />
          <Route path={`${path}/mdms-edit`} element={<MDMSEdit parentRoute={path} />} />
          <Route path={`${path}/manage-master-data`} element={<MDMSManageMaster parentRoute={path} />} />
          <Route path={`${path}/mdms-search-v2`} element={<MDMSSearchv2 parentRoute={path} />} />
          <Route path={`${path}/localisation-add`} element={<LocalisationAdd parentRoute={path} />} />
          <Route path={`${path}/create-boundary-hierarchy-type`} element={<BoundaryHierarchyTypeAdd />} />
          <Route path={`${path}/upload-boundary`} element={<UploadBoundary />} />
          <Route path={`${path}/upload-boundary-pure`} element={<UploadBoundaryPure />} />
        {/* <Route path="manage-master-data" element={<MDMSManageMaster parentRoute={path} />}/> */}
      </Routes>
        </AppContainer>
    </React.Fragment>
  );
};

export default App;