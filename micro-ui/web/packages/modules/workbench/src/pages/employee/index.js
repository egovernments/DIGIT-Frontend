import React, { useEffect } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute, AppContainer } from "@egovernments/digit-ui-react-components";
import { BreadCrumb } from "@egovernments/digit-ui-components";
import WorkbenchHeader from "../../components/WorkbenchHeader";
import { lazyWithFallback } from "@egovernments/digit-ui-components";

// Create lazy components with fallbacks using the utility
const LocalisationSearch = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-localisation-search" */ "./LocalisationSearch"),
  () => require("./LocalisationSearch").default,
  { loaderText: "Loading Localisation Search..." }
);

const MDMSSearch = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-mdms-search" */ "./MDMSSearch"),
  () => require("./MDMSSearch").default,
  { loaderText: "Loading MDMS Search..." }
);


const MDMSAddV2 = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-mdms-add-v2" */ "./MDMSAddV2"),
  () => require("./MDMSAddV2").default,
  { loaderText: "Loading MDMS Add V2..." }
);

const MDMSAddV4 = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-mdms-add-v4" */ "./MDMSAddV4"),
  () => require("./MDMSAddV4").default,
  { loaderText: "Loading MDMS Add V4..." }
);

const MDMSEdit = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-mdms-edit" */ "./MDMSEdit"),
  () => require("./MDMSEdit").default,
  { loaderText: "Loading MDMS Edit..." }
);

const MDMSView = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-mdms-view" */ "./MDMSView"),
  () => require("./MDMSView").default,
  { loaderText: "Loading MDMS View..." }
);

const MDMSSearchv2 = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-mdms-search-v2" */ "./MDMSSearchv2"),
  () => require("./MDMSSearchv2").default,
  { loaderText: "Loading MDMS Search V2..." }
);

const MDMSManageMaster = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-mdms-manage-master" */ "./MDMSManageMaster"),
  () => require("./MDMSManageMaster").default,
  { loaderText: "Loading MDMS Manage Master..." }
);

const LocalisationAdd = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-localisation-add" */ "./LocalisationAdd"),
  () => require("./LocalisationAdd").default,
  { loaderText: "Loading Localisation Add..." }
);

const BoundaryHierarchyTypeAdd = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-boundary-hierarchy-type-add" */ "./BoundaryHierarchyTypeAdd"),
  () => require("./BoundaryHierarchyTypeAdd").default,
  { loaderText: "Loading Boundary Hierarchy Type Add..." }
);

const UploadBoundary = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-upload-boundary" */ "./UploadBoundary"),
  () => require("./UploadBoundary").default,
  { loaderText: "Loading Upload Boundary..." }
);

const UploadBoundaryPure = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-boundary-upload-pure" */ "./BoundaryUploadPure"),
  () => require("./BoundaryUploadPure").default,
  { loaderText: "Loading Upload Boundary Pure..." }
);

const SidebarSearch = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-sidebar-config" */ "./SidebarSearch"),
  () => require("./SidebarSearch").default,
  { loaderText: "Loading Sidebar Config..." }
);

const SidebarView = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-sidebar-view" */ "./SidebarView"),
  () => require("./SidebarView").default,
  { loaderText: "Loading Sidebar Items..." }
);

const SidebarAdd = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-sidebar-add" */ "./SidebarAdd"),
  () => require("./SidebarAdd").default,
  { loaderText: "Loading Sidebar Add..." }
);

const MDMSManager = lazyWithFallback(
  () => import(/* webpackChunkName: "workbench-mdms-manager" */ "../../components/MDMSData"),
  () => require("../../components/MDMSData").default,
  { loaderText: "Loading MDMS Manager..." }
);

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
          <Route path="localisation-search" element={<PrivateRoute element={<LocalisationSearch />} />} />
          <Route path="mdms-search" element={<PrivateRoute element={<MDMSSearch />} />} />
          <Route path="mdms-search-v2" element={<PrivateRoute element={<MDMSSearchv2 parentRoute={path} />} />} />
          <Route path="mdms-add-v2" element={<PrivateRoute element={<MDMSAddV2 parentRoute={path} />} />} />
          <Route path="mdms-add-v4" element={<PrivateRoute element={<MDMSAddV4 parentRoute={path} />} />} />
          <Route path="mdms-view" element={<PrivateRoute element={<MDMSView parentRoute={path} />} />} />
          <Route path="mdms-edit" element={<PrivateRoute element={<MDMSEdit parentRoute={path} />} />} />
          <Route path="manage-master-data" element={<PrivateRoute element={<MDMSManageMaster parentRoute={path} />} />} />
          <Route path="localisation-add" element={<PrivateRoute element={<LocalisationAdd parentRoute={path} />} />} />
          <Route path="create-boundary-hierarchy-type" element={<PrivateRoute element={<BoundaryHierarchyTypeAdd />} />} />
          <Route path="upload-boundary" element={<PrivateRoute element={<UploadBoundary />} />} />
          <Route path="upload-boundary-pure" element={<PrivateRoute element={<UploadBoundaryPure />} />} />
          <Route path="sidebar-search" element={<PrivateRoute element={<SidebarSearch />} />} />
          <Route path="sidebar-view" element={<PrivateRoute element={<SidebarView />} />} />
          <Route path="sidebar-add" element={<PrivateRoute element={<SidebarAdd />} />} />
          <Route path="manage-schema" element={<PrivateRoute element={<MDMSManager />} />} />
        </Routes>
      </AppContainer>
    </React.Fragment>
  );
};

export default App;
